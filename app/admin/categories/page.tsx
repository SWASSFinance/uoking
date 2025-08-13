"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
  Filter,
  Eye,
  EyeOff,
  Star,
  Tag,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  bottom_desc: string
  image_url: string
  parent_id: string | null
  sort_order: number
  is_active: boolean
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
  parent_name?: string
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState("all")
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
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (categoryData: Partial<Category>) => {
    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        fetchCategories()
        setEditingCategory(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchCategories()
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesActive = filterActive === "all" || 
                         (filterActive === "active" && category.is_active) ||
                         (filterActive === "inactive" && !category.is_active)
    
    return matchesSearch && matchesActive
  })

  const CategoryForm = ({ category, onSave, onCancel }: { 
    category?: Category | null, 
    onSave: (data: Partial<Category>) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState({
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      bottom_desc: category?.bottom_desc || '',
      image_url: category?.image_url || '',
      parent_id: category?.parent_id || null,
      sort_order: category?.sort_order || 0,
      is_active: category?.is_active !== false,
      meta_title: category?.meta_title || '',
      meta_description: category?.meta_description || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <Card className="mb-6 border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">{category ? 'Edit Category' : 'Add New Category'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-gray-700">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="text-gray-700">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="auto-generated"
                  className="border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="parent_id" className="text-gray-700">Parent Category</Label>
                <Select value={formData.parent_id || ''} onValueChange={(value) => setFormData({...formData, parent_id: value === '' ? null : value})}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Parent (Top Level)</SelectItem>
                    {categories.filter(c => c.id !== category?.id).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sort_order" className="text-gray-700">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  className="border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="image_url" className="text-gray-700">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="border-gray-300"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active" className="text-gray-700">Active</Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-700">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="border-gray-300"
              />
            </div>
            
            <div>
              <Label htmlFor="bottom_desc" className="text-gray-700">Bottom Description (HTML)</Label>
              <Textarea
                id="bottom_desc"
                value={formData.bottom_desc}
                onChange={(e) => setFormData({...formData, bottom_desc: e.target.value})}
                rows={6}
                placeholder="HTML content for bottom of category page"
                className="border-gray-300"
              />
            </div>
            
            <div>
              <Label htmlFor="meta_title" className="text-gray-700">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                placeholder="SEO meta title"
                className="border-gray-300"
              />
            </div>
            
            <div>
              <Label htmlFor="meta_description" className="text-gray-700">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                rows={3}
                placeholder="SEO meta description"
                className="border-gray-300"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 text-gray-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                {category ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Categories Management</h1>
              <p className="text-gray-600">Organize products with categories and subcategories</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6 border border-gray-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search" className="text-gray-700">Search Categories</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status-filter" className="text-gray-700">Status</Label>
                  <Select value={filterActive} onValueChange={setFilterActive}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Form */}
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

          {/* Categories Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          ) : (
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Categories ({filteredCategories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-700">Category</TableHead>
                      <TableHead className="text-gray-700">Parent</TableHead>
                      <TableHead className="text-gray-700">Sort Order</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Description</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                              {category.image_url ? (
                                <Image
                                  src={category.image_url}
                                  alt={category.name}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              ) : (
                                <FolderOpen className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{category.name}</div>
                              <div className="text-sm text-gray-500">ID: {category.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {category.parent_name || 'Top Level'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {category.sort_order}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`${
                              category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {category.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600 max-w-xs">
                            {category.description && category.description.length > 100 
                              ? `${category.description.substring(0, 100)}...` 
                              : category.description}
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
                              className="border-gray-300 text-gray-700"
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
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Category
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 