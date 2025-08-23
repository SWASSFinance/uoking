"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  DollarSign
} from "lucide-react"

interface Gift {
  id: string
  name: string
  description: string
  price_threshold: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function GiftsAdminPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_threshold: 0,
    is_active: true,
    sort_order: 0
  })

  useEffect(() => {
    fetchGifts()
  }, [])

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/admin/gifts')
      if (response.ok) {
        const data = await response.json()
        setGifts(data || [])
      }
    } catch (error) {
      console.error('Error fetching gifts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingGift ? `/api/admin/gifts/${editingGift.id}` : '/api/admin/gifts'
      const method = editingGift ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        alert(editingGift ? 'Gift updated successfully!' : 'Gift created successfully!')
        fetchGifts()
        resetForm()
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving gift:', error)
      alert('Error saving gift. Please try again.')
    }
  }

  const handleDelete = async (giftId: string) => {
    if (confirm('Are you sure you want to delete this gift? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/gifts/${giftId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          alert('Gift deleted successfully!')
          fetchGifts()
        } else {
          const errorData = await response.json()
          alert(`Error: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Error deleting gift:', error)
        alert('Error deleting gift. Please try again.')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price_threshold: 0,
      is_active: true,
      sort_order: 0
    })
    setEditingGift(null)
    setShowForm(false)
  }

  const editGift = (gift: Gift) => {
    setFormData({
      name: gift.name,
      description: gift.description,
      price_threshold: gift.price_threshold,
      is_active: gift.is_active,
      sort_order: gift.sort_order
    })
    setEditingGift(gift)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <AdminHeader />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading gifts...</p>
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
              <h1 className="text-4xl font-bold text-black mb-2">Gift Management</h1>
              <p className="text-gray-700">Manage gifts that customers can choose based on their cart total</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Gift
            </Button>
          </div>

          {/* Gifts List */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-black flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Gifts ({gifts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gifts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">No gifts found</h3>
                  <p className="text-gray-700 mb-6">Create your first gift to offer customers</p>
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Gift
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {gifts.map((gift) => (
                    <div key={gift.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Gift className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-black">{gift.name}</div>
                          <div className="text-sm text-gray-600">{gift.description}</div>
                          <div className="text-xs text-gray-500">
                            Threshold: ${gift.price_threshold.toFixed(2)} | Order: {gift.sort_order}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={`${
                            gift.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {gift.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editGift(gift)}
                          className="border-gray-300 text-black hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(gift.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Gift Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">
                  {editingGift ? 'Edit Gift' : 'Add New Gift'}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm} className="text-black hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-black font-semibold">Gift Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Premium Token, VIP Gift"
                    className="border-gray-300 bg-white text-black"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-black font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe what this gift includes..."
                    rows={3}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price_threshold" className="text-black font-semibold">Price Threshold *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="price_threshold"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={formData.price_threshold}
                        onChange={(e) => setFormData({...formData, price_threshold: parseFloat(e.target.value) || 0})}
                        placeholder="25.00"
                        className="border-gray-300 bg-white text-black pl-10"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Minimum cart total required to qualify for this gift</p>
                  </div>

                  <div>
                    <Label htmlFor="sort_order" className="text-black font-semibold">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      min="0"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      className="border-gray-300 bg-white text-black"
                    />
                    <p className="text-sm text-gray-600 mt-1">Lower numbers appear first</p>
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
                  <p className="text-sm text-gray-600 mt-1">Inactive gifts won't be shown to customers</p>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={resetForm} className="border-gray-300 text-black hover:bg-gray-100">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    {editingGift ? 'Update Gift' : 'Create Gift'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
