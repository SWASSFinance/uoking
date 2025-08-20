"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ImageUpload } from "@/components/ui/image-upload"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  EyeOff,
  GraduationCap
} from "lucide-react"
import Image from "next/image"

interface Class {
  id: string
  name: string
  slug: string
  description: string
  image_url?: string
  primary_stats: string[]
  skills: string[]
  playstyle: string
  difficulty_level: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminClassesPage() {
  const { toast } = useToast()
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    primary_stats: [] as string[],
    skills: [] as string[],
    playstyle: "",
    difficulty_level: 3,
    is_active: true
  })

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/admin/classes')
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load classes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      toast({
        title: "Error",
        description: "Failed to load classes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Class created successfully",
        })
        setIsCreating(false)
        resetForm()
        loadClasses()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create class",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating class:', error)
      toast({
        title: "Error",
        description: "Failed to create class",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/admin/classes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Class updated successfully",
        })
        setEditingId(null)
        resetForm()
        loadClasses()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update class",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating class:', error)
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/classes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Class deleted successfully",
        })
        loadClasses()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete class",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting class:', error)
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_url: "",
      primary_stats: [],
      skills: [],
      playstyle: "",
      difficulty_level: 3,
      is_active: true
    })
  }

  const startEdit = (classItem: Class) => {
    setEditingId(classItem.id)
    setFormData({
      name: classItem.name,
      slug: classItem.slug,
      description: classItem.description,
      image_url: classItem.image_url || "",
      primary_stats: Array.isArray(classItem.primary_stats) ? classItem.primary_stats : [],
      skills: Array.isArray(classItem.skills) ? classItem.skills : [],
      playstyle: classItem.playstyle,
      difficulty_level: classItem.difficulty_level,
      is_active: classItem.is_active
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    resetForm()
  }

  const handleArrayInput = (field: 'primary_stats' | 'skills', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    setFormData(prev => ({ ...prev, [field]: array }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading classes..." />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classes Management</h1>
            <p className="text-gray-600 mt-2">
              Manage the classes used in the frontend navigation
            </p>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{isCreating ? 'Create New Class' : 'Edit Class'}</span>
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mage, Tamer, Melee"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Auto-generated from name"
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Class description..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty_level">Difficulty Level</Label>
                  <select
                    id="difficulty_level"
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={1}>1 - Very Easy</option>
                    <option value={2}>2 - Easy</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - Hard</option>
                    <option value={5}>5 - Very Hard</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    label="Class Image"
                  />
                </div>

                <div>
                  <Label htmlFor="primary_stats">Primary Stats (comma-separated)</Label>
                  <Input
                    id="primary_stats"
                    value={formData.primary_stats.join(', ')}
                    onChange={(e) => handleArrayInput('primary_stats', e.target.value)}
                    placeholder="e.g., Intelligence, Dexterity"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills.join(', ')}
                    onChange={(e) => handleArrayInput('skills', e.target.value)}
                    placeholder="e.g., Magery, Meditation"
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="playstyle">Playstyle</Label>
                  <Textarea
                    id="playstyle"
                    value={formData.playstyle}
                    onChange={(e) => setFormData({ ...formData, playstyle: e.target.value })}
                    placeholder="Describe the playstyle..."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="is_active">Active (visible in navigation)</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => isCreating ? handleCreate() : handleUpdate(editingId!)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isCreating ? 'Create' : 'Update'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <span>{classItem.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {classItem.is_active ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Eye className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
                            <CardContent>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {classItem.image_url && (
                    <div className="flex justify-center">
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={classItem.image_url}
                          alt={classItem.name}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Slug:</span>
                    <p className="text-sm text-gray-900 font-mono">{classItem.slug}</p>
                  </div>
                  
                  {classItem.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Description:</span>
                      <p className="text-sm text-gray-900 line-clamp-2">{classItem.description}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-medium text-gray-600">Difficulty:</span>
                    <Badge variant="outline" className="ml-2">
                      {classItem.difficulty_level}/5
                    </Badge>
                  </div>

                  {classItem.primary_stats && classItem.primary_stats.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Primary Stats:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {classItem.primary_stats.map((stat, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {stat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(classItem)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(classItem.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Found</h3>
            <p className="text-gray-600 mb-4">Create your first class to get started.</p>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Class
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
