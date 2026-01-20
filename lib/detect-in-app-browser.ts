/**
 * Detects if the user is in an in-app browser (webview)
 * Google OAuth requires a secure browser and blocks in-app browsers
 */

export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = window.navigator.userAgent.toLowerCase()
  
  // Common in-app browser indicators
  const inAppBrowserPatterns = [
    'messenger',           // Facebook Messenger
    'fbios',              // Facebook iOS
    'fban',               // Facebook Android
    'fbsv',               // Facebook
    'line',               // LINE app
    'wechat',             // WeChat
    'whatsapp',           // WhatsApp
    'instagram',          // Instagram
    'snapchat',           // Snapchat
    'twitter',            // Twitter
    'linkedin',           // LinkedIn
    'wv',                 // Android WebView
    'webview',            // Generic webview
    'wv)',                // Android WebView (with version)
  ]

  // Check if user agent matches any in-app browser pattern
  return inAppBrowserPatterns.some(pattern => userAgent.includes(pattern))
}

export function getBrowserName(): string {
  if (typeof window === 'undefined') return 'Unknown'

  const userAgent = window.navigator.userAgent.toLowerCase()
  
  if (userAgent.includes('messenger')) return 'Messenger'
  if (userAgent.includes('instagram')) return 'Instagram'
  if (userAgent.includes('whatsapp')) return 'WhatsApp'
  if (userAgent.includes('wechat')) return 'WeChat'
  if (userAgent.includes('line')) return 'LINE'
  if (userAgent.includes('snapchat')) return 'Snapchat'
  if (userAgent.includes('twitter')) return 'Twitter'
  if (userAgent.includes('linkedin')) return 'LinkedIn'
  if (userAgent.includes('wv') || userAgent.includes('webview')) return 'In-App Browser'
  
  return 'Unknown'
}
