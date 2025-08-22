"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  Package, 
  Settings, 
  ShoppingCart,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Calendar
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  activeProducts: number
  todayOrders: number
  activeCategories: number
}

interface SalesData {
  date?: string
  week_start?: string
  month_start?: string
  order_count: number
  total_sales: number
  completed_sales: number
}

interface SalesBreakdown {
  daily: SalesData[]
  weekly: SalesData[]
  monthly: SalesData[]
  today: SalesData
  thisWeek: SalesData
  thisMonth: SalesData
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeProducts: 0,
    todayOrders: 0,
    activeCategories: 0
  })
  const [salesData, setSalesData] = useState<SalesBreakdown>({
    daily: [],
    weekly: [],
    monthly: [],
    today: { order_count: 0, total_sales: 0, completed_sales: 0 },
    thisWeek: { order_count: 0, total_sales: 0, completed_sales: 0 },
    thisMonth: { order_count: 0, total_sales: 0, completed_sales: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  useEffect(() => {
    fetchDashboardStats()
    fetchSalesBreakdown()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSalesBreakdown = async () => {
    try {
      const response = await fetch('/api/admin/sales-breakdown')
      if (response.ok) {
        const data = await response.json()
        setSalesData(data)
      }
    } catch (error) {
      console.error('Error fetching sales breakdown:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatWeek = (dateString: string) => {
    const date = new Date(dateString)
    const endDate = new Date(date)
    endDate.setDate(date.getDate() + 6)
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white text-black admin-page">
      <AdminHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Complete control over your Ultima Online marketplace. Manage products, users, orders, and everything else from one central location.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black font-semibold">Total Users</p>
                    <p className="text-3xl font-bold text-black">
                      {loading ? '...' : stats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black font-semibold">Active Products</p>
                    <p className="text-3xl font-bold text-black">
                      {loading ? '...' : stats.activeProducts.toLocaleString()}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black font-semibold">Today's Orders</p>
                    <p className="text-3xl font-bold text-black">
                      {loading ? '...' : stats.todayOrders.toLocaleString()}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black font-semibold">Active Categories</p>
                    <p className="text-3xl font-bold text-black">
                      {loading ? '...' : stats.activeCategories.toLocaleString()}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Breakdown */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Sales Breakdown
            </h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-black font-semibold">Today's Sales</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(salesData.today.completed_sales)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {salesData.today.order_count} orders
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-black font-semibold">This Week</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(salesData.thisWeek.completed_sales)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {salesData.thisWeek.order_count} orders
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-black font-semibold">This Month</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(salesData.thisMonth.completed_sales)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {salesData.thisMonth.order_count} orders
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={activeTab === 'daily' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('daily')}
                  className={activeTab === 'daily' ? 'bg-white text-black shadow-sm' : 'text-gray-600'}
                >
                  Daily
                </Button>
                <Button
                  variant={activeTab === 'weekly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('weekly')}
                  className={activeTab === 'weekly' ? 'bg-white text-black shadow-sm' : 'text-gray-600'}
                >
                  Weekly
                </Button>
                <Button
                  variant={activeTab === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('monthly')}
                  className={activeTab === 'monthly' ? 'bg-white text-black shadow-sm' : 'text-gray-600'}
                >
                  Monthly
                </Button>
              </div>
            </div>

            {/* Sales Table */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black">
                  {activeTab === 'daily' && 'Daily Sales (Last 7 Days)'}
                  {activeTab === 'weekly' && 'Weekly Sales (Last 8 Weeks)'}
                  {activeTab === 'monthly' && 'Monthly Sales (Last 12 Months)'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black font-semibold">
                        {activeTab === 'daily' && 'Date'}
                        {activeTab === 'weekly' && 'Week'}
                        {activeTab === 'monthly' && 'Month'}
                      </TableHead>
                      <TableHead className="text-black font-semibold">Orders</TableHead>
                      <TableHead className="text-black font-semibold">Total Sales</TableHead>
                      <TableHead className="text-black font-semibold">Completed Sales</TableHead>
                      <TableHead className="text-black font-semibold">Completion Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(activeTab === 'daily' ? salesData.daily : 
                      activeTab === 'weekly' ? salesData.weekly : 
                      salesData.monthly).map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-black">
                          {activeTab === 'daily' && item.date && formatDate(item.date)}
                          {activeTab === 'weekly' && item.week_start && formatWeek(item.week_start)}
                          {activeTab === 'monthly' && item.month_start && formatMonth(item.month_start)}
                        </TableCell>
                        <TableCell className="text-black">{item.order_count}</TableCell>
                        <TableCell className="text-black font-medium">
                          {formatCurrency(item.total_sales)}
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {formatCurrency(item.completed_sales)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={
                              item.total_sales > 0 && (item.completed_sales / item.total_sales) >= 0.8 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {item.total_sales > 0 
                              ? `${Math.round((item.completed_sales / item.total_sales) * 100)}%`
                              : '0%'
                            }
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-10 border border-gray-200">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button 
                size="lg" 
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 text-lg font-semibold py-4 rounded-lg"
                asChild
              >
                <Link href="/admin/products">
                  <Package className="h-5 w-5 mr-3" />
                  Manage Products
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50 text-lg font-semibold py-4 rounded-lg"
                asChild
              >
                <Link href="/admin/orders">
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  View Orders
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-lg font-semibold py-4 rounded-lg"
                asChild
              >
                <Link href="/admin/settings">
                  <Settings className="h-5 w-5 mr-3" />
                  Site Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 