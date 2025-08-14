"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  AlertCircle
} from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  order_number: string
  user_id: string
  user_email: string
  username: string
  status: string
  payment_status: string
  delivery_status: string
  subtotal: string
  total_amount: string
  currency: string
  payment_method: string
  delivery_shard: string
  delivery_character: string
  customer_notes: string
  admin_notes: string
  created_at: string
  updated_at: string
  item_count: string
}

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all")

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
        return <Badge className={`baseClasses} bg-purple-100 text-purple-800`}>Refunded</Badge>
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
    
    return matchesSearch && matchesStatus && matchesPaymentStatus
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
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                
                <div className="flex items-end">
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
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black">Orders ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black font-semibold">Order</TableHead>
                      <TableHead className="text-black font-semibold">Customer</TableHead>
                      <TableHead className="text-black font-semibold">Amount</TableHead>
                      <TableHead className="text-black font-semibold">Status</TableHead>
                      <TableHead className="text-black font-semibold">Payment</TableHead>
                      <TableHead className="text-black font-semibold">Date</TableHead>
                      <TableHead className="text-black font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-black">{order.order_number}</div>
                              <div className="text-sm text-gray-700">
                                {order.item_count} items
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-black">{order.username}</div>
                            <div className="text-sm text-gray-700">{order.user_email}</div>
                            {order.delivery_character && (
                              <div className="text-xs text-gray-600">
                                Character: {order.delivery_character}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              ${parseFloat(order.total_amount).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-700">
                              {order.currency}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            {getStatusBadge(order.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(order.payment_status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-black">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-700">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-black"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
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