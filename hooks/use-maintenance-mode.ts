import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface MaintenanceStatus {
  isEnabled: boolean
  message?: string
  isLoading: boolean
  error?: string
}

export function useMaintenanceMode(): MaintenanceStatus {
  const [status, setStatus] = useState<MaintenanceStatus>({
    isEnabled: false,
    isLoading: true,
    error: undefined
  })
  const pathname = usePathname()

  useEffect(() => {
    // Don't fetch maintenance status on admin pages or API routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/api')) {
      setStatus({
        isEnabled: false,
        isLoading: false,
        error: undefined
      })
      return
    }

    const fetchMaintenanceStatus = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          
          // Cache the result
          localStorage.setItem('maintenance_status', JSON.stringify({
            data: data,
            timestamp: Date.now()
          }))
          
          setStatus({
            isEnabled: data.maintenance_mode || false,
            message: data.maintenance_message || undefined,
            isLoading: false,
            error: undefined
          })
        } else {
          setStatus({
            isEnabled: false,
            isLoading: false,
            error: 'Failed to fetch maintenance status'
          })
        }
      } catch (error) {
        console.error('Error fetching maintenance status:', error)
        setStatus({
          isEnabled: false,
          isLoading: false,
          error: 'Network error'
        })
      }
    }

    // Check cache first (5 minute cache)
    const CACHE_KEY = 'maintenance_status'
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
    
    const cachedData = localStorage.getItem(CACHE_KEY)
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setStatus({
            isEnabled: data.maintenance_mode || false,
            message: data.maintenance_message || undefined,
            isLoading: false,
            error: undefined
          })
          return // Use cached data, don't poll
        }
      } catch (e) {
        // Invalid cache, fetch fresh data
      }
    }

    fetchMaintenanceStatus()

    // DISABLED: Constant polling removed to save database compute
    // Only fetch once per page load, cache for 5 minutes
    // If you need real-time maintenance mode, enable this with a much longer interval (5-10 minutes)
    
    // const interval = setInterval(fetchMaintenanceStatus, 5 * 60 * 1000) // 5 minutes
    // return () => clearInterval(interval)
  }, [pathname])

  return status
}
