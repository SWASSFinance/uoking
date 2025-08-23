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

    fetchMaintenanceStatus()

    // Poll for maintenance status changes every 30 seconds
    const interval = setInterval(fetchMaintenanceStatus, 30000)

    return () => clearInterval(interval)
  }, [pathname])

  return status
}
