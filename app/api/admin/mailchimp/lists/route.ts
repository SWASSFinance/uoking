import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
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

    // Get Mailchimp configuration
    const apiKeyRaw = process.env.MAILCHIMP_API_KEY || ''
    let serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || ''
    
    // Extract server prefix from API key if not set
    if (apiKeyRaw && !serverPrefix) {
      const parts = apiKeyRaw.split('-')
      if (parts.length >= 2) {
        const possibleServer = parts[parts.length - 1]
        if (/^us\d+$/.test(possibleServer)) {
          serverPrefix = possibleServer
        }
      }
    }

    if (!apiKeyRaw || !serverPrefix) {
      return createNoCacheResponse(
        { 
          error: 'Mailchimp configuration is missing',
          details: 'MAILCHIMP_API_KEY and server prefix are required'
        },
        { status: 400 }
      )
    }

    // Create Basic auth header
    const authString = Buffer.from(`${apiKeyRaw}:${apiKeyRaw}`).toString('base64')
    const apiUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`

    // Fetch all lists from Mailchimp
    const response = await fetch(`${apiUrl}/lists?count=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      let errorMessage = 'Failed to fetch Mailchimp lists'
      let errorDetails = null

      if (response.status === 401) {
        errorMessage = 'Authentication failed - Invalid API key'
        errorDetails = 'The API key may be incorrect or expired. Please verify your MAILCHIMP_API_KEY in .env.local'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden'
        errorDetails = 'The API key does not have permission to access lists. Check your Mailchimp account permissions.'
      } else {
        errorMessage = errorData.detail || errorData.title || errorMessage
        errorDetails = errorData.detail || `HTTP ${response.status}`
      }

      return createNoCacheResponse(
        {
          error: errorMessage,
          details: errorDetails,
          httpStatus: response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    const lists = data.lists || []

    // Format the lists for display
    const formattedLists = lists.map((list: any) => ({
      id: list.id,
      name: list.name,
      memberCount: list.stats?.member_count || 0,
      webId: list.web_id,
      dateCreated: list.date_created,
      visibility: list.visibility
    }))

    return createNoCacheResponse({
      success: true,
      lists: formattedLists,
      total: formattedLists.length,
      currentListId: process.env.MAILCHIMP_LIST_ID || null
    })

  } catch (error: any) {
    console.error('Error fetching Mailchimp lists:', error)
    return createNoCacheResponse(
      { 
        error: 'Failed to fetch Mailchimp lists',
        details: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
