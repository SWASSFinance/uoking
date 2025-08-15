"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Video, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  EyeOff,
  Play,
  Save,
  X
} from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import { VideoUpload } from "@/components/ui/video-upload"

interface Banner {
  id: string
  title: string
  subtitle: string
  description: string
  video_url: string
  image_url: string
  button_text: string
  button_url: string
  position: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data || [])
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (bannerData: Partial<Banner>) => {
    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners'
      const method = editingBanner ? 'PUT' : 'POST'
      
      // Clean up the data before sending
      const cleanData = {
        ...bannerData,
        sort_order: parseInt(bannerData.sort_order?.toString() || '0'),
        is_active: Boolean(bannerData.is_active)
      }
      
      console.log('Saving banner data:', cleanData)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Banner saved successfully:', result)
        alert(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!')
        fetchBanners()
        setEditingBanner(null)
        setShowForm(false)
      } else {
        const errorData = await response.json()
        console.error('Error saving banner:', errorData)
        alert(`Error saving banner: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('Error saving banner. Please try again.')
    }
  }

  const handleDelete = async (bannerId: string) => {
    if (confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/banners/${bannerId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchBanners()
        } else {
          const errorData = await response.json()
          alert(`Error deleting banner: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Error deleting banner:', error)
      }
    }
  }

  const filteredBanners = (banners || []).filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (banner.description && banner.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && banner.is_active) ||
                         (filterStatus === "inactive" && !banner.is_active)
    
    return matchesSearch && matchesStatus
  })

  const BannerForm = ({ banner, onSave, onCancel }: { 
    banner?: Banner | null, 
    onSave: (data: Partial<Banner>) => void, 
    onCancel: () => void 
  }) => {
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<{
      title: string
      subtitle: string
      description: string
      video_url: string
      image_url: string
      button_text: string
      button_url: string
      position: string
      sort_order: number
      is_active: boolean
    }>({
      title: banner?.title || '',
      subtitle: banner?.subtitle || '',
      description: banner?.description || '',
      video_url: banner?.video_url || '',
      image_url: banner?.image_url || '',
      button_text: banner?.button_text || '',
      button_url: banner?.button_url || '',
      position: banner?.position || 'homepage',
      sort_order: banner?.sort_order || 0,
      is_active: banner?.is_active !== false
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSaving(true)
      try {
        await onSave(formData)
      } finally {
        setIsSaving(false)
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto light">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">
                {banner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <Button variant="ghost" size="sm" onClick={onCancel} className="text-black hover:bg-gray-100">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-black font-semibold">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="border-gray-300 bg-white text-black"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle" className="text-black font-semibold">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="position" className="text-black font-semibold">Position</Label>
                  <Select value={formData.position} onValueChange={(value) => setFormData({...formData, position: value})}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="homepage" className="text-black">Homepage</SelectItem>
                      <SelectItem value="category" className="text-black">Category Page</SelectItem>
                      <SelectItem value="product" className="text-black">Product Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sort_order" className="text-black font-semibold">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="button_text" className="text-black font-semibold">Button Text</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                    placeholder="e.g., Shop Now, Learn More"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="button_url" className="text-black font-semibold">Button URL</Label>
                  <Input
                    id="button_url"
                    value={formData.button_url}
                    onChange={(e) => setFormData({...formData, button_url: e.target.value})}
                    placeholder="e.g., /store, /about"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-black font-semibold">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="border-gray-300 bg-white text-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <VideoUpload
                    value={formData.video_url}
                    onChange={(url) => setFormData({...formData, video_url: url})}
                    label="Video"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-black font-semibold">Fallback Image</Label>
                  <div className="mt-2">
                    <ImageUpload
                      value={formData.image_url}
                      onChange={(url) => setFormData({...formData, image_url: url})}
                      label=""
                      className="w-full"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      This image will be shown if the video fails to load
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active" className="text-black font-semibold">Active</Label>
                </div>
                <p className="text-sm text-gray-600 mt-1">Inactive banners won't be displayed on the site</p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 text-black hover:bg-gray-100">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : (banner ? 'Update Banner' : 'Create Banner')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black light admin-page">
      <AdminHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black">Banner Management</h1>
              <p className="text-gray-600 mt-2">Manage homepage banners, videos, and promotional content</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search banners..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 bg-white text-black"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-black">All Status</SelectItem>
                      <SelectItem value="active" className="text-black">Active</SelectItem>
                      <SelectItem value="inactive" className="text-black">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banners Table */}
          {loading ? (
            <Card className="mb-6">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading banners...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-black">
                  Banners ({filteredBanners.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black">Preview</TableHead>
                      <TableHead className="text-black">Title</TableHead>
                      <TableHead className="text-black">Position</TableHead>
                      <TableHead className="text-black">Status</TableHead>
                      <TableHead className="text-black">Sort Order</TableHead>
                      <TableHead className="text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <div className="relative w-24 h-16 border border-gray-300 rounded-lg overflow-hidden">
                            {banner.video_url ? (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Play className="h-6 w-6 text-gray-400" />
                              </div>
                            ) : banner.image_url ? (
                              <img
                                src={banner.image_url}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Video className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-black">{banner.title}</div>
                            <div className="text-sm text-gray-600">{banner.subtitle}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-black">
                            {banner.position}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`${
                              banner.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {banner.is_active ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-black">
                            {banner.sort_order}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingBanner(banner)
                                setShowForm(true)
                              }}
                              className="border-gray-300 text-black hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(banner.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {!loading && filteredBanners.length === 0 && (
            <Card className="mb-6">
              <CardContent className="p-12">
                <div className="text-center">
                  <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-black mb-2">No banners found</h3>
                  <p className="text-gray-700 mb-6">Try adjusting your search or filters</p>
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Banner
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Banner Form Modal */}
      {showForm && (
        <BannerForm
          banner={editingBanner}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingBanner(null)
          }}
        />
      )}
    </div>
  )
} 