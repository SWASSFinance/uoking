import crypto from 'crypto'

// Mailchimp API configuration
const MAILCHIMP_API_KEY_RAW = process.env.MAILCHIMP_API_KEY || ''
const MAILCHIMP_SERVER_PREFIX_ENV = process.env.MAILCHIMP_SERVER_PREFIX
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID

// Extract server prefix from API key if it's in the format: {key}-{server}
// Mailchimp API keys can be: "key-us18" or just "key" with separate server prefix
// For authentication, we use the FULL API key (including server prefix)
// For the API URL, we need just the server prefix part
let MAILCHIMP_SERVER_PREFIX = MAILCHIMP_SERVER_PREFIX_ENV
const MAILCHIMP_API_KEY = MAILCHIMP_API_KEY_RAW // Always use full key for auth

if (MAILCHIMP_API_KEY_RAW && !MAILCHIMP_SERVER_PREFIX_ENV) {
  // Try to extract server prefix from API key (format: key-server)
  const parts = MAILCHIMP_API_KEY_RAW.split('-')
  if (parts.length >= 2) {
    // Last part is typically the server prefix (e.g., us18, us1, etc.)
    const possibleServer = parts[parts.length - 1]
    // Check if it looks like a server prefix (starts with 'us' followed by digits)
    if (/^us\d+$/.test(possibleServer)) {
      MAILCHIMP_SERVER_PREFIX = possibleServer
    }
  }
}

// Mailchimp API base URL
const MAILCHIMP_API_URL = MAILCHIMP_SERVER_PREFIX 
  ? `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`
  : ''

// Rate limiting for Mailchimp API calls
const mailchimpRateLimits = new Map<string, { count: number; resetTime: number }>()

// Check rate limit for Mailchimp API
function checkMailchimpRateLimit(limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const key = 'mailchimp:api'
  const record = mailchimpRateLimits.get(key)
  
  if (!record || now > record.resetTime) {
    mailchimpRateLimits.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

// Retry utility with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      
      // Check if error is retryable (503, 429, network errors)
      const isRetryable = 
        error.message?.includes('503') ||
        error.message?.includes('429') ||
        error.message?.includes('akamai_503') ||
        error.message?.includes('rate limit') ||
        error.message?.includes('timeout') ||
        error.message?.includes('ECONNRESET') ||
        error.message?.includes('ETIMEDOUT')
      
      if (!isRetryable || attempt === maxRetries) {
        throw error
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        initialDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      )
      
      console.log(`Mailchimp API retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms delay`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError || new Error('Retry failed')
}

// Sleep utility
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Generate MD5 hash for email (required by Mailchimp)
function generateEmailHash(email: string): string {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
}

// Add subscriber to Mailchimp list
export async function addToMailchimpList(
  email: string,
  data: {
    firstName?: string
    lastName?: string
    characterName?: string
    mainShard?: string
    tags?: string[]
    source?: string
  } = {}
) {
  try {
    // Validate required environment variables
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
      throw new Error('Mailchimp configuration is missing. Please check environment variables.')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address')
    }

    // Check rate limiting
    if (!checkMailchimpRateLimit()) {
      throw new Error('Mailchimp API rate limit exceeded. Please try again later.')
    }

    // Prepare subscriber data
    const subscriberData = {
      email_address: email.toLowerCase(),
      status: 'subscribed',
      merge_fields: {
        FNAME: data.firstName || '',
        LNAME: data.lastName || '',
        CHARACTER: data.characterName || '',
        SHARD: data.mainShard || ''
      },
      tags: [
        ...(data.tags || []),
        data.source ? `source:${data.source}` : 'source:website',
        'uo-king-customer'
      ],
      marketing_permissions: [
        {
          marketing_permission_id: 'email_marketing',
          enabled: true
        }
      ]
    }

    // Make API request to Mailchimp with retry logic
    // Mailchimp API v3 uses Basic auth: base64(apikey:apikey)
    const authString = Buffer.from(`${MAILCHIMP_API_KEY}:${MAILCHIMP_API_KEY}`).toString('base64')
    
    try {
      const response = await retryWithBackoff(async () => {
        const res = await fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_LIST_ID}/members`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(subscriberData),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        })
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          const errorMessage = errorData.detail || errorData.title || `HTTP ${res.status}`
          
          // Handle "Member Exists" error - don't retry, update instead
          if (res.status === 400 && errorData.title === 'Member Exists') {
            throw new Error('MEMBER_EXISTS') // Special error to trigger update
          }
          
          throw new Error(`Mailchimp API error: ${errorMessage}`)
        }
        
        return res
      })

      const result = await response.json()
      console.log(`Successfully added ${email} to Mailchimp list:`, result.id)

      return {
        success: true,
        memberId: result.id,
        email: result.email_address,
        status: result.status
      }
    } catch (error: any) {
      // Handle "Member Exists" case - update existing member
      if (error.message === 'MEMBER_EXISTS' || error.message?.includes('Member Exists')) {
        return await updateMailchimpMember(email, data)
      }
      throw error
    }

  } catch (error) {
    console.error('Error adding to Mailchimp list:', error)
    throw error
  }
}

// Update existing Mailchimp member
async function updateMailchimpMember(
  email: string,
  data: {
    firstName?: string
    lastName?: string
    characterName?: string
    mainShard?: string
    tags?: string[]
    source?: string
  } = {}
) {
  try {
    const emailHash = generateEmailHash(email)
    
    const updateData = {
      merge_fields: {
        FNAME: data.firstName || '',
        LNAME: data.lastName || '',
        CHARACTER: data.characterName || '',
        SHARD: data.mainShard || ''
      },
      tags: [
        ...(data.tags || []),
        data.source ? `source:${data.source}` : 'source:website',
        'uo-king-customer'
      ]
    }

    const authString = Buffer.from(`${MAILCHIMP_API_KEY}:${MAILCHIMP_API_KEY}`).toString('base64')
    const response = await retryWithBackoff(async () => {
      const res = await fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.title || `HTTP ${res.status}`
        throw new Error(`Mailchimp API error: ${errorMessage}`)
      }
      
      return res
    })

    const result = await response.json()
    console.log(`Successfully updated ${email} in Mailchimp list:`, result.id)

    return {
      success: true,
      memberId: result.id,
      email: result.email_address,
      status: result.status,
      updated: true
    }

  } catch (error) {
    console.error('Error updating Mailchimp member:', error)
    throw error
  }
}

// Remove subscriber from Mailchimp list
export async function removeFromMailchimpList(email: string) {
  try {
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
      throw new Error('Mailchimp configuration is missing.')
    }

    const emailHash = generateEmailHash(email)

    const authString = Buffer.from(`${MAILCHIMP_API_KEY}:${MAILCHIMP_API_KEY}`).toString('base64')
    const response = await fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${authString}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Mailchimp API error: ${errorData.detail || errorData.title || 'Unknown error'}`)
    }

    console.log(`Successfully removed ${email} from Mailchimp list`)

    return {
      success: true,
      email
    }

  } catch (error) {
    console.error('Error removing from Mailchimp list:', error)
    throw error
  }
}

// Get subscriber info from Mailchimp
export async function getMailchimpSubscriber(email: string) {
  try {
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
      throw new Error('Mailchimp configuration is missing.')
    }

    const emailHash = generateEmailHash(email)

    const authString = Buffer.from(`${MAILCHIMP_API_KEY}:${MAILCHIMP_API_KEY}`).toString('base64')
    const response = await fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null // Subscriber not found
      }
      const errorData = await response.json()
      throw new Error(`Mailchimp API error: ${errorData.detail || errorData.title || 'Unknown error'}`)
    }

    const result = await response.json()
    return {
      id: result.id,
      email: result.email_address,
      status: result.status,
      mergeFields: result.merge_fields,
      tags: result.tags?.map((tag: any) => tag.name) || []
    }

  } catch (error) {
    console.error('Error getting Mailchimp subscriber:', error)
    throw error
  }
}

