"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { 
  Map, 
  Eye,
  Calendar,
  User,
  MapPin
} from "lucide-react"
import Image from "next/image"

interface MapData {
  id: string
  name: string
  description: string
  map_file_url: string
  plot_count: number
  created_by_name: string
  created_at: string
}

export default function MapsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [maps, setMaps] = useState<MapData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMaps()
  }, [])

  const loadMaps = async () => {
    try {
      const response = await fetch('/api/maps')
      if (response.ok) {
        const data = await response.json()
        setMaps(data.maps || [])
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
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Game Maps</h1>
            <p className="text-gray-600">Explore interactive maps with plot locations and points pricing</p>
          </div>

          {/* Maps Grid */}
          {maps.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-12">
                <div className="text-center">
                  <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Maps Available</h3>
                  <p className="text-gray-600">Check back later for interactive game maps!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {maps.map((map) => (
                <Card key={map.id} className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Map Preview */}
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      {map.map_file_url ? (
                        <Image
                          src={map.map_file_url}
                          alt={map.name}
                          width={400}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Map className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {map.plot_count} plots
                      </div>
                    </div>

                    {/* Map Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{map.name}</h3>
                      {map.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{map.description}</p>
                      )}

                      {/* Stats */}
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Plots
                          </span>
                          <span className="font-medium">{map.plot_count}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Created by
                          </span>
                          <span className="font-medium">{map.created_by_name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Created
                          </span>
                          <span className="font-medium">{new Date(map.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <Button 
                        onClick={() => router.push(`/maps/${map.id}`)}
                        className="w-full bg-amber-600 hover:bg-amber-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Map
                      </Button>
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
