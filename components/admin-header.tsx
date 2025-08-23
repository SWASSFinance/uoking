"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Package, 
  Users, 
  ShoppingCart,
  LogOut,
  FolderOpen,
  Tag,
  Video,
  Globe,
  MessageCircle,
  Map,
  GraduationCap,
  MapPin,
  ChevronDown,
  Newspaper,
  Store,
  AlertTriangle,
  Gift
} from "lucide-react"

const adminNavItems = [
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart
  }
]

const storeSubItems = [
  {
    name: "Products",
    href: "/admin/products",
    icon: Package
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderOpen
  },
  {
    name: "Coupons",
    href: "/admin/coupons",
    icon: Tag
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users
  },
  {
    name: "News",
    href: "/admin/news",
    icon: Newspaper
  }
]

const settingsSubItems = [
  {
    name: "General Settings",
    href: "/admin/settings",
    icon: Settings
  },
  {
    name: "Gifts",
    href: "/admin/gifts",
    icon: Gift
  },
  {
    name: "Shards",
    href: "/admin/shard",
    icon: Globe
  },
  {
    name: "Classes",
    href: "/admin/classes",
    icon: GraduationCap
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: MessageCircle
  },
  {
    name: "Maps",
    href: "/admin/maps",
    icon: Map
  },
  {
    name: "Spawn Locations",
    href: "/admin/spawn-locations",
    icon: MapPin
  },
  {
    name: "Test Email",
    href: "/admin/test-email",
    icon: MessageCircle
  }
]

export function AdminHeader() {
  const pathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isStoreOpen, setIsStoreOpen] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Check maintenance mode status
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          setMaintenanceMode(data.maintenance_mode || false)
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error)
      }
    }

    checkMaintenanceMode()
    const interval = setInterval(checkMaintenanceMode, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const isSettingsActive = pathname === "/admin/settings" || 
                          pathname === "/admin/gifts" ||
                          pathname === "/admin/shard" || 
                          pathname === "/admin/classes" ||
                          pathname === "/admin/reviews" ||
                          pathname === "/admin/maps" ||
                          pathname === "/admin/spawn-locations" ||
                          pathname === "/admin/test-email"

  const isStoreActive = pathname === "/admin/products" || 
                       pathname === "/admin/categories" || 
                       pathname === "/admin/coupons" ||
                       pathname === "/admin/users" ||
                       pathname === "/admin/news"

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-black">Admin Panel</span>
            </Link>
            
            {/* Maintenance Mode Indicator */}
            {maintenanceMode && (
              <div className="flex items-center space-x-2">
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Maintenance Mode Active</span>
                </Badge>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {adminNavItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}

            {/* Store Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsStoreOpen(true)}
              onMouseLeave={() => setIsStoreOpen(false)}
            >
              <Button
                variant={isStoreActive ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 ${
                  isStoreActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <Store className="h-4 w-4" />
                <span>Store</span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {/* Dropdown Menu */}
              {isStoreOpen && (
                <>
                  {/* Invisible bridge to prevent gap */}
                  <div className="absolute top-full left-0 w-full h-1 bg-transparent"></div>
                  <div className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {storeSubItems.map((item) => {
                      const IconComponent = item.icon
                      const isActive = pathname === item.href
                      
                      return (
                        <Link key={item.name} href={item.href}>
                          <div className={`
                            flex items-center space-x-2 px-4 py-2 text-sm cursor-pointer
                            ${isActive 
                              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                              : "text-gray-700 hover:bg-gray-50"
                            }
                          `}>
                            <IconComponent className="h-4 w-4" />
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Settings Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsSettingsOpen(true)}
              onMouseLeave={() => setIsSettingsOpen(false)}
            >
              <Button
                variant={isSettingsActive ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 ${
                  isSettingsActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {/* Dropdown Menu */}
              {isSettingsOpen && (
                <>
                  {/* Invisible bridge to prevent gap */}
                  <div className="absolute top-full left-0 w-full h-1 bg-transparent"></div>
                  <div className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {settingsSubItems.map((item) => {
                      const IconComponent = item.icon
                      const isActive = pathname === item.href
                      
                      return (
                        <Link key={item.name} href={item.href}>
                          <div className={`
                            flex items-center space-x-2 px-4 py-2 text-sm cursor-pointer
                            ${isActive 
                              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                              : "text-gray-700 hover:bg-gray-50"
                            }
                          `}>
                            <IconComponent className="h-4 w-4" />
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="text-black border-gray-300">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="lg:hidden py-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            {adminNavItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex flex-col items-center space-y-1 p-2 h-auto ${
                      isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
            
            {/* Mobile Store - show all sub-items */}
            {storeSubItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex flex-col items-center space-y-1 p-2 h-auto ${
                      isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
            
            {/* Mobile Settings - show all sub-items */}
            {settingsSubItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex flex-col items-center space-y-1 p-2 h-auto ${
                      isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
} 