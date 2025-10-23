import { NextResponse } from 'next/server'

/**
 * Adds cache-busting headers to prevent any caching of API responses
 * Use this for all API endpoints to ensure fresh data
 */
export function addNoCacheHeaders(response: NextResponse): NextResponse {
  // Prevent all types of caching
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.set('Surrogate-Control', 'no-store')
  response.headers.set('Last-Modified', new Date().toUTCString())
  response.headers.set('ETag', `"${Date.now()}"`)
  
  return response
}

/**
 * Creates a NextResponse with cache-busting headers
 */
export function createNoCacheResponse(data: any, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status })
  return addNoCacheHeaders(response)
}

/**
 * Creates a cache-busting fetch request
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
