import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { getMailchimpListStats, getMailchimpStats } from '@/lib/mailchimp'
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

    // Get Mailchimp list statistics
    const listStats = await getMailchimpListStats()
    const apiStats = getMailchimpStats()

    // Check environment variables
    const config = {
      hasApiKey: !!process.env.MAILCHIMP_API_KEY,
      hasServerPrefix: !!process.env.MAILCHIMP_SERVER_PREFIX,
      hasListId: !!process.env.MAILCHIMP_LIST_ID,
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'Not set',
      listId: process.env.MAILCHIMP_LIST_ID || 'Not set',
      apiKeyPrefix: process.env.MAILCHIMP_API_KEY ? `${process.env.MAILCHIMP_API_KEY.substring(0, 10)}...` : 'Not set'
    }

    return createNoCacheResponse({
      listStats,
      apiStats,
      config
    })

  } catch (error: any) {
    console.error('Error getting Mailchimp stats:', error)
    return createNoCacheResponse(
      { 
        error: 'Failed to get Mailchimp statistics',
        details: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
