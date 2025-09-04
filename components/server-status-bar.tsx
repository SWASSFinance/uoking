"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { pingMultipleServers, getKeyServers, UO_SERVERS } from "@/lib/ping-utils"

interface ServerStatus {
  name: string
  status: 'online' | 'offline' | 'lag' | 'timeout' | 'error'
  responseTime?: number
}

export function ServerStatusBar() {
  const [servers, setServers] = useState<ServerStatus[]>([
    { name: 'Login', status: 'online', responseTime: 45 },
    { name: 'Patch', status: 'online', responseTime: 32 },
    { name: 'Atlantic', status: 'online', responseTime: 28 }
  ])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Initial ping on component mount
  useEffect(() => {
    refreshStatus()
  }, [])

  const refreshStatus = async () => {
    setIsRefreshing(true)
    
    try {
      // Ping the key servers directly from the user's browser
      const keyServerIds = getKeyServers()
      const pingResults = await pingMultipleServers(keyServerIds, 3000) // 3 second timeout
      
      // Update servers with real ping results
      const updatedServers = pingResults.map(result => {
        const serverInfo = UO_SERVERS[result.server as keyof typeof UO_SERVERS]
        return {
          name: serverInfo?.name || result.server,
          status: result.status === 'online' ? 'online' : 
                  result.status === 'timeout' ? 'offline' : 'offline',
          responseTime: result.latency || undefined
        }
      })
      
      setServers(updatedServers)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to ping servers:', error)
      // Keep existing data on error
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'lag':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />
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
      case 'lag': return 'text-yellow-600 dark:text-yellow-400'
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
          {/* Server Status */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Servers:</span>
            {servers.map((server, index) => (
              <div key={server.name} className="flex items-center space-x-1">
                {getStatusIcon(server.status)}
                <span className={`font-medium ${getStatusText(server.status)}`}>
                  {server.name}
                </span>
                {server.responseTime && (
                  <span className="text-gray-500 dark:text-gray-400">
                    ({server.responseTime}ms)
                  </span>
                )}
                {index < servers.length - 1 && (
                  <span className="text-gray-400 mx-1">•</span>
                )}
              </div>
            ))}
          </div>

          {/* Right side - Last update and refresh */}
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 dark:text-gray-400">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
            <button
              onClick={refreshStatus}
              disabled={isRefreshing}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link 
              href="/server-status" 
              className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
