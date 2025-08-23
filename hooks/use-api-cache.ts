import { useState, useEffect, useRef } from 'react'

// Global cache storage
const apiCache: { [key: string]: { data: any; timestamp: number } } = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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
      // Check cache first
      const cached = apiCache[cacheKey]
      if (cached && Date.now() - cached.timestamp < cacheDuration) {
        setData(cached.data)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        
        // Update cache
        apiCache[cacheKey] = {
          data: result,
          timestamp: Date.now()
        }
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
    delete apiCache[cacheKey]
    fetchedRef.current = false
  }

  return { data, loading, error, invalidateCache }
}

// Utility function to clear all cache
export const clearApiCache = () => {
  Object.keys(apiCache).forEach(key => delete apiCache[key])
}

// Utility function to clear specific cache keys
export const clearCacheByPattern = (pattern: string) => {
  Object.keys(apiCache).forEach(key => {
    if (key.includes(pattern)) {
      delete apiCache[key]
    }
  })
}
