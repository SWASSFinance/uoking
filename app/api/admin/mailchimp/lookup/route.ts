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
    const email = searchParams.get('email')

    if (!email) {
      return createNoCacheResponse(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Lookup subscriber in Mailchimp
    const subscriber = await getMailchimpSubscriber(email)

    if (!subscriber) {
      return createNoCacheResponse({
        found: false,
        message: 'Subscriber not found in Mailchimp'
      })
    }

    return createNoCacheResponse({
      found: true,
      subscriber
    })

  } catch (error: any) {
    console.error('Error looking up Mailchimp subscriber:', error)
    return createNoCacheResponse(
      { 
        error: 'Failed to lookup subscriber',
        details: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
