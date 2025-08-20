"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
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
  MapPin
} from "lucide-react"

const adminNavItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Settings
  },
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
    name: "Classes",
    href: "/admin/classes",
    icon: GraduationCap
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: MessageCircle
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
    name: "Shards",
    href: "/admin/shard",
    icon: Globe
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
    name: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
]

export function AdminHeader() {
  const pathname = usePathname()

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
          </div>
        </div>
      </div>
    </header>
  )
} 