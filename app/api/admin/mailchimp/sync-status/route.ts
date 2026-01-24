import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { getMailchimpSubscriber } from '@/lib/mailchimp'
import { createNoCacheResponse } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source') || 'users'
    const limit = parseInt(searchParams.get('limit') || '100')

    // Get database records
    let dbRecords: any[] = []
    
    if (source === 'users') {
      const result = await query(`
        SELECT 
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.created_at
        FROM users u
        WHERE u.email IS NOT NULL 
          AND u.email != ''
          AND u.status = 'active'
        ORDER BY u.created_at DESC
        LIMIT $1
      `, [limit])
      dbRecords = result.rows || []
    } else if (source === 'orders') {
      // Get both user email and payer email (PayPal payment email)
      // Prefer payer_email if available, as it's the actual payment email
      // Handle case where payer_email column might not exist yet
      try {
        const result = await query(`
          SELECT DISTINCT
            COALESCE(o.payer_email, u.email) as email,
            u.first_name,
            u.last_name,
            o.created_at,
            o.payer_email,
            u.email as user_email
          FROM orders o
          JOIN users u ON o.user_id = u.id
          WHERE (o.payer_email IS NOT NULL AND o.payer_email != '') 
             OR (u.email IS NOT NULL AND u.email != '')
          AND o.status = 'completed'
          ORDER BY o.created_at DESC
          LIMIT $1
        `, [limit])
        dbRecords = result.rows || []
      } catch (error: any) {
        // If payer_email column doesn't exist, fall back to user email only
        if (error.message?.includes('payer_email')) {
          console.warn('payer_email column not found, using user email only')
          const result = await query(`
            SELECT DISTINCT
              u.email,
              u.first_name,
              u.last_name,
              o.created_at,
              u.email as user_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE u.email IS NOT NULL 
              AND u.email != ''
              AND o.status = 'completed'
            ORDER BY o.created_at DESC
            LIMIT $1
          `, [limit])
          dbRecords = result.rows || []
        } else {
          throw error
        }
      }
    }

    // Check Mailchimp status for each
    const syncStatus = await Promise.all(
      dbRecords.map(async (record) => {
        try {
          const subscriber = await getMailchimpSubscriber(record.email)
          return {
            email: record.email,
            inMailchimp: !!subscriber,
            mailchimpStatus: subscriber?.status || null,
            inDatabase: true,
            source: source === 'users' ? 'users' : 'orders'
          }
        } catch (error) {
          return {
            email: record.email,
            inMailchimp: false,
            mailchimpStatus: null,
            inDatabase: true,
            source: source === 'users' ? 'users' : 'orders',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )

    const missingInMailchimp = syncStatus.filter(s => !s.inMailchimp)
    const inMailchimp = syncStatus.filter(s => s.inMailchimp)

    return createNoCacheResponse({
      total: syncStatus.length,
      inMailchimp: inMailchimp.length,
      missingInMailchimp: missingInMailchimp.length,
      missingEmails: missingInMailchimp.map(s => s.email),
      syncStatus
    })

  } catch (error: any) {
    console.error('Error getting sync status:', error)
    return createNoCacheResponse(
      { 
        error: 'Failed to get sync status',
        details: error.message || 'Unknown error'
      },
      500
    )
  }
}
