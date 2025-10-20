"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MapPin, Map } from "lucide-react"


interface MapConfig {
  name: string
  imageUrl: string
  maxX: number
  maxY: number
}

const MAP_CONFIGS: Record<string, MapConfig> = {
  telmur: {
    name: "Ter Mur",
    imageUrl: "/uo/telmur.jpg",
    maxX: 1885,
    maxY: 5485
  },
  malas: {
    name: "Malas",
    imageUrl: "/uo/malas.png",
    maxX: 2546,
    maxY: 2056
  },
  felucca: {
    name: "Felucca",
    imageUrl: "/uo/felucca.png",
    maxX: 7168,
    maxY: 4096
  },
  trammel: {
    name: "Trammel",
    imageUrl: "/uo/trammel.png",
    maxX: 7168,
    maxY: 4096
  },
  ilshenar: {
    name: "Ilshenar",
    imageUrl: "/uo/ilshenar.png",
    maxX: 2300,
    maxY: 1600
  },
  tokuno: {
    name: "Tokuno",
    imageUrl: "/uo/tokuno.png",
    maxX: 1450,
    maxY: 1450
  }
  // Add more maps here as needed
}

// Coordinate conversion functions based on the UO map system
// This uses the proper UO coordinate system where 0,0 is top-left and maxX,maxY is bottom-right
function convertCoordY(gameY: number, maxY: number, mapType: string): number {
  // Get map-specific bounds
  let mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
  
  if (mapType === 'malas') {
    mapBounds = { minLat: 4, maxLat: 8, minLng: -7, maxLng: -2 }
  } else if (mapType === 'felucca' || mapType === 'trammel') {
    // Get the map config to access maxX
    const mapConfig = MAP_CONFIGS[mapType]
    const imageAspectRatio = mapConfig.maxX / maxY // Use actual config values
    const mapHeight = 10 // Total height in map units
    const mapWidth = mapHeight * imageAspectRatio
    const centerLat = 5
    const centerLng = -2
    
    mapBounds = { 
      minLat: centerLat - mapHeight/2, 
      maxLat: centerLat + mapHeight/2, 
      minLng: centerLng - mapWidth/2, 
      maxLng: centerLng + mapWidth/2 
    }
  } else if (mapType === 'ilshenar') {
    mapBounds = { minLat: 4, maxLat: 9, minLng: -7, maxLng: -3 }
  } else {
    // Ter Mur
    mapBounds = { minLat: -2, maxLat: 4, minLng: -8, maxLng: -3 }
  }
  
  // Convert game Y (0 to maxY) to map latitude
  // In UO coordinates, Y=0 is top, Y=maxY is bottom
  // In map coordinates, higher lat is north, lower lat is south
  const normalizedY = gameY / maxY  // 0 to 1
  const mapY = mapBounds.maxLat - (normalizedY * (mapBounds.maxLat - mapBounds.minLat))
  
  return mapY
}

function convertCoordX(gameX: number, maxX: number, mapType: string): number {
  // Get map-specific bounds
  let mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
  
  if (mapType === 'malas') {
    mapBounds = { minLat: 4, maxLat: 8, minLng: -7, maxLng: -2 }
  } else if (mapType === 'felucca' || mapType === 'trammel') {
    // Get the map config to access maxY
    const mapConfig = MAP_CONFIGS[mapType]
    const imageAspectRatio = maxX / mapConfig.maxY // Use actual config values
    const mapHeight = 10 // Total height in map units
    const mapWidth = mapHeight * imageAspectRatio
    const centerLat = 5
    const centerLng = -2
    
    mapBounds = { 
      minLat: centerLat - mapHeight/2, 
      maxLat: centerLat + mapHeight/2, 
      minLng: centerLng - mapWidth/2, 
      maxLng: centerLng + mapWidth/2 
    }
  } else if (mapType === 'ilshenar') {
    // Calculate proper bounds based on image aspect ratio for Ilshenar
    const mapConfig = MAP_CONFIGS[mapType]
    const imageAspectRatio = maxX / mapConfig.maxY // 5120/4096 = 1.25
    const mapHeight = 5 // Total height in map units
    const mapWidth = mapHeight * imageAspectRatio // 5 * 1.25 = 6.25
    const centerLat = 6.5
    const centerLng = -5
    
    mapBounds = { 
      minLat: centerLat - mapHeight/2, 
      maxLat: centerLat + mapHeight/2, 
      minLng: centerLng - mapWidth/2, 
      maxLng: centerLng + mapWidth/2 
    }
  } else {
    // Ter Mur
    mapBounds = { minLat: -2, maxLat: 4, minLng: -8, maxLng: -3 }
  }
  
  // Convert game X (0 to maxX) to map longitude
  // In UO coordinates, X=0 is left, X=maxX is right
  // In map coordinates, higher lng is east, lower lng is west
  const normalizedX = gameX / maxX  // 0 to 1
  const mapX = mapBounds.minLng + (normalizedX * (mapBounds.maxLng - mapBounds.minLng))
  
  return mapX
}

