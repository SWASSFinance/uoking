"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { 
  MapPin, 
  Map,
  ChevronDown,
  Globe,
  X
} from "lucide-react"

interface Plot {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  points_price: number
  created_by_name: string
  created_at: string
}

interface MapData {
  id: string
  name: string
  description: string
  map_file_url: string
  created_by_name: string
  created_at: string
}

export default function MapsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  
  const [allMaps, setAllMaps] = useState<MapData[]>([])
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null)
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [plots, setPlots] = useState<Plot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPlotsOverlay, setShowPlotsOverlay] = useState(true)
  const [showMapDropdown, setShowMapDropdown] = useState(false)

  // Load all maps
  useEffect(() => {
    loadAllMaps()
  }, [])

  // Set default map when maps are loaded
  useEffect(() => {
    if (allMaps.length > 0 && !selectedMapId) {
      setSelectedMapId(allMaps[0].id)
    }
  }, [allMaps, selectedMapId])

  // Load map data when selected map changes
  useEffect(() => {
    if (selectedMapId) {
      loadMapData(selectedMapId)
    }
  }, [selectedMapId])

  // Initialize Google Maps
  useEffect(() => {
    if (mapData && mapRef.current) {
      // Clear existing map if it exists
      if (googleMapRef.current) {
        markersRef.current.forEach(marker => marker.map = null)
        markersRef.current = []
        googleMapRef.current = null
      }
      initializeGoogleMap()
    }
  }, [mapData])

  const loadAllMaps = async () => {
    try {
      const response = await fetch('/api/maps')
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded all maps:', data)
        setAllMaps(data.maps || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load maps.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading maps:', error)
      toast({
        title: "Error",
        description: "Failed to load maps.",
        variant: "destructive",
      })
    }
  }

  const loadMapData = async (mapId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/maps/${mapId}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded map data:', data)
        setMapData(data.map)
        
        // Ensure plots have proper number types for coordinates
        const processedPlots = (data.plots || []).map((plot: any) => ({
          ...plot,
          latitude: typeof plot.latitude === 'number' ? plot.latitude : parseFloat(plot.latitude) || 0,
          longitude: typeof plot.longitude === 'number' ? plot.longitude : parseFloat(plot.longitude) || 0,
          points_price: typeof plot.points_price === 'number' ? plot.points_price : parseInt(plot.points_price) || 0
        }))
        
        console.log('Processed plots:', processedPlots)
        setPlots(processedPlots)
      } else {
        toast({
          title: "Error",
          description: "Failed to load map data.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading map data:', error)
      toast({
        title: "Error",
        description: "Failed to load map data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const initializeGoogleMap = () => {
    if (!window.google || !mapRef.current || !mapData) return

    // Initialize map with completely blank base (no Map ID needed for simple markers)
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 2,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'greedy',
      backgroundColor: '#64777c', // Dark gray background
      styles: [
        // Nuclear option - hide EVERYTHING
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'administrative',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'all',
          elementType: 'geometry.stroke',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    // Create an overlay that displays the custom map image
    const imageBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(-1, -1),
      new window.google.maps.LatLng(1, 1)
    )

    const mapOverlay = new window.google.maps.GroundOverlay(
      mapData.map_file_url,
      imageBounds,
      {
        opacity: 1.0
      }
    )

    mapOverlay.setMap(googleMapRef.current)

    // Fit the map to show the entire image
    googleMapRef.current.fitBounds(imageBounds)

    // Add existing markers
    plots.forEach(plot => {
      addMarkerToMap(plot)
    })
  }

  const addMarkerToMap = (plot: Plot) => {
    if (!googleMapRef.current) return

    // Ensure coordinates are numbers
    const lat = typeof plot.latitude === 'number' ? plot.latitude : parseFloat(plot.latitude) || 0
    const lng = typeof plot.longitude === 'number' ? plot.longitude : parseFloat(plot.longitude) || 0

    // Create gamified marker
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: googleMapRef.current,
      title: plot.name,
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
            
            <!-- Treasure chest icon -->
            <g transform="translate(8, 8)">
              <rect x="0" y="4" width="16" height="8" fill="#8b4513" stroke="#654321" stroke-width="1"/>
              <rect x="2" y="6" width="12" height="4" fill="#daa520"/>
              <rect x="0" y="2" width="16" height="2" fill="#8b4513" stroke="#654321" stroke-width="1"/>
              <circle cx="4" cy="3" r="1" fill="#ffd700"/>
              <circle cx="12" cy="3" r="1" fill="#ffd700"/>
            </g>
            
            <!-- Points indicator -->
            <circle cx="24" cy="8" r="6" fill="#ff4444" stroke="#ffffff" stroke-width="1"/>
            <text x="24" y="11" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="Arial">${plot.points_price > 999 ? 'K' : plot.points_price}</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 16)
      }
    })

    // Add click listener
    marker.addListener('click', () => {
      // Show gamified info window for users
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #ffd700;
            border-radius: 8px;
            padding: 16px;
            max-width: 280px;
            color: white;
            font-family: 'Arial', sans-serif;
            box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);
            position: relative;
            overflow: hidden;
          ">
            <!-- Glow effect -->
            <div style="
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
              pointer-events: none;
            "></div>
            
            <!-- Header with treasure icon -->
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div style="
                background: linear-gradient(45deg, #ff6b35, #f7931e);
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;
                box-shadow: 0 4px 8px rgba(255, 107, 53, 0.3);
              ">
                <span style="font-size: 16px;">💎</span>
              </div>
              <h3 style="
                margin: 0;
                font-weight: bold;
                font-size: 18px;
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">${plot.name}</h3>
            </div>
            
            ${plot.description ? `
              <div style="
                background: rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                padding: 8px;
                margin-bottom: 12px;
                border-left: 3px solid #ffd700;
              ">
                <p style="margin: 0; font-size: 14px; line-height: 1.4; color: #e0e0e0;">
                  ${plot.description}
                </p>
              </div>
            ` : ''}
            
            <!-- Points display -->
            <div style="
              background: linear-gradient(45deg, #ff4444, #ff6b6b);
              border-radius: 8px;
              padding: 12px;
              text-align: center;
              border: 1px solid #ffd700;
              box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
            ">
              <div style="font-size: 12px; color: #ffd700; margin-bottom: 4px; font-weight: bold;">
                REWARD POINTS
              </div>
              <div style="
                font-size: 24px;
                font-weight: bold;
                color: white;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
              ">
                ${plot.points_price.toLocaleString()}
              </div>
            </div>
            
            <!-- Decorative elements -->
            <div style="
              position: absolute;
              top: 8px;
              right: 8px;
              font-size: 12px;
              color: #ffd700;
              opacity: 0.7;
            ">⚔️</div>
          </div>
        `
      })
      infoWindow.open(googleMapRef.current, marker)
    })

    markersRef.current.push(marker)
  }

  const handleMapChange = (mapId: string) => {
    setSelectedMapId(mapId)
    setShowMapDropdown(false)
  }

  if (isLoading && !mapData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <LoadingSpinner size="lg" text="Loading maps..." />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (allMaps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Maps Available</h3>
              <p className="text-gray-600">No maps have been created yet.</p>
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
          {/* Full Screen Map Container */}
          <div className="relative w-screen h-[calc(100vh-120px)] min-h-[600px] -mx-4">
            {/* Map */}
            <div 
              ref={mapRef} 
              className="w-full h-full"
            />
            
            {/* Map Selection Dropdown */}
            <div className="absolute top-4 left-4">
              <div className="relative">
                <Button
                  variant="secondary"
                  className="bg-white/80 backdrop-blur-md border-2 border-gray-300 shadow-xl rounded-none min-w-[200px] justify-between"
                  onClick={() => setShowMapDropdown(!showMapDropdown)}
                >
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <span className="truncate">
                      {mapData?.name || 'Select Map'}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showMapDropdown ? 'rotate-180' : ''}`} />
                </Button>
                
                {showMapDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white/80 backdrop-blur-md border-2 border-gray-300 shadow-xl rounded-none overflow-hidden z-10">
                    {allMaps.map((map) => (
                      <button
                        key={map.id}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                          selectedMapId === map.id ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`}
                        onClick={() => handleMapChange(map.id)}
                      >
                        <div className="font-medium">{map.name}</div>
                        {map.description && (
                          <div className="text-sm text-gray-600 truncate">{map.description}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Plots List Overlay */}
            {showPlotsOverlay && (
              <div className="absolute top-4 right-16 w-80 max-h-[calc(100vh-250px)] overflow-hidden">
                <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md border-2 border-amber-400 shadow-2xl rounded-none">
                  <CardHeader className="pb-3 border-b border-amber-400/30">
                    <CardTitle className="text-lg font-bold text-amber-400 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">🗺️</span>
                        <span>Plots ({plots.length})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-amber-400 hover:text-amber-300 hover:bg-amber-400/20"
                        onClick={() => setShowPlotsOverlay(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {plots.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No plots available</p>
                    ) : (
                      <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto p-1">
                        {plots.map((plot) => (
                          <div 
                            key={plot.id} 
                            className="p-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-amber-400/30 rounded-lg hover:from-gray-700/90 hover:to-gray-600/90 hover:border-amber-400/60 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                            onClick={() => {
                              // Center map on the plot
                              const lat = typeof plot.latitude === 'number' ? plot.latitude : parseFloat(plot.latitude) || 0
                              const lng = typeof plot.longitude === 'number' ? plot.longitude : parseFloat(plot.longitude) || 0
                              googleMapRef.current?.panTo({ lat, lng })
                              googleMapRef.current?.setZoom(12)
                              
                              // Find and click the corresponding marker to open info window
                              setTimeout(() => {
                                const markers = markersRef.current
                                const targetMarker = markers.find(marker => {
                                  const markerPos = marker.getPosition()
                                  return markerPos && 
                                         Math.abs(markerPos.lat() - lat) < 0.001 && 
                                         Math.abs(markerPos.lng() - lng) < 0.001
                                })
                                if (targetMarker) {
                                  // Trigger the marker's click event
                                  window.google.maps.event.trigger(targetMarker, 'click')
                                }
                              }, 500) // Small delay to ensure map has finished panning
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="text-amber-400 mr-2">💎</span>
                                  <h4 className="font-bold text-amber-300 text-sm">{plot.name}</h4>
                                </div>
                                {plot.description && (
                                  <p className="text-xs text-gray-300 line-clamp-1 ml-6">{plot.description}</p>
                                )}
                              </div>
                              <div className="flex items-center">
                                <div className="bg-gradient-to-r from-red-500 to-red-600 px-2 py-1 rounded-full border border-amber-400/50">
                                  <span className="text-xs font-bold text-white">
                                    {plot.points_price.toLocaleString()} pts
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Toggle Plots Button */}
            {!showPlotsOverlay && (
              <div className="absolute top-4 right-16">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/80 backdrop-blur-md border-2 border-gray-300 shadow-xl rounded-none"
                  onClick={() => setShowPlotsOverlay(true)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Show Plots ({plots.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