// Add customer to Mailchimp (for new registrations)
export async function addCustomerToMailchimp(userData: {
  email: string
  firstName?: string
  lastName?: string
  characterName?: string
  mainShard?: string
  source?: string
}) {
  return addToMailchimpList(userData.email, {
    firstName: userData.firstName,
    lastName: userData.lastName,
    characterName: userData.characterName,
    mainShard: userData.mainShard,
    tags: ['customer', 'new-registration'],
    source: userData.source || 'registration'
  })
}

// Add order customer to Mailchimp (for completed orders)
export async function addOrderCustomerToMailchimp(orderData: {
  email: string
  firstName?: string
  lastName?: string
  characterName?: string
  mainShard?: string
  orderId: string
  orderTotal: number
}) {
  return addToMailchimpList(orderData.email, {
    firstName: orderData.firstName,
    lastName: orderData.lastName,
    characterName: orderData.characterName,
    mainShard: orderData.mainShard,
    tags: ['customer', 'has-ordered', `order-${orderData.orderId}`, `spent-${Math.floor(orderData.orderTotal)}`],
    source: 'order-completion'
  })
}

// Get Mailchimp list statistics
export async function getMailchimpListStats() {
  try {
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
      throw new Error('Mailchimp configuration is missing.')
    }

    const authString = Buffer.from(`${MAILCHIMP_API_KEY}:${MAILCHIMP_API_KEY}`).toString('base64')
    const response = await fetch(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_LIST_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Mailchimp API error: ${errorData.detail || errorData.title || 'Unknown error'}`)
    }

    const result = await response.json()
    return {
      listName: result.name,
      totalSubscribers: result.stats.member_count,
      unsubscribeCount: result.stats.unsubscribe_count,
      cleanedCount: result.stats.cleaned_count,
      memberCountSinceSendCampaign: result.stats.member_count_since_send_campaign,
      openRate: result.stats.open_rate,
      clickRate: result.stats.click_rate,
      lastSubDate: result.stats.last_sub_date,
      lastUnsubDate: result.stats.last_unsub_date
    }

  } catch (error) {
    console.error('Error getting Mailchimp list stats:', error)
    throw error
  }
}

// Get Mailchimp API rate limit statistics
export function getMailchimpStats() {
  const stats = {
    totalApiCalls: 0,
    rateLimitedCalls: 0,
    activeRateLimits: 0
  }

  for (const [key, record] of mailchimpRateLimits.entries()) {
    if (key.startsWith('mailchimp:')) {
      stats.totalApiCalls += record.count
      if (Date.now() < record.resetTime) {
        stats.activeRateLimits++
      }
    }
  }

  return stats
}
