"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, Menu, User, Crown, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Load categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        console.log('Fetching categories...')
        const response = await fetch('/api/categories')
        if (response.ok) {
          const dbCategories = await response.json()
          console.log('Categories loaded:', dbCategories.length)
          setCategories(dbCategories)
        } else {
          console.error('Failed to fetch categories:', response.status)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
      }
    }
  }, [dropdownTimeout])

  // Helper function to convert category name to URL format
  const categoryToUrl = (categoryName: string) => {
    return categoryName.replace(/\s+/g, '_')
  }

  // Helper function to convert slot name to category URL
  const slotToCategoryUrl = (slotName: string) => {
    const slotToCategoryMap: { [key: string]: string } = {
      "Head": "Head",
      "Chest Armor": "Chest_Armor", 
      "Leg Armor": "Leg_Armor",
      "Glove Armor": "Glove_Armor",
      "Sleeve Armor": "Sleeve_Armor", 
      "Footwear": "Footwear",
      "Neck Armor": "Neck_Armor",
      "Jewelry": "Jewelry",
      "Talismans": "Talismans",
      "Robes": "Robes",
      "Belts Aprons": "Belts_Aprons",
      "Sashes": "Sashes",
      "Cloaks Quivers": "Cloaks_Quivers"
    }
    return slotToCategoryMap[slotName] || slotName.replace(/\s+/g, '_')
  }

  const handleMouseEnter = (dropdown: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setActiveDropdown(dropdown)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 300) // 300ms delay before closing
    setDropdownTimeout(timeout)
  }

  const classItems = [
    "Getting Started",
    "Mage",
    "Tamer", 
    "Melee",
    "Ranged",
    "Thief",
    "Crafter"
  ]

  const propItems = [
    "Damage Increase",
    "Defense Chance Increase", 
    "Enhance Potions",
    "Faster Cast Recovery",
    "Faster Casting",
    "Hit Chance Increase",
    "Hit Point Regeneration",
    "Lower Mana Cost",
    "Lower Reagent Cost",
    "Mana Regeneration",
    "Spell Channeling",
    "Spell Damage Increase",
    "Stamina Regeneration",
    "Swing Speed Increase"
  ]

  const slotItems = [
    "Head",
    "Chest Armor",
    "Leg Armor",
    "Glove Armor",
    "Sleeve Armor",
    "Footwear",
    "Neck Armor",
    "Jewelry",
    "Talismans",
    "Robes",
    "Belts Aprons",
    "Sashes",
    "Cloaks Quivers"
  ]



  const scrollItems = [
    "Alacrity Scrolls",
    "Power Scrolls", 
    "Transcendence Scrolls"
  ]

  const toolItems = [
    "Maps",
    "IDOC",
    "EM Event List",
    "Event Rares",
    "Price Checker",
    "Lost Ark Gold",
    "Auction Safes",
    "Invasion Event"
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-32 h-12">
              <Image
                src="/logof.png"
                alt="UO KING"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors">
              Home
            </Link>

            {/* Class Dropdown */}
            <div className="relative group">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors flex items-center"
                onMouseEnter={() => handleMouseEnter('class')}
                onMouseLeave={handleMouseLeave}
              >
                Class
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'class' && (
                <div 
                  className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('class')}
                  onMouseLeave={handleMouseLeave}
                >
                  {classItems.map((item) => (
                    <Link
                      key={item}
                      href={`/class/${item.toLowerCase().replace(' ', '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Prop Dropdown */}
            <div className="relative group">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors flex items-center"
                onMouseEnter={() => handleMouseEnter('prop')}
                onMouseLeave={handleMouseLeave}
              >
                Prop
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'prop' && (
                <div 
                  className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('prop')}
                  onMouseLeave={handleMouseLeave}
                >
                  {propItems.map((item) => (
                    <Link
                      key={item}
                      href={`/prop/${item.toLowerCase().replace(' ', '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Slot Dropdown */}
            <div className="relative group">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors flex items-center"
                onMouseEnter={() => handleMouseEnter('slot')}
                onMouseLeave={handleMouseLeave}
              >
                Slot
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'slot' && (
                <div 
                  className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('slot')}
                  onMouseLeave={handleMouseLeave}
                >
                  {slotItems.map((item) => (
                    <Link
                      key={item}
                      href={`/UO/${slotToCategoryUrl(item)}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Store Dropdown */}
            <div className="relative group">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors flex items-center"
                onMouseEnter={() => handleMouseEnter('store')}
                onMouseLeave={handleMouseLeave}
              >
                Store
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'store' && (
                <div 
                  className="absolute left-0 top-full mt-1 w-96 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('store')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {categoriesLoading ? (
                      <div className="col-span-3 text-center py-4 text-gray-500 text-sm">
                        Loading categories...
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/UO/${categoryToUrl(category.name)}`}
                          className="block px-2 py-1 text-xs text-gray-700 hover:bg-amber-50 hover:text-amber-800 rounded transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-4 text-gray-500 text-sm">
                        No categories available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href="/gold" className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors">
              Gold
            </Link>

            <Link href="/suits" className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors">
              Suits
            </Link>

            {/* Scrolls Dropdown */}
            <div className="relative group">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors flex items-center"
                onMouseEnter={() => handleMouseEnter('scrolls')}
                onMouseLeave={handleMouseLeave}
              >
                Scrolls
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'scrolls' && (
                <div 
                  className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('scrolls')}
                  onMouseLeave={handleMouseLeave}
                >
                  {scrollItems.map((item) => (
                    <Link
                      key={item}
                      href={`/scrolls/${item.toLowerCase().replace(' ', '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div className="relative group">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors flex items-center"
                onMouseEnter={() => handleMouseEnter('tools')}
                onMouseLeave={handleMouseLeave}
              >
                Tools
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'tools' && (
                <div 
                  className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('tools')}
                  onMouseLeave={handleMouseLeave}
                >
                  {toolItems.map((item) => (
                    <Link
                      key={item}
                      href={`/tools/${item.toLowerCase().replace(' ', '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/contact" className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-amber-50 hover:text-amber-800 transition-colors">
              Contact
            </Link>
          </nav>

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
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" asChild>
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
            </div>

            {/* Cart */}
            <Button variant="outline" size="icon" className="relative bg-transparent" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  3
                </Badge>
              </Link>
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
                    <div className="relative w-24 h-8">
                      <Image
                        src="/logof.png"
                        alt="UO KING"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="justify-start bg-transparent" asChild>
                      <Link href="/login">
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button className="justify-start bg-amber-600 hover:bg-amber-700" asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input type="search" placeholder="Search items..." className="pl-10" />
                  </div>

                  <nav className="flex flex-col space-y-2">
                    <Button variant="ghost" className="justify-start">Home</Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="justify-between w-full">
                          Class
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {classItems.map((item) => (
                          <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="justify-between w-full">
                          Prop
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {propItems.map((item) => (
                          <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="justify-between w-full">
                          Slot
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {slotItems.map((item) => (
                          <DropdownMenuItem key={item} asChild>
                            <Link href={`/UO/${slotToCategoryUrl(item)}`}>
                              {item}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="justify-between w-full">
                          Store
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {categoriesLoading ? (
                          <DropdownMenuItem disabled>
                            Loading categories...
                          </DropdownMenuItem>
                        ) : categories.length > 0 ? (
                          categories.map((category) => (
                            <DropdownMenuItem key={category.id} asChild>
                              <Link href={`/UO/${categoryToUrl(category.name)}`}>
                                {category.name}
                              </Link>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>
                            No categories available
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" className="justify-start">Gold</Button>
                    <Button variant="ghost" className="justify-start">Suits</Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="justify-between w-full">
                          Scrolls
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {scrollItems.map((item) => (
                          <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="justify-between w-full">
                          Tools
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {toolItems.map((item) => (
                          <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" className="justify-start">Contact</Button>
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
