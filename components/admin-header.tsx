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
  ChevronRight,
  Newspaper,
  Store,
  AlertTriangle,
  Gift,
  BookOpen,
  Menu,
  X,
  Crown,
  Mail
} from "lucide-react"

// Organized navigation structure
const navigationSections = [
  {
    title: "Core",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: Settings
      },
      {
        name: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart
      },
      {
        name: "Users",
        href: "/admin/users",
        icon: Users
      }
    ]
  },
  {
    title: "Store Management",
    items: [
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
        name: "Skills",
        href: "/admin/skills",
        icon: BookOpen
      },
      {
        name: "Gifts",
        href: "/admin/gifts",
        icon: Gift
      }
    ]
  },
  {
    title: "Content & Reviews",
    items: [
      {
        name: "News",
        href: "/admin/news",
        icon: Newspaper
      },
      {
        name: "Reviews",
        href: "/admin/reviews",
        icon: MessageCircle
      },
      {
        name: "Category Reviews",
        href: "/admin/category-reviews",
        icon: MessageCircle
      },
      {
        name: "Image Submissions",
        href: "/admin/image-submissions",
        icon: Video
      }
    ]
  },
  {
    title: "Game Management",
    items: [
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
        name: "Maps",
        href: "/admin/maps",
        icon: Map
      },
      {
        name: "Spawn Locations",
        href: "/admin/spawn-locations",
        icon: MapPin
      }
    ]
  },
  {
    title: "Premium",
    items: [
      {
        name: "Premium Settings",
        href: "/admin/premium-settings",
        icon: Crown
      }
    ]
  },
  {
    title: "System",
    items: [
      {
        name: "General Settings",
        href: "/admin/settings",
        icon: Settings
      },
      {
        name: "Test Email",
        href: "/admin/test-email",
        icon: MessageCircle
      },
      {
        name: "Mailchimp",
        href: "/admin/mailchimp",
        icon: Mail
      }
    ]
  }
]

export function AdminHeader() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Check maintenance mode status
  useEffect(() => {
    const CACHE_KEY = 'admin-maintenance-mode-cache'
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

    const checkMaintenanceMode = async () => {
      try {
        // Check localStorage cache first
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          try {
            const { data, timestamp } = JSON.parse(cachedData)
            if (Date.now() - timestamp < CACHE_DURATION) {
              setMaintenanceMode(data.maintenance_mode || false)
              return // Use cached data, don't poll
            }
          } catch (e) {
            // Invalid cache, fetch fresh data
          }
        }
        
        // Fetch fresh data
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          const mode = data.maintenance_mode || false
          setMaintenanceMode(mode)
          
          // Update cache
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: { maintenance_mode: mode },
            timestamp: Date.now()
          }))
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error)
      }
    }

    // Fetch once on mount only - no polling
    checkMaintenanceMode()
  }, [])

  // Helper functions
  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle)
    } else {
      newExpanded.add(sectionTitle)
    }
    setExpandedSections(newExpanded)
  }

  const isActivePath = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setExpandedSections(new Set())
  }

  return (
    <>
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
                    <span className="hidden sm:inline">Maintenance Mode Active</span>
                    <span className="sm:hidden">Maintenance</span>
                  </Badge>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationSections.map((section) => (
                <div key={section.title} className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-black hover:bg-gray-100"
                  >
                    <span>{section.title}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>

                  {/* Desktop Dropdown */}
                  <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                        {section.title}
                      </div>
                      {section.items.map((item) => {
                        const IconComponent = item.icon
                        const isActive = isActivePath(item.href)
                        
                        return (
                          <Link key={item.name} href={item.href}>
                            <div className={`
                              flex items-center space-x-3 px-3 py-2 text-sm cursor-pointer rounded-md
                              ${isActive 
                                ? "bg-blue-50 text-blue-600" 
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
                  </div>
                </div>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-black hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              {/* Logout Button */}
              <Button variant="outline" size="sm" className="text-black border-gray-300">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMobileMenu}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-black">Admin Navigation</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileMenu}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="overflow-y-auto h-full pb-20">
              {navigationSections.map((section) => (
                <div key={section.title} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{section.title}</span>
                    {expandedSections.has(section.title) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>

                  {expandedSections.has(section.title) && (
                    <div className="bg-gray-50">
                      {section.items.map((item) => {
                        const IconComponent = item.icon
                        const isActive = isActivePath(item.href)
                        
                        return (
                          <Link key={item.name} href={item.href} onClick={closeMobileMenu}>
                            <div className={`
                              flex items-center space-x-3 px-6 py-3 text-sm cursor-pointer
                              ${isActive 
                                ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                                : "text-gray-700 hover:bg-gray-100"
                              }
                            `}>
                              <IconComponent className="h-4 w-4" />
                              <span>{item.name}</span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 