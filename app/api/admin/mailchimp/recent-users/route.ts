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
        { status: 401 }
      )
    }

    // Check if user is admin
    const userResult = await query('SELECT is_admin FROM users WHERE email = $1', [session.user.email])
    
    if (!userResult.rows.length || !userResult.rows[0].is_admin) {
      return createNoCacheResponse(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get recent users from database
    const usersResult = await query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.created_at,
        u.last_login_at,
        up.profile_image_url
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ORDER BY u.created_at DESC
      LIMIT $1
    `, [limit])

    const users = usersResult.rows || []

    // Check each user's Mailchimp status
    const usersWithMailchimpStatus = await Promise.all(
      users.map(async (user: any) => {
        try {
          const subscriber = await getMailchimpSubscriber(user.email)
          return {
            ...user,
            inMailchimp: !!subscriber,
            mailchimpStatus: subscriber?.status || null,
            mailchimpTags: subscriber?.tags || []
          }
        } catch (error) {
          return {
            ...user,
            inMailchimp: false,
            mailchimpError: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )

    return createNoCacheResponse({
      users: usersWithMailchimpStatus,
      total: usersWithMailchimpStatus.length
    })

  } catch (error: any) {
    console.error('Error getting recent users:', error)
    return createNoCacheResponse(
      { 
        error: 'Failed to get recent users',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
