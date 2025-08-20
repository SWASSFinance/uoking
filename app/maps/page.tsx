"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { 
  MapPin, 
  Edit, 
  Trash2, 
  Save, 
  X,
  DollarSign,
  Map,
  ChevronDown,
  Globe
} from "lucide-react"
import Image from "next/image"



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
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  
  const [allMaps, setAllMaps] = useState<MapData[]>([])
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null)
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [plots, setPlots] = useState<Plot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    pointsPrice: 0
  })
  const [showPlotsOverlay, setShowPlotsOverlay] = useState(true)
  const [showMapDropdown, setShowMapDropdown] = useState(false)

  // Check if admin mode is enabled via URL parameter
  useEffect(() => {
    const adminParam = searchParams.get('admin')
    const isAdmin = adminParam === 'true' && !!session?.user?.isAdmin
    console.log('Setting admin mode:', { adminParam, isAdminUser: session?.user?.isAdmin, isAdmin })
    setIsAdminMode(isAdmin)
  }, [searchParams, session])

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
  }, [mapData, isAdminMode]) // Re-initialize when admin mode changes

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

    // Initialize map with a completely blank base
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 2,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false, // Hide map type controls since we only want the custom overlay
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        // Make the entire map completely blank/transparent
        {
          featureType: "all",
          elementType: "all",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "administrative",
          elementType: "all",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ visibility: "off" }]
        }
      ]
    })

    // Create an overlay that displays the custom map image
    // Use a reasonable coordinate system for the game map
    const imageBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(-1, -1), // Southwest corner
      new window.google.maps.LatLng(1, 1)    // Northeast corner
    )

    const mapOverlay = new window.google.maps.GroundOverlay(
      mapData.map_file_url,
      imageBounds,
      {
        opacity: 1.0
      }
    )

    mapOverlay.setMap(googleMapRef.current)

    // Add click listener to the overlay for admin mode
    if (isAdminMode) {
      console.log('Adding click listener to map overlay')
      mapOverlay.addListener('click', handleMapClick)
    }

    // Fit the map to show the entire image
    googleMapRef.current.fitBounds(imageBounds)

    // Add existing markers
    plots.forEach(plot => {
      addMarkerToMap(plot)
    })

    // Note: Click listener is now added to the overlay instead of the map
    // This prevents conflicts between the overlay and map click events
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
        background-color: ${isAdminMode ? '#ef4444' : '#3b82f6'};
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
      if (isAdminMode) {
        setSelectedPlot(plot)
        setEditForm({
          name: plot.name,
          description: plot.description,
          pointsPrice: plot.points_price
        })
        setIsEditing(true)
      } else {
        // Show info window for regular users
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
      }
    })

    markersRef.current.push(marker)
  }

  const handleMapClick = (event: any) => {
    console.log('Map clicked!', { isAdminMode, event })
    
    if (!isAdminMode) {
      console.log('Not in admin mode, ignoring click')
      return
    }

    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    
    console.log('Creating new plot at coordinates:', { lat, lng })

    // Create new plot
    setSelectedPlot({
      id: 'new',
      name: '',
      description: '',
      latitude: lat,
      longitude: lng,
      points_price: 0,
      created_by_name: session?.user?.username || '',
      created_at: new Date().toISOString()
    })
    setEditForm({ name: '', description: '', pointsPrice: 0 })
    setIsEditing(true)
    
    console.log('Modal should now be open')
  }

  const handleSavePlot = async () => {
    if (!selectedPlot || !editForm.name.trim() || !selectedMapId) {
      toast({
        title: "Missing Information",
        description: "Please provide a plot name.",
        variant: "destructive",
      })
      return
    }

    try {
      let response
      if (selectedPlot.id === 'new') {
        // Create new plot
        response = await fetch('/api/admin/plots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mapId: selectedMapId,
            name: editForm.name,
            description: editForm.description,
            latitude: selectedPlot.latitude,
            longitude: selectedPlot.longitude,
            pointsPrice: editForm.pointsPrice
          })
        })
      } else {
        // Update existing plot
        response = await fetch(`/api/admin/plots/${selectedPlot.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editForm.name,
            description: editForm.description,
            latitude: selectedPlot.latitude,
            longitude: selectedPlot.longitude,
            pointsPrice: editForm.pointsPrice
          })
        })
      }

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: selectedPlot.id === 'new' ? "Plot created successfully!" : "Plot updated successfully!",
        })
        
        // Reload map data
        await loadMapData(selectedMapId)
        
        // Clear markers and reinitialize map
        markersRef.current.forEach(marker => marker.map = null)
        markersRef.current = []
        googleMapRef.current = null
        setTimeout(() => initializeGoogleMap(), 100)
        
        setIsEditing(false)
        setSelectedPlot(null)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save plot.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving plot:', error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePlot = async () => {
    if (!selectedPlot || selectedPlot.id === 'new') return

    if (!confirm(`Are you sure you want to delete "${selectedPlot.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/plots/${selectedPlot.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Plot deleted successfully!",
        })
        
        // Reload map data
        await loadMapData(selectedMapId!)
        
        // Clear markers and reinitialize map
        markersRef.current.forEach(marker => marker.map = null)
        markersRef.current = []
        googleMapRef.current = null
        setTimeout(() => initializeGoogleMap(), 100)
        
        setIsEditing(false)
        setSelectedPlot(null)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete plot.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting plot:', error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
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
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Interactive Maps</h1>
                <p className="text-gray-600">Explore and manage game world maps</p>
              </div>
              {session?.user?.isAdmin && (
                <Button 
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`${isAdminMode ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                >
                  {isAdminMode ? 'Exit Admin Mode' : 'Admin Mode'}
                </Button>
              )}
            </div>
          </div>

          {/* Admin Mode Notice */}
          {isAdminMode && (
            <Card className="bg-red-50 border border-red-200 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <p className="text-red-800 font-medium">
                    Admin Mode Active - Click on the map to add markers, or click existing markers to edit them.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Screen Map Container */}
          <div className="relative w-full h-[calc(100vh-200px)] min-h-[600px]">
            {/* Map */}
            <div 
              ref={mapRef} 
              className="w-full h-full rounded-lg border border-gray-200"
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
                            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              if (isAdminMode) {
                                setSelectedPlot(plot)
                                setEditForm({
                                  name: plot.name,
                                  description: plot.description,
                                  pointsPrice: plot.points_price
                                })
                                setIsEditing(true)
                              }
                            }}
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
                                {isAdminMode && (
                                  <Edit className="h-4 w-4 text-gray-400" />
                                )}
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

          {/* Edit Plot Modal */}
          {isEditing && selectedPlot && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {selectedPlot.id === 'new' ? 'Add New Plot' : 'Edit Plot'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="plotName" className="text-gray-700 font-medium">Plot Name *</Label>
                    <Input
                      id="plotName"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Enter plot name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="plotDescription" className="text-gray-700 font-medium">Description</Label>
                    <Textarea
                      id="plotDescription"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Enter plot description"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pointsPrice" className="text-gray-700 font-medium">Points Price</Label>
                    <Input
                      id="pointsPrice"
                      type="number"
                      value={editForm.pointsPrice}
                      onChange={(e) => setEditForm({...editForm, pointsPrice: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Location: {typeof selectedPlot.latitude === 'number' ? selectedPlot.latitude.toFixed(6) : selectedPlot.latitude}, {typeof selectedPlot.longitude === 'number' ? selectedPlot.longitude.toFixed(6) : selectedPlot.longitude}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleSavePlot}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    {selectedPlot.id !== 'new' && (
                      <Button 
                        onClick={handleDeletePlot}
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        setIsEditing(false)
                        setSelectedPlot(null)
                      }}
                      variant="outline"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
