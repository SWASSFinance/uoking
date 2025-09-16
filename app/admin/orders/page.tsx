"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Eye,
  DollarSign,
  User,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Save,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  MessageSquare,
  Star,
  Gift
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"


interface OrderItem {
  id: string
  product_id?: string
  product_name: string
  product_slug?: string
  product_image?: string
  product_admin_notes?: string
  quantity: number
  unit_price: string
  total_price: string
  category?: string
}

interface Order {
  id: string
  order_number: string
  user_id: string
  user_email: string
  username: string
  first_name?: string
  last_name?: string
  status: string
  payment_status: string
  delivery_status: string
  subtotal: string
  total_amount: string
  discount_amount?: string
  cashback_used?: string
  currency: string
  payment_method: string
  delivery_shard: string
  delivery_character: string
  customer_notes: string
  admin_notes: string
  coupon_code?: string
  gift_id?: string
  gift_name?: string
  created_at: string
  updated_at: string
  item_count: string
  items?: OrderItem[]
}

export default function OrdersAdminPage() {
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("processing")
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("completed")
  const [filterGift, setFilterGift] = useState("all")
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [loadingOrders, setLoadingOrders] = useState<Set<string>>(new Set())
  const [orderDetails, setOrderDetails] = useState<Record<string, Order>>({})
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    status: "",
    payment_status: "",
    admin_notes: ""
  })
  const [editingProductNotes, setEditingProductNotes] = useState<string | null>(null)
  const [productNotesForm, setProductNotesForm] = useState({
    admin_notes: ""
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleOrderExpansion = async (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
      setExpandedOrders(newExpanded)
    } else {
      newExpanded.add(orderId)
      setExpandedOrders(newExpanded)
      
      // Load order details if not already loaded
      if (!orderDetails[orderId]) {
        await loadOrderDetails(orderId)
      }
    }
  }

  const loadOrderDetails = async (orderId: string) => {
    const newLoading = new Set(loadingOrders)
    newLoading.add(orderId)
    setLoadingOrders(newLoading)
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderDetails(prev => ({
          ...prev,
          [orderId]: data.order
        }))
      }
    } catch (error) {
      console.error('Error loading order details:', error)
    } finally {
      const newLoading = new Set(loadingOrders)
      newLoading.delete(orderId)
      setLoadingOrders(newLoading)
    }
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order.id)
    setEditForm({
      status: order.status,
      payment_status: order.payment_status,
      admin_notes: order.admin_notes || ""
    })
  }

  const handleSaveOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const data = await response.json()
        // Update the order in the list
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, ...data.order } : order
        ))
        // Update order details if loaded
        if (orderDetails[orderId]) {
          setOrderDetails(prev => ({
            ...prev,
            [orderId]: { ...prev[orderId], ...data.order }
          }))
        }
        setEditingOrder(null)
        setEditForm({ status: "", payment_status: "", admin_notes: "" })
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone and will handle refunds automatically.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove order from local state
        setOrders(prev => prev.filter(order => order.id !== orderId))
        setOrderDetails(prev => {
          const newDetails = { ...prev }
          delete newDetails[orderId]
          return newDetails
        })
        setExpandedOrders(prev => {
          const newExpanded = new Set(prev)
          newExpanded.delete(orderId)
          return newExpanded
        })
      }
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const handleApprovePayment = async (orderId: string) => {
    if (!confirm('Are you sure you want to approve this payment? This will mark the order as paid and begin processing.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: 'completed',
          status: 'processing'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Update the order in the list
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, ...data.order } : order
        ))
        // Update order details if loaded
        if (orderDetails[orderId]) {
          setOrderDetails(prev => ({
            ...prev,
            [orderId]: { ...prev[orderId], ...data.order }
          }))
        }
      }
    } catch (error) {
      console.error('Error approving payment:', error)
    }
  }

  const handleEditProductNotes = (productId: string, currentNotes: string = "") => {
    setEditingProductNotes(productId)
    setProductNotesForm({
      admin_notes: currentNotes
    })
  }

  const handleSaveProductNotes = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/admin-notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productNotesForm),
      })

      if (response.ok) {
        // Update the order details to reflect the new admin notes
        setOrderDetails(prev => {
          const updatedDetails = { ...prev }
          Object.keys(updatedDetails).forEach(orderId => {
            if (updatedDetails[orderId].items) {
              updatedDetails[orderId].items = updatedDetails[orderId].items.map(item => {
                if (item.product_id === productId) {
                  return { ...item, product_admin_notes: productNotesForm.admin_notes }
                }
                return item
              })
            }
          })
          return updatedDetails
        })
        
        setEditingProductNotes(null)
        setProductNotesForm({ admin_notes: "" })
      }
    } catch (error) {
      console.error('Error updating product notes:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'completed':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Completed</Badge>
      case 'processing':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Processing</Badge>
      case 'pending':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>
      case 'cancelled':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</Badge>
      case 'refunded':
        return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>Refunded</Badge>
      case 'failed':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Failed</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'completed':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Paid</Badge>
      case 'pending':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>
      case 'failed':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Failed</Badge>
      case 'refunded':
        return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>Refunded</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</Badge>
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    const matchesPaymentStatus = filterPaymentStatus === "all" || order.payment_status === filterPaymentStatus
    const matchesGift = filterGift === "all" || 
      (filterGift === "with_gift" && orderDetails[order.id]?.gift_name) ||
      (filterGift === "no_gift" && !orderDetails[order.id]?.gift_name)
    
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesGift
  })

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Orders Management</h1>
              <p className="text-gray-700">Manage customer orders, payment statuses, and delivery tracking</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6 border border-gray-200 bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-black font-semibold block mb-2">Search Orders</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by order #, email, username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 bg-white text-black"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-black font-semibold block mb-2">Order Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-black">All Status</SelectItem>
                      <SelectItem value="pending" className="text-black">Pending</SelectItem>
                      <SelectItem value="processing" className="text-black">Processing</SelectItem>
                      <SelectItem value="completed" className="text-black">Completed</SelectItem>
                      <SelectItem value="cancelled" className="text-black">Cancelled</SelectItem>
                      <SelectItem value="refunded" className="text-black">Refunded</SelectItem>
                      <SelectItem value="failed" className="text-black">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-black font-semibold block mb-2">Payment Status</label>
                  <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-black">All Payments</SelectItem>
                      <SelectItem value="pending" className="text-black">Pending</SelectItem>
                      <SelectItem value="completed" className="text-black">Completed</SelectItem>
                      <SelectItem value="failed" className="text-black">Failed</SelectItem>
                      <SelectItem value="refunded" className="text-black">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-black font-semibold block mb-2">Gift Status</label>
                  <Select value={filterGift} onValueChange={setFilterGift}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-black">All Orders</SelectItem>
                      <SelectItem value="with_gift" className="text-black">With Gift</SelectItem>
                      <SelectItem value="no_gift" className="text-black">No Gift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end sm:col-span-2 lg:col-span-1">
                  <Button variant="outline" className="w-full border-gray-300 text-black">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border border-gray-200 bg-white">
                  {/* Order Header */}
                  <div 
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" 
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-black text-lg">Order #{order.order_number}</h4>
                            <p className="text-sm text-gray-600">
                              {order.item_count} items • {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 text-lg">${parseFloat(order.total_amount).toFixed(2)}</p>
                          {loadingOrders.has(order.id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mt-1"></div>
                          ) : (
                            <div className="text-gray-400 mt-1">
                              {expandedOrders.has(order.id) ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                        <div>
                          {orderDetails[order.id]?.gift_name ? (
                            <Badge className="bg-amber-100 text-amber-800 text-xs">
                              <Gift className="h-3 w-3 mr-1" />
                              Gift
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 text-xs">
                              <Gift className="h-3 w-3 mr-1" />
                              No Gift
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-black">Order #{order.order_number}</h4>
                            {orderDetails[order.id]?.gift_name ? (
                              <Badge className="bg-amber-100 text-amber-800 text-xs">
                                <Gift className="h-3 w-3 mr-1" />
                                Gift
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-600 text-xs">
                                <Gift className="h-3 w-3 mr-1" />
                                No Gift
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.item_count} items • {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${parseFloat(order.total_amount).toFixed(2)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(order.status)}
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {loadingOrders.has(order.id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          ) : (
                            <div className="text-gray-400">
                              {expandedOrders.has(order.id) ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details Dropdown */}
                  {expandedOrders.has(order.id) && orderDetails[order.id] && (
                    <div className="border-t border-gray-200 bg-gray-50 p-3 md:p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {/* Left Column */}
                        <div className="space-y-4">
                          {/* Delivery & Customer Info Combined */}
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Delivery Information */}
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <h5 className="font-semibold text-blue-900 mb-2 flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Delivery Info
                                </h5>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="text-blue-700 font-medium">Shard:</span>
                                    <p className="font-bold text-blue-900">{orderDetails[order.id].delivery_shard}</p>
                                  </div>
                                  <div>
                                    <span className="text-blue-700 font-medium">Character:</span>
                                    <p className="font-bold text-blue-900">{orderDetails[order.id].delivery_character || 'Not specified'}</p>
                                  </div>
                                                                     <div>
                                     <span className="text-blue-700 font-medium">Payment:</span>
                                     <div className="flex items-center space-x-2">
                                       <p className="font-medium text-blue-900">
                                         {orderDetails[order.id].payment_method === 'manual_payment' 
                                           ? 'Manual Payment' 
                                           : orderDetails[order.id].payment_method}
                                       </p>
                                       {orderDetails[order.id].payment_method === 'manual_payment' && 
                                        orderDetails[order.id].payment_status === 'pending' && (
                                         <Badge className="bg-orange-100 text-orange-800 text-xs">
                                           <MessageSquare className="h-3 w-3 mr-1" />
                                           Awaiting
                                         </Badge>
                                       )}
                                     </div>
                                   </div>
                                </div>
                              </div>

                              {/* Customer Information */}
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                                  <User className="h-4 w-4 mr-2" />
                                  Customer Info
                                </h5>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="text-gray-600">Name:</span>
                                    <p className="font-medium text-gray-900">{orderDetails[order.id].first_name} {orderDetails[order.id].last_name}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Email:</span>
                                    <p className="font-medium text-gray-900">{orderDetails[order.id].user_email}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Username:</span>
                                    <p className="font-medium text-gray-900">{orderDetails[order.id].username}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <h5 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                              <Package className="h-4 w-4 mr-2" />
                              Order Items
                            </h5>
                            <div className="space-y-2">
                                                             {orderDetails[order.id].items?.map((item) => (
                                 <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                                   <div className="flex items-center space-x-3 mb-2">
                                     <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                       {item.product_image ? (
                                         <Image
                                           src={item.product_image}
                                           alt={item.product_name}
                                           width={32}
                                           height={32}
                                           className="object-cover w-full h-full"
                                         />
                                       ) : (
                                         <div className="w-full h-full flex items-center justify-center">
                                           <Package className="h-4 w-4 text-gray-400" />
                                         </div>
                                       )}
                                     </div>
                                     <div className="flex-1">
                                       <div className="flex items-center space-x-2">
                                         <Link 
                                           href={`/product/${item.product_slug || item.product_name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}`}
                                           target="_blank"
                                           className="font-medium text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                                         >
                                           {item.product_name}
                                         </Link>
                                         <Eye className="h-3 w-3 text-gray-400" />
                                       </div>
                                       <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                     </div>
                                     <div className="text-right">
                                       <p className="font-semibold text-gray-900 text-sm">${parseFloat(item.total_price).toFixed(2)}</p>
                                       <p className="text-xs text-gray-600">${parseFloat(item.unit_price).toFixed(2)} each</p>
                                     </div>
                                   </div>
                                   
                                   {/* Product Notes Section */}
                                   {item.product_id && (
                                     <div className="border-t border-gray-200 pt-2">
                                       {editingProductNotes === item.product_id ? (
                                         <div className="space-y-2">
                                           <Textarea
                                             value={productNotesForm.admin_notes}
                                             onChange={(e) => setProductNotesForm({...productNotesForm, admin_notes: e.target.value})}
                                             placeholder="Add admin notes for this product..."
                                             className="border-gray-300 bg-white text-black text-xs"
                                             rows={2}
                                           />
                                           <div className="flex space-x-2">
                                             <Button 
                                               onClick={() => handleSaveProductNotes(item.product_id!)}
                                               className="bg-blue-600 hover:bg-blue-700 h-6 text-xs"
                                               size="sm"
                                             >
                                               <Save className="h-3 w-3 mr-1" />
                                               Save Notes
                                             </Button>
                                             <Button 
                                               onClick={() => setEditingProductNotes(null)}
                                               variant="outline"
                                               className="border-gray-300 text-black h-6 text-xs"
                                               size="sm"
                                             >
                                               <X className="h-3 w-3 mr-1" />
                                               Cancel
                                             </Button>
                                           </div>
                                         </div>
                                       ) : (
                                         <div className="flex items-center justify-between">
                                           <div className="flex-1">
                                             <p className="text-xs text-gray-600">Admin Notes:</p>
                                             <p className="text-xs text-gray-800 font-medium">
                                               {item.product_admin_notes || 'No notes added'}
                                             </p>
                                           </div>
                                           <Button 
                                             onClick={() => handleEditProductNotes(item.product_id!, item.product_admin_notes || '')}
                                             className="bg-gray-600 hover:bg-gray-700 h-6 text-xs"
                                             size="sm"
                                           >
                                             <Edit className="h-3 w-3 mr-1" />
                                             {item.product_admin_notes ? 'Edit Product Notes' : 'Add Product Notes'}
                                           </Button>
                                         </div>
                                       )}
                                     </div>
                                   )}
                                 </div>
                               ))}
                               
                               {/* Gift Item */}
                               {orderDetails[order.id].gift_name && (
                                 <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                   <div className="flex items-center space-x-3 mb-2">
                                     <div className="w-8 h-8 bg-amber-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                       <Gift className="h-4 w-4 text-amber-600" />
                                     </div>
                                     <div className="flex-1">
                                       <div className="flex items-center space-x-2">
                                         <span className="font-medium text-amber-800 text-sm">
                                           {orderDetails[order.id].gift_name}
                                         </span>
                                         <Badge className="bg-amber-200 text-amber-800 text-xs">FREE GIFT</Badge>
                                       </div>
                                       <p className="text-xs text-amber-600">Customer chose this gift with their order</p>
                                     </div>
                                     <div className="text-right">
                                       <p className="font-semibold text-green-600 text-sm">FREE</p>
                                       <p className="text-xs text-amber-600">Gift</p>
                                     </div>
                                   </div>
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          {/* Order Summary & Details Combined */}
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Order Summary */}
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Summary
                                </h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">${parseFloat(orderDetails[order.id].subtotal || '0').toFixed(2)}</span>
                                  </div>
                                  {parseFloat(orderDetails[order.id].discount_amount || '0') > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Discount</span>
                                      <span className="font-medium text-green-600">-${parseFloat(orderDetails[order.id].discount_amount || '0').toFixed(2)}</span>
                                    </div>
                                  )}
                                  {parseFloat(orderDetails[order.id].cashback_used || '0') > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Cashback</span>
                                      <span className="font-medium text-green-600">-${parseFloat(orderDetails[order.id].cashback_used || '0').toFixed(2)}</span>
                                    </div>
                                  )}
                                  <div className="border-t pt-1 flex justify-between font-semibold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">${parseFloat(orderDetails[order.id].total_amount || '0').toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Details */}
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Details
                                </h5>
                                <div className="space-y-1 text-sm">
                                  {orderDetails[order.id].coupon_code && (
                                    <div>
                                      <span className="text-gray-600">Coupon:</span>
                                      <p className="font-medium text-gray-900">{orderDetails[order.id].coupon_code}</p>
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-gray-600">Date:</span>
                                    <p className="font-medium text-gray-900">{new Date(orderDetails[order.id].created_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Admin Actions & Notes */}
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <h5 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Admin Actions & Notes
                            </h5>
                            
                            {editingOrder === order.id ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-gray-700 font-medium block mb-1 text-sm">Order Status</label>
                                    <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                                      <SelectTrigger className="border-gray-300 bg-white text-black h-9">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-white">
                                        <SelectItem value="pending" className="text-black">Pending</SelectItem>
                                        <SelectItem value="processing" className="text-black">Processing</SelectItem>
                                        <SelectItem value="completed" className="text-black">Completed</SelectItem>
                                        <SelectItem value="cancelled" className="text-black">Cancelled</SelectItem>
                                        <SelectItem value="refunded" className="text-black">Refunded</SelectItem>
                                        <SelectItem value="failed" className="text-black">Failed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-gray-700 font-medium block mb-1 text-sm">Payment Status</label>
                                    <Select value={editForm.payment_status} onValueChange={(value) => setEditForm({...editForm, payment_status: value})}>
                                      <SelectTrigger className="border-gray-300 bg-white text-black h-9">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-white">
                                        <SelectItem value="pending" className="text-black">Pending</SelectItem>
                                        <SelectItem value="completed" className="text-black">Completed</SelectItem>
                                        <SelectItem value="failed" className="text-black">Failed</SelectItem>
                                        <SelectItem value="refunded" className="text-black">Refunded</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-gray-700 font-medium block mb-1 text-sm">Admin Notes</label>
                                  <Textarea
                                    value={editForm.admin_notes}
                                    onChange={(e) => setEditForm({...editForm, admin_notes: e.target.value})}
                                    placeholder="Add admin notes..."
                                    className="border-gray-300 bg-white text-black"
                                    rows={2}
                                  />
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                  <Button 
                                    onClick={() => handleSaveOrder(order.id)}
                                    className="bg-blue-600 hover:bg-blue-700 h-10 sm:h-8 w-full sm:w-auto"
                                    size="sm"
                                  >
                                    <Save className="h-4 w-4 mr-1" />
                                    Save Changes
                                  </Button>
                                  <Button 
                                    onClick={() => setEditingOrder(null)}
                                    variant="outline"
                                    className="border-gray-300 text-black h-10 sm:h-8 w-full sm:w-auto"
                                    size="sm"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <span className="text-gray-600 text-sm">Order Status:</span>
                                    <div className="flex items-center space-x-2 mt-1">
                                      {getStatusIcon(orderDetails[order.id].status)}
                                      {getStatusBadge(orderDetails[order.id].status)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 text-sm">Payment Status:</span>
                                    <div className="mt-1">
                                      {getPaymentStatusBadge(orderDetails[order.id].payment_status)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 text-sm">Admin Notes:</span>
                                    <p className="font-medium mt-1 text-sm text-gray-900">{orderDetails[order.id].admin_notes || 'No notes'}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                  {/* Show Approve Payment button for pending manual payments */}
                                  {orderDetails[order.id].payment_status === 'pending' && 
                                   orderDetails[order.id].payment_method === 'manual_payment' && (
                                    <Button 
                                      onClick={() => handleApprovePayment(order.id)}
                                      className="bg-green-600 hover:bg-green-700 h-10 sm:h-8 w-full sm:w-auto"
                                      size="sm"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve Payment
                                    </Button>
                                  )}
                                  
                                  <Button 
                                    onClick={() => handleEditOrder(orderDetails[order.id])}
                                    className="bg-blue-600 hover:bg-blue-700 h-10 sm:h-8 w-full sm:w-auto"
                                    size="sm"
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit Order
                                  </Button>
                                  <Button 
                                    onClick={() => handleDeleteOrder(order.id)}
                                    variant="destructive"
                                    size="sm"
                                    className="h-10 sm:h-8 w-full sm:w-auto"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete Order
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">No orders found</h3>
              <p className="text-gray-700 mb-6">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 