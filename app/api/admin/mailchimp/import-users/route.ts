import { NextRequest } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { addToMailchimpList } from '@/lib/mailchimp'
import { validateEmailQuality } from '@/lib/email-validation'

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Check if user is admin
  const userResult = await query('SELECT is_admin FROM users WHERE email = $1', [session.user.email])
  
  if (!userResult.rows.length || !userResult.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: 'Admin access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const body = await request.json()
  const { source, skipInvalid = true, skipDisposable = true } = body

  if (!source || !['users', 'orders'].includes(source)) {
    return new Response(JSON.stringify({ error: 'Invalid source. Must be "users" or "orders"' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Create a readable stream for Server-Sent Events
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {

        // Get users/orders from database
        let dbResults: any[] = []
        
        sendEvent({ type: 'status', message: 'Fetching emails from database...' })
        
        if (source === 'users') {
          const result = await query(`
            SELECT 
              u.id,
              u.email,
              u.first_name,
              u.last_name,
              u.created_at,
              up.profile_image_url
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.email IS NOT NULL 
              AND u.email != ''
              AND u.email NOT LIKE 'deleted_%'
              AND u.status = 'active'
            ORDER BY u.created_at DESC
          `)
          dbResults = result.rows || []
        } else if (source === 'orders') {
          try {
            const result = await query(`
              SELECT DISTINCT
                o.id as order_id,
                COALESCE(o.payer_email, u.email) as email,
                u.first_name,
                u.last_name,
                o.created_at,
                o.total_amount,
                o.payer_email,
                u.email as user_email
              FROM orders o
              JOIN users u ON o.user_id = u.id
              WHERE (o.payer_email IS NOT NULL AND o.payer_email != '' AND o.payer_email NOT LIKE 'deleted_%') 
                 OR (u.email IS NOT NULL AND u.email != '' AND u.email NOT LIKE 'deleted_%')
              AND o.status = 'completed'
              ORDER BY o.created_at DESC
            `)
            dbResults = result.rows || []
          } catch (error: any) {
            if (error.message?.includes('payer_email')) {
              console.warn('payer_email column not found, using user email only')
              const result = await query(`
                SELECT DISTINCT
                  o.id as order_id,
                  u.email,
                  u.first_name,
                  u.last_name,
                  o.created_at,
                  o.total_amount,
                  u.email as user_email
                FROM orders o
                JOIN users u ON o.user_id = u.id
                WHERE u.email IS NOT NULL 
                  AND u.email != ''
                  AND u.email NOT LIKE 'deleted_%'
                  AND o.status = 'completed'
                ORDER BY o.created_at DESC
              `)
              dbResults = result.rows || []
            } else {
              throw error
            }
          }
        }

        sendEvent({ type: 'status', message: `Found ${dbResults.length} emails. Validating...` })

        // Validate emails
        const emails = dbResults.map(r => r.email).filter(Boolean)
        const validationResults = emails.map(email => ({
          email,
          validation: validateEmailQuality(email)
        }))

        // Filter based on options
        let toImport = validationResults.filter(v => {
          if (v.email.toLowerCase().startsWith('deleted_')) return false
          if (!v.validation.isValid && skipInvalid) return false
          if (v.validation.isDisposable && skipDisposable) return false
          if (v.validation.hasInvalidPattern && skipInvalid) return false
          return true
        })

        const results = {
          total: dbResults.length,
          valid: 0,
          invalid: 0,
          skipped: 0,
          imported: 0,
          failed: 0,
          errors: [] as string[]
        }

        results.invalid = validationResults.filter(v => !v.validation.isValid).length
        results.skipped = dbResults.length - toImport.length

        sendEvent({ 
          type: 'start', 
          total: toImport.length,
          skipped: results.skipped,
          invalid: results.invalid
        })

        // Import to Mailchimp with rate limiting and delays
        const delayBetweenRequests = 200
        
        for (let i = 0; i < toImport.length; i++) {
          const item = toImport[i]
          const dbRecord = dbResults.find(r => r.email === item.email)
          if (!dbRecord) continue

          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenRequests))
          }

          try {
            if (source === 'users') {
              await addToMailchimpList(item.email, {
                firstName: dbRecord.first_name,
                lastName: dbRecord.last_name,
                source: 'database-import-users',
                tags: ['imported-from-db', 'user']
              })
            } else {
              await addToMailchimpList(item.email, {
                firstName: dbRecord.first_name || '',
                lastName: dbRecord.last_name || '',
                source: 'database-import-orders',
                tags: ['imported-from-db', 'customer', 'has-ordered']
              })
            }
            results.imported++
            results.valid++
            
            // Send success event
            sendEvent({
              type: 'progress',
              email: item.email,
              status: 'imported',
              current: i + 1,
              total: toImport.length
            })
          } catch (error: any) {
            results.failed++
            const errorMsg = error.message || 'Unknown error'
            results.errors.push(`${item.email}: ${errorMsg}`)
            
            // Send failure event
            sendEvent({
              type: 'progress',
              email: item.email,
              status: 'failed',
              error: errorMsg,
              current: i + 1,
              total: toImport.length
            })
            
            if (errorMsg.includes('rate limit') || errorMsg.includes('503') || errorMsg.includes('429')) {
              sendEvent({ type: 'status', message: 'Rate limit hit, waiting 5 seconds...' })
              await new Promise(resolve => setTimeout(resolve, 5000))
            }
          }
        }

        // Send final results
        sendEvent({
          type: 'complete',
          results: {
            total: results.total,
            imported: results.imported,
            skipped: results.skipped,
            failed: results.failed,
            errors: results.errors.slice(0, 10) // Limit errors sent
          }
        })

        controller.close()
      } catch (error: any) {
        console.error('Error importing users:', error)
        sendEvent({
          type: 'error',
          error: error.message || 'Unknown error'
        })
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
