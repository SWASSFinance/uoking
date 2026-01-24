import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { addToMailchimpList } from '@/lib/mailchimp'
import { validateEmailQuality } from '@/lib/email-validation'
import { createNoCacheResponse } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return createNoCacheResponse(
        { error: 'Authentication required' },
        401
      )
    }

    // Check if user is admin
    const userResult = await query('SELECT is_admin FROM users WHERE email = $1', [session.user.email])
    
    if (!userResult.rows.length || !userResult.rows[0].is_admin) {
      return createNoCacheResponse(
        { error: 'Admin access required' },
        403
      )
    }

    const body = await request.json()
    const { source, skipInvalid = true, skipDisposable = true } = body

    if (!source || !['users', 'orders'].includes(source)) {
      return createNoCacheResponse(
        { error: 'Invalid source. Must be "users" or "orders"' },
        400
      )
    }

    // Get users/orders from database
    let dbResults: any[] = []
    
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
          AND u.status = 'active'
        ORDER BY u.created_at DESC
      `)
      dbResults = result.rows || []
    } else if (source === 'orders') {
      // Get both user email and payer email (PayPal payment email)
      // Prefer payer_email if available, as it's the actual payment email
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
        WHERE (o.payer_email IS NOT NULL AND o.payer_email != '') 
           OR (u.email IS NOT NULL AND u.email != '')
        AND o.status = 'completed'
        ORDER BY o.created_at DESC
      `)
      dbResults = result.rows || []
    }

    // Validate emails
    const emails = dbResults.map(r => r.email).filter(Boolean)
    const validationResults = emails.map(email => ({
      email,
      validation: validateEmailQuality(email)
    }))

    // Filter based on options
    let toImport = validationResults.filter(v => {
      if (!v.validation.isValid && skipInvalid) return false
      if (v.validation.isDisposable && skipDisposable) return false
      if (v.validation.hasInvalidPattern && skipInvalid) return false
      return true
    })

    // Import to Mailchimp
    const results = {
      total: dbResults.length,
      valid: 0,
      invalid: 0,
      skipped: 0,
      imported: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const item of toImport) {
      const dbRecord = dbResults.find(r => r.email === item.email)
      if (!dbRecord) continue

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
      } catch (error: any) {
        results.failed++
        results.errors.push(`${item.email}: ${error.message}`)
        // Continue with next email
      }
    }

    results.invalid = validationResults.filter(v => !v.validation.isValid).length
    results.skipped = dbResults.length - toImport.length

    return createNoCacheResponse({
      success: true,
      results,
      summary: {
        totalFound: dbResults.length,
        imported: results.imported,
        skipped: results.skipped,
        failed: results.failed
      }
    })

  } catch (error: any) {
    console.error('Error importing users:', error)
    return createNoCacheResponse(
      { 
        error: 'Failed to import users',
        details: error.message || 'Unknown error'
      },
      500
    )
  }
}
