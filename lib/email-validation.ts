/**
 * Email validation and quality checking utilities
 */

// Common disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com', 'tempmail.com', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'mohmal.com',
  'fakeinbox.com', 'yopmail.com', 'sharklasers.com', 'trashmail.com',
  'mintemail.com', 'emailondeck.com', 'getairmail.com', 'meltmail.com'
]

// Invalid email patterns
const INVALID_PATTERNS = [
  /^test@/i,
  /^admin@/i,
  /^noreply@/i,
  /^no-reply@/i,
  /@example\./i,
  /@test\./i,
  /@localhost/i,
  /^[a-z0-9]+@[a-z0-9]+$/i, // Too simple (no domain extension)
]

/**
 * Validates email format
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Checks if email is from a disposable/temporary email service
 */
export function isDisposableEmail(email: string): boolean {
  if (!email) return false
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  
  return DISPOSABLE_EMAIL_DOMAINS.some(disposable => domain.includes(disposable))
}

/**
 * Checks if email matches invalid patterns (test, admin, etc.)
 */
export function hasInvalidPattern(email: string): boolean {
  if (!email) return true
  
  return INVALID_PATTERNS.some(pattern => pattern.test(email))
}

/**
 * Validates email quality
 * Returns object with validation results
 */
export function validateEmailQuality(email: string): {
  isValid: boolean
  isDisposable: boolean
  hasInvalidPattern: boolean
  quality: 'good' | 'questionable' | 'bad'
  issues: string[]
} {
  const issues: string[] = []
  
  if (!isValidEmailFormat(email)) {
    return {
      isValid: false,
      isDisposable: false,
      hasInvalidPattern: false,
      quality: 'bad',
      issues: ['Invalid email format']
    }
  }
  
  const isDisposable = isDisposableEmail(email)
  const hasInvalid = hasInvalidPattern(email)
  
  if (isDisposable) {
    issues.push('Disposable email address')
  }
  
  if (hasInvalid) {
    issues.push('Matches invalid pattern (test/admin/example)')
  }
  
  let quality: 'good' | 'questionable' | 'bad' = 'good'
  if (issues.length > 0) {
    quality = issues.length >= 2 ? 'bad' : 'questionable'
  }
  
  return {
    isValid: true,
    isDisposable,
    hasInvalidPattern: hasInvalid,
    quality,
    issues
  }
}

/**
 * Batch validate multiple emails
 */
export function validateEmails(emails: string[]): {
  valid: string[]
  invalid: string[]
  disposable: string[]
  questionable: string[]
  results: Map<string, ReturnType<typeof validateEmailQuality>>
} {
  const valid: string[] = []
  const invalid: string[] = []
  const disposable: string[] = []
  const questionable: string[] = []
  const results = new Map<string, ReturnType<typeof validateEmailQuality>>()
  
  emails.forEach(email => {
    const validation = validateEmailQuality(email)
    results.set(email, validation)
    
    if (!validation.isValid) {
      invalid.push(email)
    } else if (validation.isDisposable || validation.hasInvalidPattern) {
      if (validation.quality === 'bad') {
        invalid.push(email)
      } else {
        questionable.push(email)
      }
      if (validation.isDisposable) {
        disposable.push(email)
      }
    } else {
      valid.push(email)
    }
  })
  
  return {
    valid,
    invalid,
    disposable,
    questionable,
    results
  }
}
