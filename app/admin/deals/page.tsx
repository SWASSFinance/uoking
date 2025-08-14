"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Tag, 
  Plus, 
  Calendar,
  DollarSign,
  Package,
  Edit,
  Trash2
} from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
}

interface DealOfTheDay {
  id: string
  product_id: string
  product_name: string
  discount_percentage: number
  start_date: string
  end_date: string
  is_active: boolean
}

export default function DealsAdminPage() {
  const [deals, setDeals] = useState<DealOfTheDay[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState<DealOfTheDay | null>(null)
  
  const [formData, setFormData] = useState({
    product_id: '',
    discount_percentage: 15,
    start_date: '',
    end_date: ''
  })

  useEffect(() => {
    fetchDeals()
    fetchProducts()
  }, [])

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/admin/deals')
      if (response.ok) {
        const data = await response.json()
        setDeals(data.deals)
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingDeal 
        ? `/api/admin/deals/${editingDeal.id}`
        : '/api/admin/deals'
      
      const method = editingDeal ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingDeal(null)
        setFormData({
          product_id: '',
          discount_percentage: 15,
          start_date: '',
          end_date: ''
        })
        fetchDeals()
      }
    } catch (error) {
      console.error('Error saving deal:', error)
    }
  }

  const handleEdit = (deal: DealOfTheDay) => {
    setEditingDeal(deal)
    setFormData({
      product_id: deal.product_id,
      discount_percentage: deal.discount_percentage,
      start_date: deal.start_date,
      end_date: deal.end_date
    })
    setShowForm(true)
  }

  const handleDelete = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return
    
    try {
      const response = await fetch(`/api/admin/deals/${dealId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchDeals()
      }
    } catch (error) {
      console.error('Error deleting deal:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || 'Unknown Product'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <AdminHeader />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading deals...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Deal of the Day Management</h1>
              <p className="text-gray-700">Manage daily deals and special offers</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Deal
            </Button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <Card className="mb-8 border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black">
                  {editingDeal ? 'Edit Deal' : 'Add New Deal'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="product_id" className="text-black font-semibold">Product</Label>
                    <Select
                      value={formData.product_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
                    >
                      <SelectTrigger className="border-gray-300 bg-white text-black">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - ${product.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="discount_percentage" className="text-black font-semibold">Discount Percentage</Label>
                    <Input
                      id="discount_percentage"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 15 }))}
                      placeholder="15"
                      className="border-gray-300 bg-white text-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date" className="text-black font-semibold">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        className="border-gray-300 bg-white text-black"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date" className="text-black font-semibold">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        className="border-gray-300 bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      {editingDeal ? 'Update Deal' : 'Create Deal'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        setEditingDeal(null)
                        setFormData({
                          product_id: '',
                          discount_percentage: 15,
                          start_date: '',
                          end_date: ''
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Deals List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Card key={deal.id} className="border border-gray-200 bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-black text-lg">
                      {getProductName(deal.product_id)}
                    </CardTitle>
                    <Badge variant={deal.is_active ? "default" : "secondary"}>
                      {deal.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-orange-600" />
                    <span className="text-lg font-bold text-orange-600">
                      -{deal.discount_percentage}%
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(deal.start_date)} - {formatDate(deal.end_date)}</span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(deal)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(deal.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {deals.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h3>
              <p className="text-gray-600">Create your first deal of the day to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 