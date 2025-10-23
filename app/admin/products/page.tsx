"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { createNoCacheFetch } from "@/lib/fetch-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  Tag,
  Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import { ProductImage } from "@/components/ui/product-image"
import { ImageUpload } from "@/components/ui/image-upload"
import { UnifiedSEOScore } from "@/components/unified-seo-score"
import { Pagination } from "@/components/ui/pagination"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  price: string
  image_url: string
  status: string
  featured: boolean
  class_id: string
  type: string
  rank: number
  requires_character_name: boolean
  requires_shard: boolean
  admin_notes?: string

  created_at: string
  updated_at: string
  category_names?: string
  category_ids?: string
  class_names?: string
  class_ids?: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Class {
  id: string
  name: string
  slug: string
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterClass, setFilterClass] = useState("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories()
    fetchClasses()
  }, [])

  // Fetch products when pagination or filters change
  useEffect(() => {
    fetchProducts()
  }, [currentPage, itemsPerPage, searchTerm, filterStatus, filterCategory, filterClass, sortOrder])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterCategory !== 'all' && { categoryId: filterCategory }),
        ...(filterClass !== 'all' && { classId: filterClass }),
        sortBy: 'created_at',
        sortOrder: sortOrder === 'newest' ? 'desc' : 'asc'
      })
      
      const response = await createNoCacheFetch(`/api/admin/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setTotalItems(data.total || 0)
        setTotalPages(data.totalPages || 0)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setTotalItems(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await createNoCacheFetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await createNoCacheFetch('/api/admin/classes')
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const handleSave = async (productData: any) => {
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await createNoCacheFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        fetchProducts()
        setEditingProduct(null)
        setShowForm(false)
        setShowEditModal(false)
      }
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await createNoCacheFetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchProducts()
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  // Reset to first page when filters change
  const handleFilterChange = (newFilter: any) => {
    setCurrentPage(1)
    // The actual filter state will be updated by the component that calls this
  }

  const ProductForm = ({ product, onSave, onCancel }: { 
    product?: Product | null, 
    onSave: (data: any) => void, 
    onCancel: () => void 
  }) => {
    const [searchUOPrice, setSearchUOPrice] = useState<{
      price: number | null
      itemName: string | null
      imageUrl: string | null
      itemDetails: string | null
      found: boolean
      loading: boolean
      error: string | null
    }>({
      price: null,
      itemName: null,
      imageUrl: null,
      itemDetails: null,
      found: false,
      loading: false,
      error: null
    })

    // Fetch SearchUO price when product is loaded
    useEffect(() => {
      if (product?.name) {
        fetchSearchUOPrice(product.name)
      }
    }, [product?.name])

    const fetchSearchUOPrice = async (productName: string) => {
      setSearchUOPrice(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const response = await fetch('/api/searchuo/price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productName }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setSearchUOPrice({
            price: data.found ? data.price : null,
            itemName: data.found ? data.itemName : null,
            imageUrl: data.found ? data.imageUrl : null,
            itemDetails: data.found ? data.itemDetails : null,
            found: data.found,
            loading: false,
            error: data.found ? null : data.message
          })
        } else {
          setSearchUOPrice(prev => ({
            ...prev,
            loading: false,
            error: data.error || 'Failed to fetch price'
          }))
        }
      } catch (error) {
        setSearchUOPrice(prev => ({
          ...prev,
          loading: false,
          error: 'Network error'
        }))
      }
    }

             const [formData, setFormData] = useState({
     name: product?.name || '',
     slug: product?.slug || '',
     description: product?.description || '',
     short_description: product?.short_description || '',
     price: product?.price || '',
     image_url: product?.image_url || '',
     status: product?.status || 'active',
     featured: product?.featured || false,
     category_ids: product?.category_ids ? 
       [...product.category_ids.split(',').filter(id => id.trim() !== ''), '', '', ''].slice(0, 3) : 
       ['', '', ''],
     class_ids: product?.class_ids ? 
       [...product.class_ids.split(',').filter(id => id.trim() !== ''), '', ''].slice(0, 2) : 
       ['', ''],
     type: product?.type || 'item',
     rank: product?.rank || 0,
     requires_character_name: product?.requires_character_name || false,
     requires_shard: product?.requires_shard || false,
     admin_notes: product?.admin_notes || ''
   })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-black font-semibold">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="border-gray-300 bg-white text-black"
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="text-black font-semibold">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="auto-generated"
                  className="border-gray-300 bg-white text-black"
                />
              </div>
              
              <div>
                <Label htmlFor="price" className="text-black font-semibold">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  className="border-gray-300 bg-white text-black"
                />
                
                {/* SearchUO Price Display */}
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-800">SearchUO Price:</span>
                      {searchUOPrice.loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fetchSearchUOPrice(product?.name || '')}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Refresh
                    </Button>
                  </div>
                  
                  {searchUOPrice.found && searchUOPrice.price && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {searchUOPrice.imageUrl && (
                            <img 
                              src={searchUOPrice.imageUrl} 
                              alt={searchUOPrice.itemName || ''} 
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          )}
                          <div>
                            <div className="font-semibold text-green-600">
                              ${searchUOPrice.price.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {searchUOPrice.itemName}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({...formData, price: searchUOPrice.price!.toString()})}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          Use This Price
                        </Button>
                      </div>
                      {searchUOPrice.itemDetails && (
                        <div className="mt-2 p-3 bg-gray-50 rounded border">
                          <div className="text-xs font-semibold text-gray-700 mb-2">Item Stats:</div>
                          <div className="text-xs text-gray-600 space-y-1">
                            {searchUOPrice.itemDetails
                              .split(/(?=[A-Z][a-z]+ \d+)/)
                              .filter(stat => stat.trim())
                              .map((stat, index) => (
                                <div key={index} className="flex justify-between items-center py-1 px-2 bg-white rounded border-l-2 border-blue-200">
                                  <span className="font-medium text-gray-700">
                                    {stat.trim().replace(/(\d+)/, ' $1').trim()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!searchUOPrice.loading && !searchUOPrice.found && (
                    <div className="mt-2 text-sm text-gray-600">
                      {searchUOPrice.error || 'No results found on SearchUO'}
                    </div>
                  )}
                </div>
              </div>
              

              
              <div>
                <Label htmlFor="category" className="text-black font-semibold">Categories (Up to 3)</Label>
                <div className="space-y-1">
                  {[0, 1, 2].map((index) => (
                    <Select 
                      key={index}
                      value={formData.category_ids[index] || 'none'} 
                      onValueChange={(value) => {
                        const newCategoryIds = [...formData.category_ids]
                        newCategoryIds[index] = value === 'none' ? '' : value
                        setFormData({...formData, category_ids: newCategoryIds})
                      }}
                    >
                      <SelectTrigger className="border-gray-300 bg-white text-black">
                        <SelectValue placeholder={`Select category ${index + 1}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="none" className="text-black">None</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-black">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </div>
              
                             <div>
                 <Label htmlFor="class" className="text-black font-semibold">Classes (Up to 2)</Label>
                 <div className="space-y-1">
                   {[0, 1].map((index) => (
                     <Select 
                       key={index}
                       value={formData.class_ids[index] || 'none'} 
                       onValueChange={(value) => {
                         const newClassIds = [...formData.class_ids]
                         newClassIds[index] = value === 'none' ? '' : value
                         setFormData({...formData, class_ids: newClassIds})
                       }}
                     >
                       <SelectTrigger className="border-gray-300 bg-white text-black">
                         <SelectValue placeholder={`Select class ${index + 1}`} />
                       </SelectTrigger>
                       <SelectContent className="bg-white">
                         <SelectItem value="none" className="text-black">None</SelectItem>
                         {classes.map((classItem) => (
                           <SelectItem key={classItem.id} value={classItem.id} className="text-black">
                             {classItem.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   ))}
                 </div>
               </div>
              
              <div>
                <Label htmlFor="status" className="text-black font-semibold">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="border-gray-300 bg-white text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="active" className="text-black">Active</SelectItem>
                    <SelectItem value="inactive" className="text-black">Inactive</SelectItem>
                    <SelectItem value="draft" className="text-black">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type" className="text-black font-semibold">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger className="border-gray-300 bg-white text-black">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="item" className="text-black">Item</SelectItem>
                    <SelectItem value="service" className="text-black">Service</SelectItem>
                    <SelectItem value="account" className="text-black">Account</SelectItem>
                    <SelectItem value="gold" className="text-black">Gold</SelectItem>
                    <SelectItem value="house" className="text-black">House</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="rank" className="text-black font-semibold">Display Order (Rank)</Label>
                <Input
                  id="rank"
                  type="number"
                  value={formData.rank}
                  onChange={(e) => setFormData({...formData, rank: parseInt(e.target.value) || 0})}
                  placeholder="0"
                  className="border-gray-300 bg-white text-black"
                />
                <p className="text-xs text-gray-600 mt-1">Lower numbers appear first. Products with same rank are sorted alphabetically.</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="short_description" className="text-black font-semibold">Short Description</Label>
              <Textarea
                id="short_description"
                value={formData.short_description}
                onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                rows={2}
                className="border-gray-300 bg-white text-black"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-black font-semibold">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="border-gray-300 bg-white text-black"
              />
            </div>
            
            <div>
              <Label htmlFor="admin_notes" className="text-black font-semibold">Admin Notes</Label>
              <Textarea
                id="admin_notes"
                value={formData.admin_notes}
                onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                placeholder="Internal notes for product management and search instructions..."
                rows={3}
                className="border-gray-300 bg-white text-black"
              />
              <p className="text-xs text-gray-600 mt-1">Internal notes for admins only. Not visible to customers.</p>
            </div>
            
            <div>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({...formData, image_url: url})}
                label="Product Image"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                />
                <Label htmlFor="featured" className="text-black font-semibold">Featured Product</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="requires_character_name"
                  checked={formData.requires_character_name}
                  onCheckedChange={(checked) => setFormData({...formData, requires_character_name: checked})}
                />
                <Label htmlFor="requires_character_name" className="text-black font-semibold">Requires Character Name</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="requires_shard"
                  checked={formData.requires_shard}
                  onCheckedChange={(checked) => setFormData({...formData, requires_shard: checked})}
                />
                <Label htmlFor="requires_shard" className="text-black font-semibold">Requires Shard</Label>
              </div>
            </div>
            
            {/* SEO Analytics */}
            <div className="mt-6">
              <UnifiedSEOScore 
                mode="detailed"
                showDevDetails={true}
                product={{
                  name: formData.name,
                  slug: formData.slug,
                  description: formData.description,
                  short_description: formData.short_description,
                  image_url: formData.image_url,
                  category_name: categories.find(c => c.id === formData.category_ids[0])?.name
                }}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 text-gray-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {product ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        )
  }

  return (
    <div className="min-h-screen bg-white text-black admin-page">
      <AdminHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Products Management</h1>
              <p className="text-gray-700">Manage all products, pricing, and inventory</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6 border border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="search" className="text-black font-semibold">Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="pl-10 border-gray-300 bg-white text-black"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status-filter" className="text-black font-semibold">Status</Label>
                  <Select value={filterStatus} onValueChange={(value) => {
                    setFilterStatus(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-black">All Status</SelectItem>
                      <SelectItem value="active" className="text-black">Active</SelectItem>
                      <SelectItem value="inactive" className="text-black">Inactive</SelectItem>
                      <SelectItem value="draft" className="text-black">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category-filter" className="text-black font-semibold">Category</Label>
                  <Select value={filterCategory} onValueChange={(value) => {
                    setFilterCategory(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-black">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-black">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="class-filter" className="text-black font-semibold">Class</Label>
                  <Select value={filterClass} onValueChange={(value) => {
                    setFilterClass(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-black">All Classes</SelectItem>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id} className="text-black">
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="sort-order" className="text-black font-semibold">Sort By</Label>
                  <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => {
                    setSortOrder(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="newest" className="text-black">Newest First</SelectItem>
                      <SelectItem value="oldest" className="text-black">Oldest First</SelectItem>
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

          {/* Product Form */}
          {showForm && (
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditingProduct(null)
              }}
            />
          )}

          {/* Edit Product Modal */}
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-black">Edit Product</DialogTitle>
              </DialogHeader>
              {editingProduct && (
                <ProductForm
                  product={editingProduct}
                  onSave={handleSave}
                  onCancel={() => {
                    setShowEditModal(false)
                    setEditingProduct(null)
                  }}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Products Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black">Products ({totalItems})</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Top Pagination */}
                <div className="flex items-center justify-between px-2 py-4 border-b">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    showItemsPerPage={true}
                    itemsPerPageOptions={[10, 25, 50, 100]}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black font-semibold">Product</TableHead>
                      <TableHead className="text-black font-semibold">Price</TableHead>
                      <TableHead className="text-black font-semibold">Category</TableHead>
                      <TableHead className="text-black font-semibold">Class</TableHead>
                      <TableHead className="text-black font-semibold">Status</TableHead>
                      <TableHead className="text-black font-semibold">Type</TableHead>
                      <TableHead className="text-black font-semibold">Rank</TableHead>
                      <TableHead className="text-black font-semibold">SEO Score</TableHead>
                      <TableHead className="text-black font-semibold">Created Date</TableHead>
                      <TableHead className="text-black font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                              <ProductImage
                                src={product.image_url}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-black">{product.name}</div>
                              <div className="text-sm text-gray-700">
                                {product.short_description && product.short_description.length > 50 
                                  ? `${product.short_description.substring(0, 50)}...` 
                                  : product.short_description}
                              </div>
                              {product.featured && (
                                <Badge className="mt-1 bg-yellow-100 text-yellow-800">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              ${parseFloat(product.price).toFixed(2)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-black">
                            {product.category_names || 'No Category'}
                          </div>
                        </TableCell>
                                                 <TableCell>
                           <div className="text-sm text-black">
                             {product.class_names || 'No Class'}
                           </div>
                         </TableCell>
                        <TableCell>
                          <Badge 
                            className={`${
                              product.status === 'active' ? 'bg-green-100 text-green-800' : 
                              product.status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-black">
                            {product.type || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-black">
                            {product.rank || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <UnifiedSEOScore 
                            mode="compact"
                            product={{
                              name: product.name,
                              slug: product.slug,
                              description: product.description,
                              short_description: product.short_description,
                              image_url: product.image_url,
                              category_name: product.category_names
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-black">
                            {new Date(product.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingProduct(product)
                                setShowEditModal(true)
                              }}
                              className="border-gray-300 text-gray-700"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(product.id)}
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
                
                {/* Bottom Pagination */}
                <div className="flex items-center justify-between px-2 py-4 border-t">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    showItemsPerPage={true}
                    itemsPerPageOptions={[10, 25, 50, 100]}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">No products found</h3>
              <p className="text-gray-700 mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
} 