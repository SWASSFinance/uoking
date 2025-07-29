"use client"

import { useState } from "react"
import { Search, ShoppingCart, Menu, User, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Classes", href: "/classes", hasDropdown: true },
    { name: "Properties", href: "/properties", hasDropdown: true },
    { name: "Slots", href: "/slots", hasDropdown: true },
    { name: "Store", href: "/store" },
    { name: "Gold", href: "/gold" },
    { name: "Suits", href: "/suits" },
    { name: "Scrolls", href: "/scrolls" },
    { name: "Tools", href: "/tools" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Crown className="h-8 w-8 text-amber-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">UO</span>
              <span className="text-sm font-semibold text-amber-600 -mt-1">KING</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigationItems.slice(0, 6).map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.hasDropdown ? (
                    <NavigationMenuTrigger className="text-sm font-medium">{item.name}</NavigationMenuTrigger>
                  ) : (
                    <NavigationMenuLink
                      href={item.href}
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      {item.name}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input type="search" placeholder="Search items..." className="pl-10 pr-4 py-2 w-full" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Register
              </Button>
            </div>

            {/* Cart */}
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                0
              </Badge>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <Crown className="h-6 w-6 text-amber-600" />
                    <span className="text-lg font-bold">UO KING</span>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="justify-start bg-transparent">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                    <Button className="justify-start bg-green-600 hover:bg-green-700">Register</Button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input type="search" placeholder="Search items..." className="pl-10" />
                  </div>

                  <nav className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
