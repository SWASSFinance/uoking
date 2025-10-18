"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface GoogleMapsLoaderProps {
  children: React.ReactNode
}

export function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const pathname = usePathname()
  
  // Only load Google Maps on pages that need it
  const needsGoogleMaps = pathname.startsWith('/maps') || pathname.startsWith('/admin/maps') || pathname.startsWith('/plot/') || pathname.startsWith('/landmap')

  useEffect(() => {
    if (!needsGoogleMaps) {
      setIsLoaded(true)
      return
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setIsLoaded(true)
      return
    }

    // Load Google Maps API
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    script.onerror = () => {
      console.error('Failed to load Google Maps API')
      setIsLoaded(true) // Continue without maps
    }
    
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [needsGoogleMaps])

  if (!isLoaded) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50" />
  }

  return <>{children}</>
}
