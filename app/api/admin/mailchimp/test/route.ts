import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { addToMailchimpList, getMailchimpSubscriber } from '@/lib/mailchimp'
import { createNoCacheResponse } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { email, firstName, lastName, characterName, mainShard, source, tags } = body

    if (!email) {
      return createNoCacheResponse(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Try to add to Mailchimp
    const result = await addToMailchimpList(email, {
      firstName,
      lastName,
      characterName,
      mainShard,
      source: source || 'admin-test',
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : []
    })

    return createNoCacheResponse({
      success: true,
      message: 'Email added to Mailchimp successfully',
      result
    })

  } catch (error: any) {
    console.error('Error testing Mailchimp:', error)
    return createNoCacheResponse(
      { 
        error: 'Failed to add email to Mailchimp',
        details: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
