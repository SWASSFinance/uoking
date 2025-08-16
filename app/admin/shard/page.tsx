"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AdminHeader } from "@/components/admin-header"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Globe
} from "lucide-react"

interface Shard {
  id: string
  name: string
  slug: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function ShardsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [shards, setShards] = useState<Shard[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingShard, setEditingShard] = useState<Shard | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    is_active: true,
    sort_order: 0
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }

    fetchShards()
  }, [session, status, router])

  const fetchShards = async () => {
    try {
      const response = await fetch('/api/admin/shard')
      if (response.ok) {
        const data = await response.json()
        setShards(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch shards",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch shards",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Shard name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingShard 
        ? `/api/admin/shard/${editingShard.id}`
        : '/api/admin/shard'
      
      const method = editingShard ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingShard 
            ? "Shard updated successfully" 
            : "Shard created successfully",
        })
        setIsDialogOpen(false)
        resetForm()
        fetchShards()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save shard",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save shard",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (shardId: string) => {
    try {
      const response = await fetch(`/api/admin/shard/${shardId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Shard deleted successfully",
        })
        fetchShards()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete shard",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shard",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (shard: Shard) => {
    setEditingShard(shard)
    setFormData({
      name: shard.name,
      slug: shard.slug,
      is_active: shard.is_active,
      sort_order: shard.sort_order
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingShard(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      is_active: true,
      sort_order: 0
    })
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Shards</h1>
            <p className="text-gray-600 mt-2">Add, edit, and manage UO shards for delivery</p>
          </div>
          <Button onClick={handleCreate} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Shard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {shards.map((shard) => (
            <Card key={shard.id} className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {shard.name}
                    </h3>
                  </div>
                  <Badge variant={shard.is_active ? "default" : "secondary"} className="text-xs">
                    {shard.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="space-y-1 mb-3">
                  <p className="text-xs text-gray-500">Slug: {shard.slug}</p>
                  <p className="text-xs text-gray-500">Order: {shard.sort_order}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(shard)}
                    className="flex-1 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Shard</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{shard.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(shard.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {shards.length === 0 && !loading && (
          <Card className="bg-white">
            <CardContent className="p-12 text-center">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shards found</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first shard.</p>
              <Button onClick={handleCreate} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Shard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingShard ? "Edit Shard" : "Add New Shard"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Shard Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  })}
                  placeholder="e.g., Atlantic"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({
                    ...formData,
                    slug: e.target.value
                  })}
                  placeholder="e.g., atlantic"
                />
              </div>
              
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value) || 0
                  })}
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    is_active: checked
                  })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingShard ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 