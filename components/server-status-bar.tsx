"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { pingLoginServer } from "@/lib/login-ping"

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
  useEffect(() => {
    refreshStatus()
  }, [])

  const refreshStatus = async () => {
    try {
      // Ping the login server directly from the user's browser
      const pingResult = await pingLoginServer(3000) // 3 second timeout
      
      setLoginStatus({
        status: pingResult.status === 'online' ? 'online' : 'offline',
        responseTime: pingResult.latency || undefined
      })
    } catch (error) {
      console.error('Failed to ping login server:', error)
      // Keep existing data on error
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
