"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { 
  Upload, 
  Map, 
  Trash2, 
  Edit, 
  Eye,
  FileText,
  Calendar,
  User,
  Download
} from "lucide-react"
import Image from "next/image"

interface MapData {
  id: string
  name: string
  description: string
  map_file_url: string
  map_file_size: number
  plot_count: number
  created_by_name: string
  created_at: string
  updated_at: string
}

export default function AdminMapsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [maps, setMaps] = useState<MapData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    mapFile: null as File | null
  })

  // Redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/')
    }
  }, [status, session, router])

  // Load maps
  useEffect(() => {
    if (session?.user?.isAdmin) {
      loadMaps()
    }
  }, [session])

  const loadMaps = async () => {
    try {
      const response = await fetch('/api/admin/maps')
      if (response.ok) {
        const data = await response.json()
        setMaps(data.maps || [])
      }
    } catch (error) {
      console.error('Error loading maps:', error)
      toast({
        title: "Error",
        description: "Failed to load maps. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Map file must be less than 100MB.",
          variant: "destructive",
        })
        return
      }
      setUploadForm({ ...uploadForm, mapFile: file })
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.mapFile || !uploadForm.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a map name and select a file.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', uploadForm.name)
      formData.append('description', uploadForm.description)
      formData.append('mapFile', uploadForm.mapFile)

      const response = await fetch('/api/admin/maps', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Map uploaded successfully!",
        })
        setShowUploadForm(false)
        setUploadForm({ name: "", description: "", mapFile: null })
        loadMaps() // Reload maps
      } else {
        const error = await response.json()
        toast({
          title: "Upload Failed",
          description: error.error || "Failed to upload map. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error uploading map:', error)
      toast({
        title: "Upload Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteMap = async (mapId: string, mapName: string) => {
    if (!confirm(`Are you sure you want to delete "${mapName}"? This will also delete all associated plots.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/maps/${mapId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Map deleted successfully!",
        })
        loadMaps() // Reload maps
      } else {
        const error = await response.json()
        toast({
          title: "Delete Failed",
          description: error.error || "Failed to delete map. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting map:', error)
      toast({
        title: "Delete Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <AdminHeader />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <LoadingSpinner size="lg" text="Loading maps..." />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <AdminHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Map Management</h1>
            <p className="text-gray-600">Upload and manage map files for the game world</p>
          </div>

          {/* Upload Section */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900">Upload New Map</CardTitle>
                <Button 
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {showUploadForm ? 'Cancel' : 'Upload Map'}
                </Button>
              </div>
            </CardHeader>
            {showUploadForm && (
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">Map Name *</Label>
                    <Input
                      id="name"
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                      placeholder="Enter map name"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      placeholder="Enter map description"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mapFile" className="text-gray-700 font-medium">Map File *</Label>
                    <div className="mt-1">
                      <Input
                        id="mapFile"
                        type="file"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.zip,.rar"
                        className="cursor-pointer"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Supported formats: JPG, PNG, GIF, PDF, ZIP, RAR (Max 100MB)
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="submit" 
                      disabled={isUploading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Map
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setShowUploadForm(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Maps List */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Uploaded Maps</CardTitle>
            </CardHeader>
            <CardContent>
              {maps.length === 0 ? (
                <div className="text-center py-12">
                  <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Maps Yet</h3>
                  <p className="text-gray-600 mb-6">Upload your first map to get started</p>
                  <Button 
                    onClick={() => setShowUploadForm(true)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload First Map
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {maps.map((map) => (
                    <div key={map.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      {/* Map Preview */}
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        {map.map_file_url ? (
                          <Image
                            src={map.map_file_url}
                            alt={map.name}
                            width={300}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Map className="h-12 w-12 text-gray-400" />
                        )}
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
                              <FileText className="h-4 w-4 mr-1" />
                              File Size
                            </span>
                            <span className="font-medium">{formatFileSize(map.map_file_size)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <Map className="h-4 w-4 mr-1" />
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

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => router.push(`/maps/${map.id}`)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            onClick={() => router.push(`/maps/${map.id}?admin=true`)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            onClick={() => handleDeleteMap(map.id, map.name)}
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