// Helper function to get map bounds for coordinate conversion
function getMapBounds(mapType: string): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  if (mapType === 'malas') {
    return { minLat: 4, maxLat: 8, minLng: -7, maxLng: -2 }
  } else if (mapType === 'felucca' || mapType === 'trammel') {
    const mapConfig = MAP_CONFIGS[mapType]
    const imageAspectRatio = mapConfig.maxX / mapConfig.maxY
    const mapHeight = 10
    const mapWidth = mapHeight * imageAspectRatio
    const centerLat = 5
    const centerLng = -2
    
    return { 
      minLat: centerLat - mapHeight/2, 
      maxLat: centerLat + mapHeight/2, 
      minLng: centerLng - mapWidth/2, 
      maxLng: centerLng + mapWidth/2 
    }
  } else if (mapType === 'ilshenar') {
    const mapConfig = MAP_CONFIGS[mapType]
    const imageAspectRatio = mapConfig.maxX / mapConfig.maxY
    const mapHeight = 5
    const mapWidth = mapHeight * imageAspectRatio
    const centerLat = 6.5
    const centerLng = -5
    
    return { 
      minLat: centerLat - mapHeight/2, 
      maxLat: centerLat + mapHeight/2, 
      minLng: centerLng - mapWidth/2, 
      maxLng: centerLng + mapWidth/2 
    }
  } else {
    // Ter Mur
    return { minLat: -2, maxLat: 4, minLng: -8, maxLng: -3 }
  }
}

