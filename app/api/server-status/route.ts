import { NextResponse } from 'next/server'

interface ServerStatus {
  id: string
  name: string
  region: string
  timezone: string
  status: 'online' | 'lag' | 'offline' | 'unknown'
  lastChecked: string
  responseTime?: number
  dnsAddress?: string
  ipAddress?: string
}

// Mock server data - in a real implementation, this would ping actual servers
const serverData: ServerStatus[] = [
  {
    id: 'login',
    name: 'Login Server',
    region: 'Global',
    timezone: 'UTC',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 20,
    dnsAddress: 'login.owo.com'
  },
  {
    id: 'patch',
    name: 'Patch Server',
    region: 'Global',
    timezone: 'UTC',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 40) + 15,
    dnsAddress: 'compassion.owo.com'
  },
  {
    id: 'atlantic',
    name: 'Atlantic',
    region: 'American',
    timezone: 'EST (-5)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 30) + 20,
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
    responseTime: Math.floor(Math.random() * 35) + 25,
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
    responseTime: Math.floor(Math.random() * 40) + 30,
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
    responseTime: Math.floor(Math.random() * 35) + 25,
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
    responseTime: Math.floor(Math.random() * 40) + 30,
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
    responseTime: Math.floor(Math.random() * 35) + 25,
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
    responseTime: Math.floor(Math.random() * 45) + 35,
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
    responseTime: Math.floor(Math.random() * 30) + 20,
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
    responseTime: Math.floor(Math.random() * 30) + 20,
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
    responseTime: Math.floor(Math.random() * 35) + 25,
    dnsAddress: 'greatlakes.owo.com'
  },
  {
    id: 'catskills',
    name: 'Catskills',
    region: 'American',
    timezone: 'EST (-5)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 30) + 20,
    dnsAddress: 'catskills.owo.com'
  },
  {
    id: 'legends',
    name: 'Legends',
    region: 'American',
    timezone: 'EST (-5)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 35) + 25,
    dnsAddress: 'legends.owo.com'
  },
  {
    id: 'siege-perilous',
    name: 'Siege Perilous',
    region: 'American',
    timezone: 'EST (-5)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 40) + 30,
    dnsAddress: 'siege.owo.com'
  },
  {
    id: 'origin',
    name: 'Origin',
    region: 'American',
    timezone: 'PST (-8)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 40) + 30,
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
    responseTime: Math.floor(Math.random() * 50) + 35,
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
    responseTime: Math.floor(Math.random() * 50) + 100,
    dnsAddress: 'europa.owo.com'
  },
  {
    id: 'drachenfels',
    name: 'Drachenfels',
    region: 'European',
    timezone: 'GMT (0)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 100,
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
    responseTime: Math.floor(Math.random() * 50) + 150,
    dnsAddress: 'yamato.owo.com'
  },
  {
    id: 'asuka',
    name: 'Asuka',
    region: 'Japanese',
    timezone: 'JST (+9)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 150,
    dnsAddress: 'asuka.owo.com'
  },
  {
    id: 'wakoku',
    name: 'Wakoku',
    region: 'Japanese',
    timezone: 'JST (+9)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 150,
    dnsAddress: 'wakoku.owo.com'
  },
  {
    id: 'hokuto',
    name: 'Hokuto',
    region: 'Japanese',
    timezone: 'JST (+9)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 150,
    dnsAddress: 'hokuto.owo.com'
  },
  {
    id: 'sakura',
    name: 'Sakura',
    region: 'Japanese',
    timezone: 'JST (+9)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 150,
    dnsAddress: 'sakura.owo.com'
  },
  {
    id: 'mugen',
    name: 'Mugen',
    region: 'Japanese',
    timezone: 'JST (+9)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 150,
    dnsAddress: 'mugen.owo.com'
  },
  {
    id: 'izumo',
    name: 'Izumo',
    region: 'Japanese',
    timezone: 'JST (+9)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 150,
    dnsAddress: 'izumo.owo.com'
  },
  {
    id: 'mizuho',
    name: 'Mizuho',
    region: 'Japanese',
    timezone: 'JST (+9)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 150,
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
    responseTime: Math.floor(Math.random() * 50) + 160,
    dnsAddress: 'arirang.owo.com'
  },
  {
    id: 'balhae',
    name: 'Balhae',
    region: 'Korean',
    timezone: 'KST (+9)',
    status: 'online',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 50) + 160,
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
    responseTime: Math.floor(Math.random() * 50) + 140,
    dnsAddress: 'formosa.owo.com'
  }
]

export async function GET() {
  try {
    // In a real implementation, you would ping the actual servers here
    // For now, we'll return mock data with some randomization
    
    // Simulate some servers having issues occasionally
    const updatedServers = serverData.map(server => {
      // 5% chance of lag, 1% chance of offline
      const random = Math.random()
      let status = server.status
      
      if (random < 0.01) {
        status = 'offline'
      } else if (random < 0.06) {
        status = 'lag'
      }
      
      return {
        ...server,
        status,
        lastChecked: new Date().toISOString(),
        responseTime: status === 'offline' ? undefined : server.responseTime
      }
    })

    return NextResponse.json({
      servers: updatedServers,
      lastUpdated: new Date().toISOString(),
      totalServers: updatedServers.length,
      onlineServers: updatedServers.filter(s => s.status === 'online').length,
      lagServers: updatedServers.filter(s => s.status === 'lag').length,
      offlineServers: updatedServers.filter(s => s.status === 'offline').length
    })
  } catch (error) {
    console.error('Error fetching server status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch server status' },
      { status: 500 }
    )
  }
}
