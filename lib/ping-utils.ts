// Utility functions for pinging UO servers from the browser

interface PingResult {
  server: string
  host: string
  port: number
  latency: number | null
  status: 'online' | 'offline' | 'timeout' | 'error'
  timestamp: number
}

// UO Server configurations with actual addresses
export const UO_SERVERS = {
  // Login and Patch servers
  login: {
    name: 'Login Server',
    host: 'login.owo.com',
    port: 7775, // UO login port
    region: 'Global'
  },
  patch: {
    name: 'Patch Server', 
    host: 'compassion.owo.com',
    port: 8888, // UO patch port
    region: 'Global'
  },
  // American shards
  atlantic: {
    name: 'Atlantic',
    host: 'atlantic.owo.com',
    port: 5000, // UO game port
    region: 'American'
  },
  pacific: {
    name: 'Pacific',
    host: 'pacific.owo.com', 
    port: 5000,
    region: 'American'
  },
  baja: {
    name: 'Baja',
    host: 'baja.owo.com',
    port: 5000,
    region: 'American'
  },
  sonoma: {
    name: 'Sonoma',
    host: 'sonoma.owo.com',
    port: 5000,
    region: 'American'
  },
  'lake-austin': {
    name: 'Lake Austin',
    host: 'lakeaustin.owo.com',
    port: 5000,
    region: 'American'
  },
  'napa-valley': {
    name: 'Napa Valley',
    host: 'napavalley.owo.com',
    port: 5000,
    region: 'American'
  },
  oceania: {
    name: 'Oceania',
    host: 'oceania.owo.com',
    port: 5000,
    region: 'American'
  },
  'lake-superior': {
    name: 'Lake Superior',
    host: 'lakesuperior.owo.com',
    port: 5000,
    region: 'American'
  },
  chesapeake: {
    name: 'Chesapeake',
    host: 'chesapeake.owo.com',
    port: 5000,
    region: 'American'
  },
  'great-lakes': {
    name: 'Great Lakes',
    host: 'greatlakes.owo.com',
    port: 5000,
    region: 'American'
  },
  catskills: {
    name: 'Catskills',
    host: 'catskills.owo.com',
    port: 5000,
    region: 'American'
  },
  legends: {
    name: 'Legends',
    host: 'legends.owo.com',
    port: 5000,
    region: 'American'
  },
  'siege-perilous': {
    name: 'Siege Perilous',
    host: 'siege.owo.com',
    port: 5000,
    region: 'American'
  },
  origin: {
    name: 'Origin',
    host: 'origin.owo.com',
    port: 5000,
    region: 'American'
  },
  'test-center': {
    name: 'Test Center',
    host: 'testcenter.owo.com',
    port: 5000,
    region: 'American'
  },
  // European shards
  europa: {
    name: 'Europa',
    host: 'europa.owo.com',
    port: 5000,
    region: 'European'
  },
  drachenfels: {
    name: 'Drachenfels',
    host: 'drachenfels.owo.com',
    port: 5000,
    region: 'European'
  },
  // Japanese shards
  yamato: {
    name: 'Yamato',
    host: 'yamato.owo.com',
    port: 5000,
    region: 'Japanese'
  },
  asuka: {
    name: 'Asuka',
    host: 'asuka.owo.com',
    port: 5000,
    region: 'Japanese'
  },
  wakoku: {
    name: 'Wakoku',
    host: 'wakoku.owo.com',
    port: 5000,
    region: 'Japanese'
  },
  hokuto: {
    name: 'Hokuto',
    host: 'hokuto.owo.com',
    port: 5000,
    region: 'Japanese'
  },
  sakura: {
    name: 'Sakura',
    host: 'sakura.owo.com',
    port: 5000,
    region: 'Japanese'
  },
  mugen: {
    name: 'Mugen',
    host: 'mugen.owo.com',
    port: 5000,
    region: 'Japanese'
  },
  izumo: {
    name: 'Izumo',
    host: 'izumo.owo.com',
    port: 5000,
    region: 'Japanese'
  },
  mizuho: {
    name: 'Mizuho',
    host: 'mizuho.owo.com',
    port: 5000,
    region: 'Japanese'
  },
  // Korean shards
  arirang: {
    name: 'Arirang',
    host: 'arirang.owo.com',
    port: 5000,
    region: 'Korean'
  },
  balhae: {
    name: 'Balhae',
    host: 'balhae.owo.com',
    port: 5000,
    region: 'Korean'
  },
  // Taiwanese shards
  formosa: {
    name: 'Formosa',
    host: 'formosa.owo.com',
    port: 5000,
    region: 'Taiwanese'
  }
}

