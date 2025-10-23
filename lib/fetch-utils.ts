/**
 * Cache-busting fetch utility for frontend components
 * Use this instead of regular fetch to prevent caching issues
 */

export function createNoCacheFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const cacheBuster = `?t=${Date.now()}`
  const urlWithCacheBuster = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}${cacheBuster}`
  
  return fetch(urlWithCacheBuster, {
    ...options,
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...options.headers
    }
  })
}

/**
 * Cache-busting fetch for API calls
 */
export async function fetchApi(url: string, options: RequestInit = {}): Promise<Response> {
  return createNoCacheFetch(url, options)
}

/**
 * Cache-busting fetch with JSON response
 */
export async function fetchApiJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await createNoCacheFetch(url, options)
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}
