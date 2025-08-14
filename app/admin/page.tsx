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
  ExternalLink
} from "lucide-react"
import Link from "next/link"

const adminModules = [
  {
    name: "Users",
    description: "Manage user accounts, profiles, and permissions",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    href: "/admin/users",
    count: "Active Users"
  },
  {
    name: "Products",
    description: "Add, edit, and manage all products and items",
    icon: Package,
    color: "bg-green-100 text-green-600",
    href: "/admin/products",
    count: "Total Products"
  },
  {
    name: "Orders",
    description: "View and manage customer orders and transactions",
    icon: ShoppingCart,
    color: "bg-orange-100 text-orange-600",
    href: "/admin/orders",
    count: "Recent Orders"
  }
]

interface DashboardStats {
  totalUsers: number
  activeProducts: number
  todayOrders: number
  activeCategories: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeProducts: 0,
    todayOrders: 0,
    activeCategories: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
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

  return (
    <div className="min-h-screen bg-white text-black admin-page">
      <AdminHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Settings className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-black mb-6">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
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

          {/* Admin Modules Table */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Management Modules
            </h2>
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black">Available Admin Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black font-semibold">Module</TableHead>
                      <TableHead className="text-black font-semibold">Description</TableHead>
                      <TableHead className="text-black font-semibold">Status</TableHead>
                      <TableHead className="text-black font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminModules.map((module) => {
                      const IconComponent = module.icon
                      return (
                        <TableRow key={module.name} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${module.color}`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-semibold text-black">{module.name}</div>
                                <div className="text-sm text-gray-700">{module.count}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-black">{module.description}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Available
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-black hover:bg-gray-50"
                              asChild
                            >
                              <Link href={module.href}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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