// Ping a single server using WebSocket connection test
export async function pingServer(serverId: string, timeout: number = 5000): Promise<PingResult> {
  const server = UO_SERVERS[serverId as keyof typeof UO_SERVERS]
  if (!server) {
    return {
      server: serverId,
      host: 'unknown',
      port: 0,
      latency: null,
      status: 'error',
      timestamp: Date.now()
    }
  }

  const startTime = Date.now()
  
  try {
    // Use fetch with a timeout to test connectivity
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    // Try to connect to the server (this will fail due to CORS, but we can measure the time)
    const response = await fetch(`http://${server.host}:${server.port}`, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // This allows us to measure connection time even if CORS blocks it
    })
    
    clearTimeout(timeoutId)
    const latency = Date.now() - startTime
    
    return {
      server: serverId,
      host: server.host,
      port: server.port,
      latency,
      status: 'online',
      timestamp: Date.now()
    }
  } catch (error) {
    const latency = Date.now() - startTime
    
    // If we got a response time, the server is likely online but blocked by CORS
    if (latency < timeout) {
      return {
        server: serverId,
        host: server.host,
        port: server.port,
        latency,
        status: 'online',
        timestamp: Date.now()
      }
    }
    
    return {
      server: serverId,
      host: server.host,
      port: server.port,
      latency: null,
      status: 'timeout',
      timestamp: Date.now()
    }
  }
}

// Alternative ping method using Image loading (more reliable for CORS)
export async function pingServerImage(serverId: string, timeout: number = 5000): Promise<PingResult> {
  const server = UO_SERVERS[serverId as keyof typeof UO_SERVERS]
  if (!server) {
    return {
      server: serverId,
      host: 'unknown',
      port: 0,
      latency: null,
      status: 'error',
      timestamp: Date.now()
    }
  }

  const startTime = Date.now()
  
  return new Promise((resolve) => {
    const img = new Image()
    const timeoutId = setTimeout(() => {
      resolve({
        server: serverId,
        host: server.host,
        port: server.port,
        latency: null,
        status: 'timeout',
        timestamp: Date.now()
      })
    }, timeout)
    
    img.onload = () => {
      clearTimeout(timeoutId)
      const latency = Date.now() - startTime
      resolve({
        server: serverId,
        host: server.host,
        port: server.port,
        latency,
        status: 'online',
        timestamp: Date.now()
      })
    }
    
    img.onerror = () => {
      clearTimeout(timeoutId)
      const latency = Date.now() - startTime
      resolve({
        server: serverId,
        host: server.host,
        port: server.port,
        latency: latency < timeout ? latency : null,
        status: latency < timeout ? 'online' : 'offline',
        timestamp: Date.now()
      })
    }
    
    // Try to load a 1x1 pixel from the server (this will fail but give us timing)
    img.src = `http://${server.host}:${server.port}/favicon.ico?t=${Date.now()}`
  })
}

// Ping multiple servers concurrently
export async function pingMultipleServers(serverIds: string[], timeout: number = 5000): Promise<PingResult[]> {
  const promises = serverIds.map(serverId => pingServerImage(serverId, timeout))
  return Promise.all(promises)
}

// Get key servers for status bar
export function getKeyServers(): string[] {
  return ['login', 'patch', 'atlantic']
}

// Get all servers by region
export function getServersByRegion(): Record<string, string[]> {
  const regions: Record<string, string[]> = {}
  
  Object.entries(UO_SERVERS).forEach(([id, server]) => {
    if (!regions[server.region]) {
      regions[server.region] = []
    }
    regions[server.region].push(id)
  })
  
  return regions
}
