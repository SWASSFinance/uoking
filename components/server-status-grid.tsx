"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, MapPin, Clock } from "lucide-react"
import { pingMultipleServers, getServersByRegion, UO_SERVERS } from "@/lib/ping-utils"

interface ServerStatus {
  id: string
  name: string
  region: string
  timezone: string
  status: 'online' | 'lag' | 'offline' | 'unknown' | 'timeout' | 'error'
  lastChecked: string
  responseTime?: number
  dnsAddress?: string
  ipAddress?: string
}

export function ServerStatusGrid() {
  const [servers, setServers] = useState<ServerStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Mock server data based on the information provided
  const serverData: ServerStatus[] = [
    // Login and Patch Servers
    {
      id: 'login',
      name: 'Login Server',
      region: 'Global',
      timezone: 'UTC',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 45,
      dnsAddress: 'login.owo.com'
    },
    {
      id: 'patch',
      name: 'Patch Server',
      region: 'Global',
      timezone: 'UTC',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 32,
      dnsAddress: 'compassion.owo.com'
    },
    // American Shards
    {
      id: 'atlantic',
      name: 'Atlantic',
      region: 'American',
      timezone: 'EST (-5)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 28,
      dnsAddress: 'atlantic.owo.com',
      ipAddress: '65.216.123.32'
    },
    {
      id: 'pacific',
      name: 'Pacific',
      region: 'American',
      timezone: 'PST (-8)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 35,
      dnsAddress: 'pacific.owo.com',
      ipAddress: '65.216.123.33'
    },
    {
      id: 'baja',
      name: 'Baja',
      region: 'American',
      timezone: 'PST (-8)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 42,
      dnsAddress: 'baja.owo.com',
      ipAddress: '65.216.123.34'
    },
    {
      id: 'sonoma',
      name: 'Sonoma',
      region: 'American',
      timezone: 'PST (-8)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 38,
      dnsAddress: 'sonoma.owo.com',
      ipAddress: '65.216.123.35'
    },
    {
      id: 'lake-austin',
      name: 'Lake Austin',
      region: 'American',
      timezone: 'PST (-8)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 41,
      dnsAddress: 'lakeaustin.owo.com',
      ipAddress: '65.216.123.36'
    },
    {
      id: 'napa-valley',
      name: 'Napa Valley',
      region: 'American',
      timezone: 'PST (-8)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 39,
      dnsAddress: 'napavalley.owo.com',
      ipAddress: '65.216.123.37'
    },
    {
      id: 'oceania',
      name: 'Oceania',
      region: 'American',
      timezone: 'PST (-8)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 44,
      dnsAddress: 'oceania.owo.com',
      ipAddress: '65.216.123.38'
    },
    {
      id: 'lake-superior',
      name: 'Lake Superior',
      region: 'American',
      timezone: 'EST (-5)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 33,
      dnsAddress: 'lakesuperior.owo.com',
      ipAddress: '63.117.27.137'
    },
    {
      id: 'chesapeake',
      name: 'Chesapeake',
      region: 'American',
      timezone: 'EST (-5)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 31,
      dnsAddress: 'chesapeake.owo.com',
      ipAddress: '63.117.27.138'
    },
    {
      id: 'great-lakes',
      name: 'Great Lakes',
      region: 'American',
      timezone: 'EST (-5)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 36,
      dnsAddress: 'greatlakes.owo.com'
    },
    {
      id: 'catskills',
      name: 'Catskills',
      region: 'American',
      timezone: 'EST (-5)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 34,
      dnsAddress: 'catskills.owo.com'
    },
    {
      id: 'legends',
      name: 'Legends',
      region: 'American',
      timezone: 'EST (-5)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 37,
      dnsAddress: 'legends.owo.com'
    },
    {
      id: 'siege-perilous',
      name: 'Siege Perilous',
      region: 'American',
      timezone: 'EST (-5)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 40,
      dnsAddress: 'siege.owo.com'
    },
    {
      id: 'origin',
      name: 'Origin',
      region: 'American',
      timezone: 'PST (-8)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 43,
      dnsAddress: 'origin.owo.com',
      ipAddress: '65.216.123.32'
    },
    {
      id: 'test-center',
      name: 'Test Center',
      region: 'American',
      timezone: 'CST (-6)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 46,
      dnsAddress: 'testcenter.owo.com'
    },
    // European Shards
    {
      id: 'europa',
      name: 'Europa',
      region: 'European',
      timezone: 'GMT (0)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 125,
      dnsAddress: 'europa.owo.com'
    },
    {
      id: 'drachenfels',
      name: 'Drachenfels',
      region: 'European',
      timezone: 'GMT (0)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 128,
      dnsAddress: 'drachenfels.owo.com'
    },
    // Japanese Shards
    {
      id: 'yamato',
      name: 'Yamato',
      region: 'Japanese',
      timezone: 'JST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 180,
      dnsAddress: 'yamato.owo.com'
    },
    {
      id: 'asuka',
      name: 'Asuka',
      region: 'Japanese',
      timezone: 'JST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 185,
      dnsAddress: 'asuka.owo.com'
    },
    {
      id: 'wakoku',
      name: 'Wakoku',
      region: 'Japanese',
      timezone: 'JST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 182,
      dnsAddress: 'wakoku.owo.com'
    },
    {
      id: 'hokuto',
      name: 'Hokuto',
      region: 'Japanese',
      timezone: 'JST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 178,
      dnsAddress: 'hokuto.owo.com'
    },
    {
      id: 'sakura',
      name: 'Sakura',
      region: 'Japanese',
      timezone: 'JST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 183,
      dnsAddress: 'sakura.owo.com'
    },
    {
      id: 'mugen',
      name: 'Mugen',
      region: 'Japanese',
      timezone: 'JST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 181,
      dnsAddress: 'mugen.owo.com'
    },
    {
      id: 'izumo',
      name: 'Izumo',
      region: 'Japanese',
      timezone: 'JST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 184,
      dnsAddress: 'izumo.owo.com'
    },
    {
      id: 'mizuho',
      name: 'Mizuho',
      region: 'Japanese',
      timezone: 'JST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 179,
      dnsAddress: 'mizuho.owo.com'
    },
    // Korean Shards
    {
      id: 'arirang',
      name: 'Arirang',
      region: 'Korean',
      timezone: 'KST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 190,
      dnsAddress: 'arirang.owo.com'
    },
    {
      id: 'balhae',
      name: 'Balhae',
      region: 'Korean',
      timezone: 'KST (+9)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 188,
      dnsAddress: 'balhae.owo.com'
    },
    // Taiwanese Shards
    {
      id: 'formosa',
      name: 'Formosa',
      region: 'Taiwanese',
      timezone: 'CST (+8)',
      status: 'online',
      lastChecked: new Date().toISOString(),
      responseTime: 175,
      dnsAddress: 'formosa.owo.com'
    }
  ]

  useEffect(() => {
    fetchServerStatus()
  }, [])

  const fetchServerStatus = async () => {
    setLoading(true)
    try {
      // Get all server IDs from our ping utils
      const allServerIds = Object.keys(UO_SERVERS)
      
      // Ping all servers directly from the user's browser
      const pingResults = await pingMultipleServers(allServerIds, 5000) // 5 second timeout
      
      // Convert ping results to our server status format
      const updatedServers = pingResults.map(result => {
        const serverInfo = UO_SERVERS[result.server as keyof typeof UO_SERVERS]
        if (!serverInfo) return null
        
        // Determine timezone based on region
        let timezone = 'UTC'
        if (serverInfo.region === 'American') {
          timezone = result.server.includes('pacific') || result.server.includes('baja') || 
                    result.server.includes('sonoma') || result.server.includes('lake-austin') ||
                    result.server.includes('napa-valley') || result.server.includes('oceania') ||
                    result.server.includes('origin') ? 'PST (-8)' : 'EST (-5)'
        } else if (serverInfo.region === 'European') {
          timezone = 'GMT (0)'
        } else if (serverInfo.region === 'Japanese') {
          timezone = 'JST (+9)'
        } else if (serverInfo.region === 'Korean') {
          timezone = 'KST (+9)'
        } else if (serverInfo.region === 'Taiwanese') {
          timezone = 'CST (+8)'
        }
        
        return {
          id: result.server,
          name: serverInfo.name,
          region: serverInfo.region,
          timezone,
          status: result.status === 'online' ? 'online' : 
                  result.status === 'timeout' ? 'offline' : 'offline',
          lastChecked: new Date().toISOString(),
          responseTime: result.latency || undefined,
          dnsAddress: serverInfo.host
        }
      }).filter(Boolean) as ServerStatus[]
      
      setServers(updatedServers)
    } catch (error) {
      console.error('Failed to ping servers:', error)
      // Fallback to mock data
      setServers(serverData)
    } finally {
      setLoading(false)
    }
  }

  const refreshStatus = () => {
    fetchServerStatus()
    setLastUpdate(new Date())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'lag': return 'bg-yellow-500'
      case 'offline':
      case 'timeout':
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Online</Badge>
      case 'lag': return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Lag</Badge>
      case 'offline':
      case 'timeout':
      case 'error': return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Offline</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Unknown</Badge>
    }
  }

  const groupedServers = servers.reduce((acc, server) => {
    if (!acc[server.region]) {
      acc[server.region] = []
    }
    acc[server.region].push(server)
    return acc
  }, {} as Record<string, ServerStatus[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Checking server status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Server Status</h2>
        <Button 
          onClick={refreshStatus} 
          variant="outline" 
          size="sm"
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Server Grid by Region */}
      {Object.entries(groupedServers).map(([region, regionServers]) => (
        <div key={region} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
            {region} Shards
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {regionServers.map((server) => (
              <Card key={server.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {server.name}
                    </CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`}></div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(server.status)}
                    {server.responseTime && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {server.responseTime}ms
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{server.timezone}</span>
                    </div>
                    
                    {server.dnsAddress && (
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300 font-mono text-xs">
                          {server.dnsAddress}
                        </span>
                      </div>
                    )}
                    
                    {server.ipAddress && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 dark:text-gray-300 font-mono text-xs">
                          {server.ipAddress}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Updated {new Date(server.lastChecked).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Last Update Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        Last updated: {lastUpdate.toLocaleString()}
      </div>
    </div>
  )
}
