// Simple utility to ping the UO login server

interface PingResult {
  latency: number | null
  status: 'online' | 'offline' | 'timeout' | 'error'
  timestamp: number
}

const LOGIN_SERVER = {
  host: '13.248.219.129',
  port: 7776
}

// Ping the login server using image loading technique
export async function pingLoginServer(timeout: number = 3000): Promise<PingResult> {
  const startTime = Date.now()
  
  return new Promise((resolve) => {
    const img = new Image()
    const timeoutId = setTimeout(() => {
      resolve({
        latency: null,
        status: 'timeout',
        timestamp: Date.now()
      })
    }, timeout)
    
    img.onload = () => {
      clearTimeout(timeoutId)
      const latency = Date.now() - startTime
      resolve({
        latency,
        status: 'online',
        timestamp: Date.now()
      })
    }
    
    img.onerror = () => {
      clearTimeout(timeoutId)
      const latency = Date.now() - startTime
      resolve({
        latency: latency < timeout ? latency : null,
        status: latency < timeout ? 'online' : 'offline',
        timestamp: Date.now()
      })
    }
    
    // Try to load a 1x1 pixel from the server (this will fail but give us timing)
    img.src = `http://${LOGIN_SERVER.host}:${LOGIN_SERVER.port}/favicon.ico?t=${Date.now()}`
  })
}

// Alternative method using fetch (may be blocked by CORS but gives timing)
export async function pingLoginServerFetch(timeout: number = 3000): Promise<PingResult> {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(`http://${LOGIN_SERVER.host}:${LOGIN_SERVER.port}`, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    })
    
    clearTimeout(timeoutId)
    const latency = Date.now() - startTime
    
    return {
      latency,
      status: 'online',
      timestamp: Date.now()
    }
  } catch (error) {
    const latency = Date.now() - startTime
    
    if (latency < timeout) {
      return {
        latency,
        status: 'online',
        timestamp: Date.now()
      }
    }
    
    return {
      latency: null,
      status: 'timeout',
      timestamp: Date.now()
    }
  }
}
