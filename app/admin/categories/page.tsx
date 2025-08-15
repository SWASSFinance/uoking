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
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  EyeOff,
  Image as ImageIcon,
  Save,
  X
} from "lucide-react"
import { ProductImage } from "@/components/ui/product-image"
import { ImageUpload } from "@/components/ui/image-upload"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  parent_id: string | null
  parent_name?: string
  sort_order: number
  is_active: boolean
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)


  // Fetch data on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (categoryData: Partial<Category>) => {
    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      // Clean up the data before sending
      const cleanData = {
        ...categoryData,
        parent_id: categoryData.parent_id === 'none' ? null : categoryData.parent_id,
        sort_order: parseInt(categoryData.sort_order?.toString() || '0'),
        is_active: Boolean(categoryData.is_active)
      }
      
      console.log('Saving category data:', cleanData)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Category saved successfully:', result)
        alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!')
        fetchCategories()
        setEditingCategory(null)
        setShowForm(false)
      } else {
        const errorData = await response.json()
        console.error('Error saving category:', errorData)
        alert(`Error saving category: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error saving category. Please try again.')
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchCategories()
        } else {
          const errorData = await response.json()
          alert(`Error deleting category: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }



  const filteredCategories = (categories || []).filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && category.is_active) ||
                         (filterStatus === "inactive" && !category.is_active)
    
    return matchesSearch && matchesStatus
  })

  const CategoryForm = ({ category, onSave, onCancel }: { 
    category?: Category | null, 
    onSave: (data: Partial<Category>) => void, 
    onCancel: () => void 
  }) => {
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<{
      name: string
      slug: string
      description: string
      image_url: string
      parent_id: string | null
      sort_order: number
      is_active: boolean
      meta_title: string
      meta_description: string
    }>({
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      image_url: category?.image_url || '',
      parent_id: category?.parent_id || null,
      sort_order: category?.sort_order || 0,
      is_active: category?.is_active !== false,
      meta_title: category?.meta_title || '',
      meta_description: category?.meta_description || ''
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
                {category ? 'Edit Category' : 'Add New Category'}
              </h2>
              <Button variant="ghost" size="sm" onClick={onCancel} className="text-black hover:bg-gray-100">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-black font-semibold">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="border-gray-300 bg-white text-black"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-black font-semibold">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="auto-generated from name"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="parent_id" className="text-black font-semibold">Parent Category</Label>
                  <Select value={formData.parent_id || 'none'} onValueChange={(value) => setFormData({...formData, parent_id: value === 'none' ? null : value})}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="none" className="text-black">No Parent</SelectItem>
                      {categories
                        .filter(cat => cat.id !== category?.id) // Don't allow self as parent
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="text-black">
                            {cat.name}
                          </SelectItem>
                        ))}
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

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-black font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>



                <div className="md:col-span-2">
                  <Label htmlFor="meta_title" className="text-black font-semibold">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                    placeholder="SEO meta title"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="meta_description" className="text-black font-semibold">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                    rows={2}
                    placeholder="SEO meta description"
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-black font-semibold">Category Image</Label>
                  <div className="mt-2">
                    <ImageUpload
                      value={formData.image_url}
                      onChange={(url) => setFormData({...formData, image_url: url})}
                      label=""
                      className="w-full"
                    />
                    {formData.image_url && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Current image:</p>
                        <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                          <ProductImage
                            src={formData.image_url}
                            alt="Category preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="is_active" className="text-black font-semibold">Active</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Inactive categories won't be visible to customers</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 text-black hover:bg-gray-100">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
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
              <h1 className="text-3xl font-bold text-black">Categories Management</h1>
              <p className="text-gray-600 mt-2">Manage product categories, descriptions, and images</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
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
                      placeholder="Search categories..."
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

          {/* Categories Table */}
          {loading ? (
            <Card className="mb-6">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading categories...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-black">
                  Categories ({filteredCategories.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black">Image</TableHead>
                      <TableHead className="text-black">Name</TableHead>
                      <TableHead className="text-black">Parent</TableHead>
                      <TableHead className="text-black">Status</TableHead>
                      <TableHead className="text-black">Sort Order</TableHead>
                      <TableHead className="text-black">Products</TableHead>
                      <TableHead className="text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="relative w-12 h-12 border border-gray-300 rounded-lg overflow-hidden">
                            {category.image_url ? (
                              <ProductImage
                                src={category.image_url}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-black">{category.name}</div>
                            <div className="text-sm text-gray-600">{category.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-black">
                            {category.parent_name || 'None'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`${
                              category.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {category.is_active ? (
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
                            {category.sort_order}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-black">
                            {/* TODO: Add product count */}
                            -
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingCategory(category)
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
                              onClick={() => handleDelete(category.id)}
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

          {!loading && filteredCategories.length === 0 && (
            <Card className="mb-6">
              <CardContent className="p-12">
                <div className="text-center">
                  <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-black mb-2">No categories found</h3>
                  <p className="text-gray-700 mb-6">Try adjusting your search or filters</p>
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingCategory(null)
          }}
        />
      )}
    </div>
  )
} 