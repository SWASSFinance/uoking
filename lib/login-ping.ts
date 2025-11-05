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
    
    // Suppress console errors for network failures - they're expected
    // Note: Browser-level network errors (ERR_INVALID_HTTP_RESPONSE) 
    // cannot be fully suppressed but are expected behavior
    let response: Response | null = null
    try {
      response = await fetch(`http://${LOGIN_SERVER.host}:${LOGIN_SERVER.port}`, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors',
        cache: 'no-store'
      })
    } catch (fetchError) {
      // Network errors are expected - fetch will throw for invalid responses
      // This is normal behavior, just catch and continue
      response = null
    }
    
    clearTimeout(timeoutId)
    const latency = Date.now() - startTime
    
    // If we got a response (even if opaque), server is reachable
    // With no-cors mode, we can't read the response but getting one means server responded
    if (response !== null) {
      return {
        latency,
        status: 'online',
        timestamp: Date.now()
      }
    }
    
    // No response - check if it was a timeout or network error
    if (latency < timeout) {
      return {
        latency,
        status: 'offline',
        timestamp: Date.now()
      }
    }
    
    return {
      latency: null,
      status: 'timeout',
      timestamp: Date.now()
    }
  } catch (error) {
    // Silently handle all errors - network failures are expected
    const latency = Date.now() - startTime
    
    if (latency < timeout) {
      return {
        latency,
        status: 'offline',
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
