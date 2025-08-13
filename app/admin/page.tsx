"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  Package, 
  FolderOpen, 
  Settings, 
  Database, 
  ShoppingCart,
  FileText,
  Star,
  Home,
  Shield,
  Crown,
  Coins,
  ScrollText,
  MapPin,
  Palette,
  Wrench,
  Calendar,
  MessageSquare,
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
    name: "Categories",
    description: "Organize products with categories and subcategories",
    icon: FolderOpen,
    color: "bg-purple-100 text-purple-600",
    href: "/admin/categories",
    count: "Categories"
  },
  {
    name: "Classes",
    description: "Manage character classes and their attributes",
    icon: Crown,
    color: "bg-yellow-100 text-yellow-600",
    href: "/admin/classes",
    count: "Character Classes"
  },
  {
    name: "Orders",
    description: "View and manage customer orders and transactions",
    icon: ShoppingCart,
    color: "bg-orange-100 text-orange-600",
    href: "/admin/orders",
    count: "Recent Orders"
  },
  {
    name: "News",
    description: "Create and manage news articles and announcements",
    icon: FileText,
    color: "bg-red-100 text-red-600",
    href: "/admin/news",
    count: "Published Articles"
  },
  {
    name: "Reviews",
    description: "Manage product reviews and ratings",
    icon: Star,
    color: "bg-pink-100 text-pink-600",
    href: "/admin/reviews",
    count: "Product Reviews"
  },
  {
    name: "Houses",
    description: "Manage house listings and properties",
    icon: Home,
    color: "bg-indigo-100 text-indigo-600",
    href: "/admin/houses",
    count: "Available Houses"
  },
  {
    name: "Pets",
    description: "Manage pet listings and taming services",
    icon: Shield,
    color: "bg-teal-100 text-teal-600",
    href: "/admin/pets",
    count: "Pet Listings"
  },
  {
    name: "Gold",
    description: "Manage gold packages and pricing",
    icon: Coins,
    color: "bg-amber-100 text-amber-600",
    href: "/admin/gold",
    count: "Gold Packages"
  },
  {
    name: "Scrolls",
    description: "Manage power scrolls and alacrity scrolls",
    icon: ScrollText,
    color: "bg-emerald-100 text-emerald-600",
    href: "/admin/scrolls",
    count: "Scroll Types"
  },
  {
    name: "Maps",
    description: "Manage maps and location data",
    icon: MapPin,
    color: "bg-cyan-100 text-cyan-600",
    href: "/admin/maps",
    count: "Map Locations"
  },
  {
    name: "Decorations",
    description: "Manage house decorations and items",
    icon: Palette,
    color: "bg-rose-100 text-rose-600",
    href: "/admin/decorations",
    count: "Decoration Items"
  },
  {
    name: "Tools",
    description: "Manage tools and utilities",
    icon: Wrench,
    color: "bg-slate-100 text-slate-600",
    href: "/admin/tools",
    count: "Available Tools"
  },
  {
    name: "Events",
    description: "Manage events and schedules",
    icon: Calendar,
    color: "bg-violet-100 text-violet-600",
    href: "/admin/events",
    count: "Upcoming Events"
  },
  {
    name: "Support",
    description: "Manage customer support tickets",
    icon: MessageSquare,
    color: "bg-lime-100 text-lime-600",
    href: "/admin/support",
    count: "Open Tickets"
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
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Settings className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Complete control over your Ultima Online marketplace. Manage products, users, orders, and everything else from one central location.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : stats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Active Products</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : stats.activeProducts.toLocaleString()}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Today's Orders</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : stats.todayOrders.toLocaleString()}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Active Categories</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : stats.activeCategories.toLocaleString()}
                    </p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Modules Table */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Management Modules
            </h2>
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Available Admin Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-700">Module</TableHead>
                      <TableHead className="text-gray-700">Description</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
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
                                <div className="font-semibold text-gray-900">{module.name}</div>
                                <div className="text-sm text-gray-500">{module.count}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-600">{module.description}</span>
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
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
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
                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-lg font-semibold py-4 rounded-lg"
                asChild
              >
                <Link href="/admin/categories">
                  <FolderOpen className="h-5 w-5 mr-3" />
                  Manage Categories
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 text-lg font-semibold py-4 rounded-lg"
                asChild
              >
                <Link href="/admin/orders">
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  View Orders
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 