export default function LandMapPage() {
  const searchParams = useSearchParams()
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  
  // Form state
  const [selectedMap, setSelectedMap] = useState(searchParams.get('map') || 'telmur')
  const [xCoord, setXCoord] = useState(searchParams.get('x') || '2100')
  const [yCoord, setYCoord] = useState(searchParams.get('y') || '2100')
  const [zoom, setZoom] = useState(searchParams.get('zoom') || '1')
  const markerRef = useRef<any>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null)
  const [mouseCoordinates, setMouseCoordinates] = useState<{ x: number; y: number } | null>(null)
  const [eventListenersAdded, setEventListenersAdded] = useState(false)

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newUrl = `/landmap?map=${selectedMap}${xCoord ? `&x=${xCoord}` : ''}${yCoord ? `&y=${yCoord}` : ''}${zoom !== '1' ? `&zoom=${zoom}` : ''}`
    window.location.href = newUrl
  }
  const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null)

  // Parse URL parameters
  useEffect(() => {
    const mapParam = searchParams.get('map') || 'telmur'
    const xParam = searchParams.get('x') || '2100'
    const yParam = searchParams.get('y') || '2100'

    const config = MAP_CONFIGS[mapParam]
    if (!config) {
      setError(`Unknown map: ${mapParam}. Available maps: ${Object.keys(MAP_CONFIGS).join(', ')}`)
      setIsLoading(false)
      return
    }

    setMapConfig(config)

    // Parse coordinates (use defaults if not provided)
    const x = parseInt(xParam)
    const y = parseInt(yParam)
    
    if (isNaN(x) || isNaN(y)) {
      setError("Invalid coordinates. X and Y must be numbers.")
      setIsLoading(false)
      return
    }

    if (x < 0 || x > config.maxX || y < 0 || y > config.maxY) {
      setError(`Coordinates out of bounds. X must be 0-${config.maxX}, Y must be 0-${config.maxY}`)
      setIsLoading(false)
      return
    }

    setCoordinates({ x, y })
    setIsLoading(false)
  }, [searchParams])

  // Initialize Google Maps
  useEffect(() => {
    if (mapConfig && mapRef.current && !isLoading) {
      initializeGoogleMap()
    }
  }, [mapConfig, isLoading])

  const initializeGoogleMap = () => {
    if (!window.google || !window.google.maps || !mapRef.current || !mapConfig) {
      console.log('Google Maps API not ready, retrying...')
      setTimeout(initializeGoogleMap, 100)
      return
    }

    // Get map-specific settings
    const mapType = searchParams.get('map') || 'telmur'
    let center, zoom, bounds
    
    if (mapType === 'malas') {
      center = { lat: 6.45, lng: -4.5 } // Malas center
      zoom = 3 // Malas zoom level
      bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(4, -7), // Southwest corner
        new window.google.maps.LatLng(8, -2)  // Northeast corner
      )
    } else if (mapType === 'felucca' || mapType === 'trammel') {
      center = { lat: 5, lng: -2 } // Felucca/Trammel center
      zoom = 2 // Felucca/Trammel zoom level
      // Calculate proper bounds based on image aspect ratio from config
      const imageAspectRatio = mapConfig.maxX / mapConfig.maxY
      const mapHeight = 10 // Total height in map units
      const mapWidth = mapHeight * imageAspectRatio
      const centerLat = 5
      const centerLng = -2
      
      bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(centerLat - mapHeight/2, centerLng - mapWidth/2), // Southwest corner
        new window.google.maps.LatLng(centerLat + mapHeight/2, centerLng + mapWidth/2)  // Northeast corner
      )
    } else if (mapType === 'ilshenar') {
      center = { lat: 6.5, lng: -5 } // Ilshenar center
      zoom = 3 // Ilshenar zoom level
      // Calculate proper bounds based on image aspect ratio for Ilshenar
      const imageAspectRatio = mapConfig.maxX / mapConfig.maxY // 5120/4096 = 1.25
      const mapHeight = 5 // Total height in map units
      const mapWidth = mapHeight * imageAspectRatio // 5 * 1.25 = 6.25
      const centerLat = 6.5
      const centerLng = -5
      
      bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(centerLat - mapHeight/2, centerLng - mapWidth/2), // Southwest corner
        new window.google.maps.LatLng(centerLat + mapHeight/2, centerLng + mapWidth/2)  // Northeast corner
      )
    } else {
      center = { lat: 1.3, lng: -5.6 } // Ter Mur center
      zoom = 4 // Ter Mur zoom level
      bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(-2, -8), // Southwest corner
        new window.google.maps.LatLng(4, -3)   // Northeast corner
      )
    }

    // Initialize map with map-specific settings
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'greedy',
      backgroundColor: '#08315A', // Dark blue background like the JS code
      styles: [
        // Hide all map features
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    // Create an overlay that displays the custom map image
    const imageBounds = bounds

    const mapOverlay = new window.google.maps.GroundOverlay(
      mapConfig.imageUrl,
      imageBounds,
      {
        opacity: 1.0
      }
    )

    mapOverlay.setMap(googleMapRef.current)

    // Fit the map to show the entire image
    googleMapRef.current.fitBounds(imageBounds)

    // Add event listeners only if not already added
    if (!eventListenersAdded) {
      // Add click listener to show coordinates
      googleMapRef.current.addListener('click', (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        
        // Convert map coordinates back to game coordinates
        const mapType = searchParams.get('map') || 'telmur'
        const gameX = Math.round(((lng - getMapBounds(mapType).minLng) / (getMapBounds(mapType).maxLng - getMapBounds(mapType).minLng)) * mapConfig.maxX)
        const gameY = Math.round(((getMapBounds(mapType).maxLat - lat) / (getMapBounds(mapType).maxLat - getMapBounds(mapType).minLat)) * mapConfig.maxY)
        
        // Update form fields with clicked coordinates
        setXCoord(gameX.toString())
        setYCoord(gameY.toString())
        
        // Update URL
        const newUrl = `/landmap?map=${mapType}&x=${gameX}&y=${gameY}`
        window.history.pushState({}, '', newUrl)
        
        // Add marker at clicked location
        if (markerRef.current) {
          markerRef.current.setMap(null)
        }
        
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: googleMapRef.current,
          title: `Location: ${gameX}, ${gameY}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="16" cy="16" r="14" fill="url(#gradient)" stroke="#ffd700" stroke-width="2" filter="url(#glow)"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#f7931e;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ffd700;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="10" fill="#1a1a1a" stroke="#ffd700" stroke-width="1"/>
                <g transform="translate(8, 4)">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 8 8 16 8 16s8-8 8-16c0-4.42-3.58-8-8-8z" fill="#ffd700"/>
                  <circle cx="8" cy="8" r="3" fill="#1a1a1a"/>
                </g>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16)
          }
        })
      })

      // Add mouse move listener to show coordinates
      googleMapRef.current.addListener('mousemove', (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        
        // Convert map coordinates back to game coordinates
        const mapType = searchParams.get('map') || 'telmur'
        const gameX = Math.round(((lng - getMapBounds(mapType).minLng) / (getMapBounds(mapType).maxLng - getMapBounds(mapType).minLng)) * mapConfig.maxX)
        const gameY = Math.round(((getMapBounds(mapType).maxLat - lat) / (getMapBounds(mapType).maxLat - getMapBounds(mapType).minLat)) * mapConfig.maxY)
        
        setMouseCoordinates({ x: gameX, y: gameY })
      })

      // Add mouse leave listener to hide coordinates
      googleMapRef.current.addListener('mouseout', () => {
        setMouseCoordinates(null)
      })

      setEventListenersAdded(true)
    }

    // Add marker if coordinates are provided
    if (coordinates) {
      addMarkerToMap()
    }
  }

  const addMarkerToMap = () => {
    if (!googleMapRef.current || !coordinates || !mapConfig) return

    // Get map type for coordinate conversion
    const mapType = searchParams.get('map') || 'telmur'
    
    // Convert UO coordinates to map coordinates using the same logic as the JS code
    const mapY = convertCoordY(coordinates.y, mapConfig.maxY, mapType)
    const mapX = convertCoordX(coordinates.x, mapConfig.maxX, mapType)

    console.log(`Converting coordinates: ${coordinates.x},${coordinates.y} -> ${mapY},${mapX}`)

    // Create marker
    markerRef.current = new window.google.maps.Marker({
      position: { lat: mapY, lng: mapX },
      map: googleMapRef.current,
      title: `Location: ${coordinates.x}, ${coordinates.y}`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <!-- Outer glow -->
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- Background circle with gradient -->
            <circle cx="16" cy="16" r="14" fill="url(#gradient)" stroke="#ffd700" stroke-width="2" filter="url(#glow)"/>
            
            <!-- Gradient definition -->
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#f7931e;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffd700;stop-opacity:1" />
              </linearGradient>
            </defs>
            
            <!-- Inner circle -->
            <circle cx="16" cy="16" r="10" fill="#1a1a1a" stroke="#ffd700" stroke-width="1"/>
            
            <!-- Map pin icon -->
            <g transform="translate(8, 4)">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 8 8 16 8 16s8-8 8-16c0-4.42-3.58-8-8-8z" fill="#ffd700"/>
              <circle cx="8" cy="8" r="3" fill="#1a1a1a"/>
            </g>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 16)
      }
    })

    // Add click listener to show coordinates
    markerRef.current.addListener('click', () => {
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #ffd700;
            border-radius: 8px;
            padding: 16px;
            width: 200px;
            color: white;
            font-family: 'Arial', sans-serif;
            box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);
          ">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 20px; margin-right: 8px;">📍</span>
              <h3 style="margin: 0; font-weight: bold; font-size: 16px; color: #ffd700;">
                Location Marker
              </h3>
            </div>
            <div style="
              background: rgba(255, 255, 255, 0.1);
              border-radius: 6px;
              padding: 8px;
              text-align: center;
            ">
              <div style="font-size: 14px; color: #e0e0e0; margin-bottom: 4px;">
                Game Coordinates
              </div>
              <div style="
                font-size: 18px;
                font-weight: bold;
                color: #ffd700;
              ">
                ${coordinates.x}, ${coordinates.y}
              </div>
            </div>
          </div>
        `,
        disableAutoPan: false,
        pixelOffset: new window.google.maps.Size(0, -10)
      })
      
      infoWindow.open(googleMapRef.current, markerRef.current)
    })

    // Center the map on the marker
    googleMapRef.current.setCenter({ lat: mapY, lng: mapX })
    googleMapRef.current.setZoom(8)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <LoadingSpinner size="lg" text="Loading map..." />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <Map className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
              <p className="text-red-600">{error}</p>
              <div className="mt-4 text-sm text-gray-600">
                <p>Usage: /landmap?map=telmur&x=789&y=3664</p>
                <p>Available maps: {Object.keys(MAP_CONFIGS).join(', ')}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="px-4">
        <div className="w-full">
          {/* Header */}
          <div className="mb-4 pt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mapConfig?.name} Map
            </h1>
          </div>

          {/* Map Selection Form */}
          <div className="mb-4 bg-white rounded-lg shadow-md p-4">
            <form onSubmit={handleFormSubmit} className="flex flex-wrap items-end gap-3">
              {/* Map Selection */}
              <div className="flex-1 min-w-[120px]">
                <label htmlFor="map-select" className="block text-xs font-medium text-gray-700 mb-1">
                  Map
                </label>
                <select
                  id="map-select"
                  value={selectedMap}
                  onChange={(e) => setSelectedMap(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {Object.entries(MAP_CONFIGS).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* X Coordinate */}
              <div className="flex-1 min-w-[100px]">
                <label htmlFor="x-coord" className="block text-xs font-medium text-gray-700 mb-1">
                  X Coord
                </label>
                <input
                  type="number"
                  id="x-coord"
                  value={xCoord}
                  onChange={(e) => setXCoord(e.target.value)}
                  placeholder="0"
                  min="0"
                  max={MAP_CONFIGS[selectedMap]?.maxX || 9999}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Y Coordinate */}
              <div className="flex-1 min-w-[100px]">
                <label htmlFor="y-coord" className="block text-xs font-medium text-gray-700 mb-1">
                  Y Coord
                </label>
                <input
                  type="number"
                  id="y-coord"
                  value={yCoord}
                  onChange={(e) => setYCoord(e.target.value)}
                  placeholder="0"
                  min="0"
                  max={MAP_CONFIGS[selectedMap]?.maxY || 9999}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-4 rounded-md transition-colors flex items-center text-sm"
                >
                  <Map className="h-4 w-4 mr-1" />
                  Update
                </button>
              </div>
            </form>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-[700px] rounded-lg overflow-hidden shadow-lg">
            {/* Map */}
            <div 
              ref={mapRef} 
              className="w-full h-full"
            />
            
            {/* Coordinates Display */}
            {coordinates && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border-2 border-amber-400 shadow-xl rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="font-bold text-gray-900">Coordinates</div>
                    <div className="text-lg font-mono text-amber-600">
                      {coordinates.x}, {coordinates.y}
                    </div>
                    <div className="mt-2">
                      <a 
                        href={`/api/landmap/image?map=${searchParams.get('map')}&x=${coordinates.x}&y=${coordinates.y}&width=1200&height=800`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        📷 Download PNG
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mouse Coordinates Display */}
            {mouseCoordinates && (
              <div className="absolute top-4 right-20 bg-white/90 backdrop-blur-md border-2 border-blue-400 shadow-xl rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Map className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Mouse Position</div>
                    <div className="text-sm font-mono text-blue-600">
                      {mouseCoordinates.x}, {mouseCoordinates.y}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
