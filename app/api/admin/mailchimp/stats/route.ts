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

    // Check environment variables and extract server prefix if needed
    const apiKeyRaw = process.env.MAILCHIMP_API_KEY || ''
    let serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || ''
    
    // If server prefix not set, try to extract from API key
    if (apiKeyRaw && !serverPrefix) {
      const parts = apiKeyRaw.split('-')
      if (parts.length >= 2) {
        const possibleServer = parts[parts.length - 1]
        // Check if it looks like a server prefix (starts with 'us' followed by digits)
        if (/^us\d+$/.test(possibleServer)) {
          serverPrefix = possibleServer
        }
      }
    }

    const config = {
      hasApiKey: !!apiKeyRaw,
      hasServerPrefix: !!serverPrefix,
      hasListId: !!process.env.MAILCHIMP_LIST_ID,
      serverPrefix: serverPrefix || 'Not set',
      listId: process.env.MAILCHIMP_LIST_ID || 'Not set',
      apiKeyPrefix: apiKeyRaw ? `${apiKeyRaw.substring(0, 10)}...` : 'Not set',
      apiKeyLength: apiKeyRaw.length,
      apiKeyFormat: apiKeyRaw && !process.env.MAILCHIMP_SERVER_PREFIX && serverPrefix 
        ? 'Extracted from API key' 
        : 'Separate variables',
      errors: [] as string[]
    }

    // Validate configuration before making API calls
    if (!apiKeyRaw) {
      config.errors.push('MAILCHIMP_API_KEY environment variable is not set')
    } else if (apiKeyRaw.length < 10) {
      config.errors.push(`MAILCHIMP_API_KEY appears to be invalid (too short: ${apiKeyRaw.length} characters)`)
    }

    if (!serverPrefix) {
      config.errors.push('Server prefix could not be determined. MAILCHIMP_SERVER_PREFIX is not set and could not be extracted from API key.')
    } else if (!/^us\d+$/.test(serverPrefix)) {
      config.errors.push(`Server prefix "${serverPrefix}" does not match expected format (us followed by digits)`)
    }

    if (!process.env.MAILCHIMP_LIST_ID) {
      config.errors.push('MAILCHIMP_LIST_ID environment variable is not set')
    } else if (process.env.MAILCHIMP_LIST_ID.length < 3) {
      config.errors.push(`MAILCHIMP_LIST_ID appears to be invalid (too short: ${process.env.MAILCHIMP_LIST_ID.length} characters)`)
    }

    // If there are configuration errors, return them without trying to call Mailchimp
    if (config.errors.length > 0) {
      return createNoCacheResponse({
        config,
        apiStats: {
          totalApiCalls: 0,
          rateLimitedCalls: 0,
          activeRateLimits: 0
        },
        listStats: null,
        error: 'Configuration errors detected',
        errorDetails: config.errors
      })
    }

    // Try to get Mailchimp list statistics
    let listStats = null
    let apiStats = null
    let apiError = null

    try {
      apiStats = getMailchimpStats()
    } catch (error: any) {
      console.error('Error getting API stats:', error)
      apiError = error.message || 'Failed to get API statistics'
    }

    try {
      listStats = await getMailchimpListStats()
    } catch (error: any) {
      console.error('Error getting Mailchimp list stats:', error)
      
      // Provide detailed error information
      let errorMessage = error.message || 'Unknown error'
      let errorDetails = null

      // Try to extract more details from the error
      if (error.message) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = 'Authentication failed - Invalid API key'
          errorDetails = 'The API key may be incorrect or expired. Please verify your MAILCHIMP_API_KEY in .env.local'
        } else if (error.message.includes('404') || error.message.includes('Not Found') || error.message.includes('could not be found')) {
          errorMessage = 'List ID not found'
          errorDetails = `The List ID "${process.env.MAILCHIMP_LIST_ID}" was not found in your Mailchimp account. This usually means the List ID is incorrect. Check the "Find Your List ID" section above to see your available lists.`
        } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMessage = 'Access forbidden'
          errorDetails = 'The API key does not have permission to access this list. Check your Mailchimp account permissions.'
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded'
          errorDetails = 'Too many API requests. Please wait a moment and try again.'
        }
      }

      apiError = {
        message: errorMessage,
        details: errorDetails,
        originalError: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }

    return createNoCacheResponse({
      listStats,
      apiStats: apiStats || {
        totalApiCalls: 0,
        rateLimitedCalls: 0,
        activeRateLimits: 0
      },
      config,
      error: apiError ? apiError.message : null,
      errorDetails: apiError
    })

  } catch (error: any) {
    console.error('Error getting Mailchimp stats:', error)
    return createNoCacheResponse(
      { 
        error: 'Failed to get Mailchimp statistics',
        details: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        config: {
          hasApiKey: !!process.env.MAILCHIMP_API_KEY,
          hasServerPrefix: !!process.env.MAILCHIMP_SERVER_PREFIX,
          hasListId: !!process.env.MAILCHIMP_LIST_ID,
          serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'Not set',
          listId: process.env.MAILCHIMP_LIST_ID || 'Not set',
          apiKeyPrefix: process.env.MAILCHIMP_API_KEY ? `${process.env.MAILCHIMP_API_KEY.substring(0, 10)}...` : 'Not set'
        }
      },
      500
    )
  }
}
