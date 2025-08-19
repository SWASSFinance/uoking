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
  Map
} from "lucide-react"
import Image from "next/image"

// Google Maps types
declare global {
  interface Window {
    google: any
  }
}

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

export default function MapPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  
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

  // Check if admin mode is enabled via URL parameter
  useEffect(() => {
    const adminParam = searchParams.get('admin')
    setIsAdminMode(adminParam === 'true' && session?.user?.is_admin)
  }, [searchParams, session])

  // Load map data
  useEffect(() => {
    loadMapData()
  }, [params.id])

  // Initialize Google Maps
  useEffect(() => {
    if (mapData && mapRef.current && !googleMapRef.current) {
      initializeGoogleMap()
    }
  }, [mapData])

  const loadMapData = async () => {
    try {
      const response = await fetch(`/api/maps/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setMapData(data.map)
        setPlots(data.plots || [])
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
    if (!window.google || !mapRef.current) return

    // Initialize map centered on the first plot or default coordinates
    const center = plots.length > 0 
      ? { lat: plots[0].latitude, lng: plots[0].longitude }
      : { lat: 0, lng: 0 }

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 10,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    })

    // Add existing markers
    plots.forEach(plot => {
      addMarkerToMap(plot)
    })

    // Add click listener for admin mode
    if (isAdminMode) {
      googleMapRef.current.addListener('click', handleMapClick)
    }
  }

  const addMarkerToMap = (plot: Plot) => {
    if (!googleMapRef.current) return

    const marker = new window.google.maps.Marker({
      position: { lat: plot.latitude, lng: plot.longitude },
      map: googleMapRef.current,
      title: plot.name,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${isAdminMode ? '#ef4444' : '#3b82f6'}"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
        anchor: new window.google.maps.Point(12, 12)
      }
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
    if (!isAdminMode) return

    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

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
  }

  const handleSavePlot = async () => {
    if (!selectedPlot || !editForm.name.trim()) {
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
            mapId: params.id,
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
        await loadMapData()
        
        // Clear markers and reinitialize map
        markersRef.current.forEach(marker => marker.setMap(null))
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
        await loadMapData()
        
        // Clear markers and reinitialize map
        markersRef.current.forEach(marker => marker.setMap(null))
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

  if (!mapData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Map Not Found</h3>
              <p className="text-gray-600">The requested map could not be found.</p>
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
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{mapData.name}</h1>
                <p className="text-gray-600">{mapData.description}</p>
              </div>
              {session?.user?.is_admin && (
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

          {/* Map Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Interactive Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    ref={mapRef} 
                    className="w-full h-96 rounded-lg border border-gray-200"
                    style={{ minHeight: '400px' }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Map Image */}
              {mapData.map_file_url && (
                <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">Map Reference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src={mapData.map_file_url}
                      alt={mapData.name}
                      width={300}
                      height={200}
                      className="w-full h-auto rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Plots List */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Plots ({plots.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {plots.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No plots available</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
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
                    <p>Location: {selectedPlot.latitude.toFixed(6)}, {selectedPlot.longitude.toFixed(6)}</p>
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
