"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  MapPin, 
  Crown,
  Calendar,
  ArrowLeft,
  Home,
  Coins
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface OwnedPlot {
  id: string
  name: string
  description?: string
  latitude: number
  longitude: number
  points_price: number
  purchased_at: string
  map_name?: string
  map_slug?: string
}

export default function UserPlotsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [ownedPlots, setOwnedPlots] = useState<OwnedPlot[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user?.id) {
      router.push('/login')
      return
    }

    loadOwnedPlots()
  }, [session, status, router])

  const loadOwnedPlots = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/plots')
      
      if (response.ok) {
        const data = await response.json()
        setOwnedPlots(data.plots || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load your plots",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading owned plots:', error)
      toast({
        title: "Error",
        description: "Failed to load your plots",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!session?.user?.id) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm text-gray-600">
              <button 
                onClick={() => router.push('/account')}
                className="hover:text-amber-600 flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Account</span>
              </button>
            </nav>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Plots</h1>
            <p className="text-gray-600">View and manage your owned plots</p>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading your plots...</p>
            </div>
          ) : ownedPlots.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
              <CardContent className="text-center py-12">
                <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plots Owned</h3>
                <p className="text-gray-600 mb-6">
                  You haven't purchased any plots yet. Visit the maps to find available plots!
                </p>
                <Button 
                  onClick={() => router.push('/maps')}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Browse Maps
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedPlots.map((plot) => (
                <Card key={plot.id} className="bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                          {plot.name}
                        </CardTitle>
                        {plot.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {plot.description}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <Crown className="h-3 w-3 mr-1" />
                        Owned
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">
                          {typeof plot.latitude === 'number' ? plot.latitude.toFixed(4) : plot.latitude}, {typeof plot.longitude === 'number' ? plot.longitude.toFixed(4) : plot.longitude}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-gray-600">Map:</span>
                        <p className="font-medium">{plot.map_name || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <span className="text-gray-600">Purchase Price:</span>
                        <p className="font-medium text-amber-600">
                          {plot.points_price} points
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-gray-600">Purchased:</span>
                        <p className="font-medium">
                          {new Date(plot.purchased_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/plot/${plot.id}`)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      {plot.map_slug && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => router.push(`/maps/${plot.map_slug}`)}
                        >
                          <Home className="h-4 w-4 mr-2" />
                          View Map
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
