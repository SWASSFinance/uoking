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

    // Create a completely blank styled map type
    const blankMapType = new window.google.maps.StyledMapType([
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
      }
    ], { name: 'Blank' })

    // Initialize map with completely blank base
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 2,
      mapTypeId: 'blank',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'greedy',
      backgroundColor: '#e6f3ff' // Light blue background
    })

    // Register the blank map type
    googleMapRef.current.mapTypes.set('blank', blankMapType)

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

    // Create custom marker element
    const markerElement = document.createElement('div')
    markerElement.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        background-color: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
      ">
        📍
      </div>
    `

    // Create advanced marker
    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map: googleMapRef.current,
      title: plot.name,
      content: markerElement
    })

    // Add click listener
    marker.addListener('click', () => {
      // Show info window for users
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 5px 0; font-weight: bold;">${plot.name}</h3>
            ${plot.description ? `<p style="margin: 0 0 5px 0; font-size: 14px;">${plot.description}</p>` : ''}
            <p style="margin: 0; font-size: 14px; color: #059669;">
              <strong>${plot.points_price} points</strong>
            </p>
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
      <main className="py-16 px-4">
        <div className="w-full">
          {/* Full Screen Map Container */}
          <div className="relative w-screen h-[calc(100vh-200px)] min-h-[600px] -mx-4">
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
                  className="bg-white/95 backdrop-blur-sm border border-amber-200 shadow-lg min-w-[200px] justify-between"
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
                  <div className="absolute top-full left-0 mt-1 w-full bg-white/95 backdrop-blur-sm border border-amber-200 shadow-lg rounded-lg overflow-hidden z-10">
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
              <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-250px)] overflow-hidden">
                <Card className="bg-white/95 backdrop-blur-sm border border-amber-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
                      <span>Plots ({plots.length})</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
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
                      <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto">
                        {plots.map((plot) => (
                          <div 
                            key={plot.id} 
                            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{plot.name}</h4>
                                {plot.description && (
                                  <p className="text-sm text-gray-600 line-clamp-1">{plot.description}</p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-green-600">
                                  {plot.points_price} pts
                                </span>
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
              <div className="absolute top-4 right-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/95 backdrop-blur-sm border border-amber-200 shadow-lg"
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
