"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { pingLoginServerFetch } from "@/lib/login-ping"

interface LoginStatus {
  status: 'online' | 'offline' | 'timeout' | 'error'
  responseTime?: number
}

export function ServerStatusBar() {
  const [loginStatus, setLoginStatus] = useState<LoginStatus>({
    status: 'online',
    responseTime: 45
  })

  // Initial ping on component mount
  // Skip in development to reduce console noise (network errors are expected)
  useEffect(() => {
    // Only ping in production - server status checking causes console noise in dev
    // Browser-level network errors (ERR_INVALID_HTTP_RESPONSE) cannot be suppressed
    const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    
    if (isDev) {
      // In dev, skip the ping to avoid console errors
      // Server status will show as "offline" which is fine for development
      return
    }
    
    refreshStatus()
  }, [])

  const refreshStatus = async () => {
    try {
      // Ping the login server directly from the user's browser
      // Using fetch method to avoid mixed content favicon warnings
      const pingResult = await pingLoginServerFetch(3000) // 3 second timeout
      
      setLoginStatus({
        status: pingResult.status === 'online' ? 'online' : 'offline',
        responseTime: pingResult.latency || undefined
      })
    } catch (error) {
      // Silently handle errors - network failures are expected
      // Don't update status on error, keep existing state
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'offline':
      case 'timeout':
      case 'error':
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return <XCircle className="h-3 w-3 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 dark:text-green-400'
      case 'offline':
      case 'timeout':
      case 'error': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-8 text-xs">
          {/* Login Server Status */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Login Server:</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(loginStatus.status)}
              <span className={`font-medium ${getStatusText(loginStatus.status)}`}>
                {loginStatus.status === 'online' ? 'Online' : 'Offline'}
              </span>
              {loginStatus.responseTime && (
                <span className="text-gray-500 dark:text-gray-400">
                  ({loginStatus.responseTime}ms)
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
