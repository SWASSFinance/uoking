import { useState, useEffect, useRef } from 'react'

// DISABLED: Global cache storage - NO CACHING
// const apiCache: { [key: string]: { data: any; timestamp: number } } = {}
const CACHE_DURATION = 0 // DISABLED: No caching

interface UseApiCacheOptions {
  cacheKey: string
  url: string
  dependencies?: any[]
  cacheDuration?: number
  enabled?: boolean
}

export function useApiCache<T = any>({
  cacheKey,
  url,
  dependencies = [],
  cacheDuration = CACHE_DURATION,
  enabled = true
}: UseApiCacheOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!enabled || fetchedRef.current) return

    const fetchData = async () => {
      // DISABLED: Check cache - always fetch fresh data
      // const cached = apiCache[cacheKey]
      // if (cached && Date.now() - cached.timestamp < cacheDuration) {
      //   setData(cached.data)
      //   return
      // }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        
        // DISABLED: Update cache - no caching
        // apiCache[cacheKey] = {
        //   data: result,
        //   timestamp: Date.now()
        // }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
        fetchedRef.current = true
      }
    }

    fetchData()
  }, [cacheKey, url, cacheDuration, enabled, ...dependencies])

  const invalidateCache = () => {
    // DISABLED: No cache to invalidate
    fetchedRef.current = false
  }

  return { data, loading, error, invalidateCache }
}

// DISABLED: Utility function to clear all cache
export const clearApiCache = () => {
  // DISABLED: No cache to clear
  return
}

// DISABLED: Utility function to clear specific cache keys
export const clearCacheByPattern = (pattern: string) => {
  // DISABLED: No cache to clear
  return
}
