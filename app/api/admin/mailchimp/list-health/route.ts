import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { createNoCacheResponse } from '@/lib/api-utils'

// Get Mailchimp configuration
const MAILCHIMP_API_KEY_RAW = process.env.MAILCHIMP_API_KEY || ''
let MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || ''

if (MAILCHIMP_API_KEY_RAW && !MAILCHIMP_SERVER_PREFIX) {
  const parts = MAILCHIMP_API_KEY_RAW.split('-')
  if (parts.length >= 2) {
    const possibleServer = parts[parts.length - 1]
    if (/^us\d+$/.test(possibleServer)) {
      MAILCHIMP_SERVER_PREFIX = possibleServer
    }
  }
}

const MAILCHIMP_API_URL = MAILCHIMP_SERVER_PREFIX 
  ? `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`
  : ''
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID

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

    if (!MAILCHIMP_API_KEY_RAW || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
      return createNoCacheResponse(
        { error: 'Mailchimp configuration is missing' },
        400
      )
    }

    const authString = Buffer.from(`${MAILCHIMP_API_KEY_RAW}:${MAILCHIMP_API_KEY_RAW}`).toString('base64')

    // Get list members with different statuses
    const [subscribed, unsubscribed, cleaned, pending] = await Promise.all([
      fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_LIST_ID}/members?status=subscribed&count=1000`, {
        headers: { 'Authorization': `Basic ${authString}` }
      }).then(r => r.ok ? r.json() : { members: [] }),
      fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_LIST_ID}/members?status=unsubscribed&count=1000`, {
        headers: { 'Authorization': `Basic ${authString}` }
      }).then(r => r.ok ? r.json() : { members: [] }),
      fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_LIST_ID}/members?status=cleaned&count=1000`, {
        headers: { 'Authorization': `Basic ${authString}` }
      }).then(r => r.ok ? r.json() : { members: [] }),
      fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_LIST_ID}/members?status=pending&count=1000`, {
        headers: { 'Authorization': `Basic ${authString}` }
      }).then(r => r.ok ? r.json() : { members: [] })
    ])

    // Get bounced emails (need to check each member's status_detail)
    const bouncedEmails: string[] = []
    const allMembers = [
      ...(subscribed.members || []),
      ...(unsubscribed.members || []),
      ...(cleaned.members || []),
      ...(pending.members || [])
    ]

    allMembers.forEach((member: any) => {
      if (member.status_detail === 'bounced' || member.status_detail === 'hard_bounce') {
        bouncedEmails.push(member.email_address)
      }
    })

    return createNoCacheResponse({
      subscribed: {
        count: subscribed.members?.length || 0,
        emails: subscribed.members?.map((m: any) => m.email_address) || []
      },
      unsubscribed: {
        count: unsubscribed.members?.length || 0,
        emails: unsubscribed.members?.map((m: any) => m.email_address) || []
      },
      cleaned: {
        count: cleaned.members?.length || 0,
        emails: cleaned.members?.map((m: any) => m.email_address) || []
      },
      pending: {
        count: pending.members?.length || 0,
        emails: pending.members?.map((m: any) => m.email_address) || []
      },
      bounced: {
        count: bouncedEmails.length,
        emails: bouncedEmails
      },
      total: allMembers.length
    })

  } catch (error: any) {
    console.error('Error getting list health:', error)
    return createNoCacheResponse(
      { 
        error: 'Failed to get list health',
        details: error.message || 'Unknown error'
      },
      500
    )
  }
}
