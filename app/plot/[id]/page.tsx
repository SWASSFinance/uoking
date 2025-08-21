"use client"

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  MapPin, 
  Coins, 
  User, 
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Crown,
  Map
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'



interface Plot {
  id: string
  name: string
  description?: string
  latitude: number
  longitude: number
  points_price: number
  is_available: boolean
  owner_id?: string
  owner_name?: string
  purchased_at?: string
  created_by_name?: string
  created_at: string
  map_name?: string
  map_slug?: string
  map_file_url?: string
}

interface PlotPageProps {
  params: Promise<{ id: string }>
}

export default function PlotPage({ params }: PlotPageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [plot, setPlot] = useState<Plot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [userPoints, setUserPoints] = useState<number>(0)

  useEffect(() => {
    const loadPlot = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/plots/${id}/purchase`)
        
        if (response.ok) {
          const data = await response.json()
          setPlot(data.plot)
        } else {
          toast({
            title: "Error",
            description: "Plot not found",
            variant: "destructive",
          })
          router.push('/maps')
        }
      } catch (error) {
        console.error('Error loading plot:', error)
        toast({
          title: "Error",
          description: "Failed to load plot",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPlot()
  }, [params, router, toast])

  useEffect(() => {
    const loadUserPoints = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/user/points')
          if (response.ok) {
            const data = await response.json()
            setUserPoints(data.points?.current_points || 0)
          }
        } catch (error) {
          console.error('Error loading user points:', error)
        }
      }
    }

    loadUserPoints()
  }, [session])

  // Initialize map when plot data is loaded and Google Maps API is ready
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout
    
    if (plot && mapRef.current) {
      const initializeMapWithRetry = () => {
        if (window.google && window.google.maps) {
          initializeMap()
        } else {
          // Retry after a short delay
          retryTimeout = setTimeout(initializeMapWithRetry, 100)
        }
      }
      
      initializeMapWithRetry()
    }
    
    // Cleanup function
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [plot])

  const initializeMap = () => {
    if (!plot || !mapRef.current || !window.google?.maps) return

    // Create map centered on the plot location
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: plot.latitude, lng: plot.longitude },
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'greedy',
      backgroundColor: '#64777c', // Dark gray background
      styles: [
        // Hide all default map features
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
        }
      ]
    })

    // Add custom map overlay if available
    if (plot.map_file_url) {
      // Create an overlay that displays the custom map image
      const imageBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(-1, -1),
        new window.google.maps.LatLng(1, 1)
      )

      const mapOverlay = new window.google.maps.GroundOverlay(
        plot.map_file_url,
        imageBounds,
        {
          opacity: 1.0
        }
      )

      mapOverlay.setMap(googleMapRef.current)

      // Fit the map to show the entire image
      googleMapRef.current.fitBounds(imageBounds)
    }

    // Add marker for the plot
    markerRef.current = new window.google.maps.Marker({
      position: { lat: plot.latitude, lng: plot.longitude },
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

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 2px solid #ffd700;
          border-radius: 8px;
          padding: 16px;
          width: 280px;
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
      `,
      disableAutoPan: false,
      pixelOffset: new window.google.maps.Size(0, -10)
    })

    markerRef.current.addListener('click', () => {
      infoWindow.open(googleMapRef.current, markerRef.current)
    })
  }

  const handlePurchase = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase plots",
        variant: "destructive",
      })
      return
    }

    if (!plot) return

    if (userPoints < plot.points_price) {
      toast({
        title: "Insufficient Points",
        description: `You need ${plot.points_price} points but have ${userPoints}`,
        variant: "destructive",
      })
      return
    }

    setIsPurchasing(true)

    try {
      const response = await fetch(`/api/plots/${plot.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: data.message,
        })
        
        // Refresh plot data and user points
        const plotResponse = await fetch(`/api/plots/${plot.id}/purchase`)
        if (plotResponse.ok) {
          const plotData = await plotResponse.json()
          setPlot(plotData.plot)
        }
        
        const pointsResponse = await fetch('/api/user/points')
        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json()
          setUserPoints(pointsData.points?.current_points || 0)
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to purchase plot",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error purchasing plot:', error)
      toast({
        title: "Error",
        description: "An error occurred while purchasing the plot",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading plot...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!plot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-8">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Plot not found</p>
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
        <div className="container mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm text-gray-600">
              <button 
                onClick={() => router.back()}
                className="hover:text-amber-600 flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            </nav>
          </div>

          {/* Plot Location Map - Full Width Banner */}
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Map className="h-5 w-5" />
                <span>Plot Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={mapRef}
                className="w-full h-96 rounded-lg overflow-hidden border border-gray-200"
                style={{ minHeight: '384px' }}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plot Details - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Plot Header */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                        {plot.name}
                      </CardTitle>
                      {plot.description && (
                        <p className="text-gray-600">{plot.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {plot.is_available ? (
                        <Badge className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          Owned
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Plot Information */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Plot Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Location:</span>
                      <p className="text-gray-900">
                        {Number(plot.latitude).toFixed(6)}, {Number(plot.longitude).toFixed(6)}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Map:</span>
                      <p className="text-gray-900">{plot.map_name || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Created by:</span>
                      <p className="text-gray-900">{plot.created_by_name || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Created:</span>
                      <p className="text-gray-900">
                        {new Date(plot.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Owner Information */}
              {plot.owner_id && (
                <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      <span>Current Owner</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Owner:</span>
                        <p className="text-gray-900">{plot.owner_name || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-600">Purchased:</span>
                        <p className="text-gray-900">
                          {plot.purchased_at ? new Date(plot.purchased_at).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Purchase Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Coins className="h-5 w-5" />
                    <span>Purchase Plot</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">
                      {plot.points_price} Points
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {plot.is_available ? 'Available for purchase' : 'Already owned'}
                    </p>
                  </div>

                  {session?.user?.id && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Your Points:</span>
                        <span className="font-medium">{userPoints}</span>
                      </div>
                      {plot.is_available && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-600">After Purchase:</span>
                          <span className={`font-medium ${userPoints - plot.points_price < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {userPoints - plot.points_price}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {!session?.user?.id ? (
                    <Button 
                      onClick={() => router.push('/login')}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                    >
                      Login to Purchase
                    </Button>
                  ) : plot.is_available ? (
                    <Button 
                      onClick={handlePurchase}
                      disabled={isPurchasing || userPoints < plot.points_price}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                    >
                      {isPurchasing ? 'Purchasing...' : 'Purchase Plot'}
                    </Button>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Plot is owned</p>
                    </div>
                  )}

                  {plot.is_available && session?.user?.id && userPoints < plot.points_price && (
                    <div className="text-center text-sm text-red-600">
                      Insufficient points to purchase this plot
                    </div>
                                    )}
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
