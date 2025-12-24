"use client"

import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SearchModal } from "@/components/search-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCart } from "@/contexts/cart-context"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Search, 
  Menu, 
  User, 
  ShoppingCart, 
  LogOut, 
  DollarSign,
  ChevronDown,
  Crown,
  ChevronRight
} from "lucide-react"

// Global cache for categories and classes to prevent duplicate API calls
let categoriesCache: Array<{ id: string; name: string }> | null = null
let classesCache: Array<{ id: string; name: string; slug: string }> | null = null
let cashbackCache: { [email: string]: number } = {}

export function Header() {
  const { data: session, status } = useSession()
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [cashbackBalance, setCashbackBalance] = useState(0)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [classes, setClasses] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [classesLoading, setClassesLoading] = useState(true)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  
  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section)
    } else {
      newOpenSections.add(section)
    }
    setOpenSections(newOpenSections)
  }
  
  // Use refs to track if data has been fetched
  const categoriesFetched = useRef(false)
  const classesFetched = useRef(false)
  const cashbackFetched = useRef(false)

  // Fetch cashback balance when user is authenticated
  useEffect(() => {
    if (session?.user?.email && !cashbackFetched.current) {
      const userEmail = session.user.email
      
      // Check cache first
      if (cashbackCache[userEmail] !== undefined) {
        setCashbackBalance(cashbackCache[userEmail])
        return
      }
      
      cashbackFetched.current = true
      fetch('/api/user/cashback-balance')
        .then(res => res.json())
        .then(data => {
          const balance = data.referral_cash || 0
          setCashbackBalance(balance)
          cashbackCache[userEmail] = balance
        })
        .catch(error => {
          console.error('Error fetching cashback balance:', error)
        })
    }
  }, [session])

  // Fetch categories
  useEffect(() => {
    if (!categoriesFetched.current) {
      // Check cache first
      if (categoriesCache) {
        setCategories(categoriesCache)
        setCategoriesLoading(false)
        return
      }
      
      categoriesFetched.current = true
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
          const categoriesData = data || []
          setCategories(categoriesData)
          categoriesCache = categoriesData
        })
        .catch(error => {
          console.error('Error fetching categories:', error)
        })
        .finally(() => {
          setCategoriesLoading(false)
        })
    }
  }, [])

  // Fetch classes
  useEffect(() => {
    if (!classesFetched.current) {
      // Check cache first
      if (classesCache) {
        setClasses(classesCache)
        setClassesLoading(false)
        return
      }
      
      classesFetched.current = true
      fetch('/api/classes')
        .then(res => res.json())
        .then(data => {
          const classesData = data || []
          setClasses(classesData)
          classesCache = classesData
        })
        .catch(error => {
          console.error('Error fetching classes:', error)
        })
        .finally(() => {
          setClassesLoading(false)
        })
    }
  }, [])

  // Helper function to convert category name to URL
  const categoryToUrl = (categoryName: string) => {
    return categoryName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('-')
  }

  // Helper function to convert slot name to category URL
  const slotToCategoryUrl = (slotName: string) => {
    const slotToCategoryMap: { [key: string]: string } = {
      "Head": "Head",
      "Chest Armor": "Chest-Armor", 
      "Leg Armor": "Leg-Armor",
      "Glove Armor": "Glove-Armor",
      "Sleeve Armor": "Sleeve-Armor", 
      "Footwear": "Footwear",
      "Neck Armor": "Neck-Armor",
      "Jewelry": "Jewelry",
      "Talismans": "Talismans",
      "Robes": "Robes",
      "Belts Aprons": "Belts-Aprons",
      "Sashes": "Sashes",
      "Cloaks Quivers": "Cloaks-Quivers"
    }
    return slotToCategoryMap[slotName] || slotName.replace(/\s+/g, '-')
  }

  // Helper function to convert scroll name to URL with proper capitalization
  const scrollToUrl = (scrollName: string) => {
    const scrollToUrlMap: { [key: string]: string } = {
      "Alacrity Scrolls": "Alacrity-Scrolls",
      "Powerscrolls": "Powerscrolls",
      "Sot Scrolls": "Sot-Scrolls"
    }
    return scrollToUrlMap[scrollName] || scrollName.replace(/\s+/g, '-')
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
    }, 0)
    setDropdownTimeout(timeout)
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }



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
    "Powerscrolls", 
    "Sot Scrolls"
  ]

  const toolItems = [
    "Skills",
    "Maps",
    "IDOC",
    "EM Event List",
    "Event Rares",
    "Trading Board"
  ]

  const getCharacterName = () => {
    if (session?.user?.firstName) {
      return session.user.firstName
    }
    if (session?.user?.name) {
      return session.user.name.split(' ')[0]
    }
    return 'User'
  }

  return (
    <>
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-32 h-8">
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
          <nav className="hidden lg:flex items-center space-x-4">
                        {/* Class Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('class')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-800 dark:hover:text-amber-400 transition-colors flex items-center"
              >
                Class
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'class' && (
                <div 
                  className="absolute left-0 top-full mt-0 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('class')}
                  onMouseLeave={handleMouseLeave}
                >
                  {classesLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Loading classes...</div>
                  ) : (
                    <>
                      {/* Dynamic classes from database */}
                      {classes.map((cls) => (
                        <Link
                          key={cls.id}
                          href={`/class/${cls.name.toLowerCase()}`}
                          prefetch={false}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
                        >
                          {cls.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Prop Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('prop')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-800 dark:hover:text-amber-400 transition-colors flex items-center"
              >
                Prop
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'prop' && (
                <div 
                  className="absolute left-0 top-full mt-0 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('prop')}
                  onMouseLeave={handleMouseLeave}
                >
                  {propItems.map((item) => (
                    <Link
                      key={item}
                      href={`/prop/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Slot Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('slot')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-800 dark:hover:text-amber-400 transition-colors flex items-center"
              >
                Slot
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'slot' && (
                <div 
                  className="absolute left-0 top-full mt-0 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('slot')}
                  onMouseLeave={handleMouseLeave}
                >
                  {slotItems.map((item) => (
                    <Link
                      key={item}
                      href={`/UO/${slotToCategoryUrl(item)}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Store Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('store')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-800 dark:hover:text-amber-400 transition-colors flex items-center"
              >
                Store
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'store' && (
                <div 
                  className="absolute left-0 top-full mt-0 w-[750px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('store')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid grid-cols-4 gap-1 p-3">
                    {categoriesLoading ? (
                      <div className="col-span-4 text-center py-4 text-gray-500 text-sm">
                        Loading categories...
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/UO/${categoryToUrl(category.name)}`}
                          className="block px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 rounded transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-4 text-center py-4 text-gray-500 text-sm">
                        No categories available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href="/UO/Gold" className="px-2 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-800 dark:hover:text-amber-400 transition-colors">
              Gold
            </Link>

            <Link href="/UO/Custom-Suits" className="px-2 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-800 dark:hover:text-amber-400 transition-colors">
              Suits
            </Link>

            {/* Scrolls Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('scrolls')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-800 dark:hover:text-amber-400 transition-colors flex items-center"
              >
                Scrolls
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'scrolls' && (
                <div 
                  className="absolute left-0 top-full mt-0 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('scrolls')}
                  onMouseLeave={handleMouseLeave}
                >
                  {scrollItems.map((item) => (
                    <Link
                      key={item}
                      href={`/UO/${scrollToUrl(item)}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('tools')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-800 dark:hover:text-amber-400 transition-colors flex items-center"
              >
                Tools
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {activeDropdown === 'tools' && (
                <div 
                  className="absolute left-0 top-full mt-0 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                  onMouseEnter={() => handleMouseEnter('tools')}
                  onMouseLeave={handleMouseLeave}
                >
                  {toolItems.map((item) => (
                    <Link
                      key={item}
                      href={item === 'Skills' ? '/skills' :
                           item === 'Maps' ? '/maps' : 
                           item === 'Trading Board' ? '/trading' : 
                           item === 'Event Rares' ? '/event-rares' : 
                           item === 'EM Event List' ? '/em-events' : 
                           item === 'IDOC' ? '/IDOC' :
                           `/UO/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>

            {/* Auth Buttons / User Info */}
            {status === 'loading' ? (
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : session ? (
              <div className="hidden sm:flex items-center space-x-3">
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">Hi, {getCharacterName()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {/* Cashback Balance */}
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">Cashback</span>
                      </div>
                      <span className="font-semibold text-green-700">
                        ${cashbackBalance.toFixed(2)}
                      </span>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/cart" className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cart
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="flex items-center text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
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
            )}

            {/* Cart */}
            <Button variant="outline" size="icon" className="relative bg-transparent" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    {cart.itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <div className="flex flex-col space-y-4 mt-4 pb-8">
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

                  {/* Mobile Search */}
                  <Button 
                    variant="outline" 
                    className="justify-start bg-transparent" 
                    onClick={() => {
                      setIsSearchModalOpen(true)
                      setIsOpen(false)
                    }}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>

                  {/* Mobile Theme Toggle */}
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>

                  {/* Mobile Auth Section */}
                  {session ? (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            Cashback: ${cashbackBalance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Hi, {getCharacterName()}!
                      </div>
                      <Button variant="outline" className="justify-start bg-transparent" asChild>
                        <Link href="/account">
                          <User className="h-4 w-4 mr-2" />
                          My Account
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start text-red-600 border-red-200"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
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
                  )}

                  <nav className="flex flex-col space-y-2">
                    {/* Class Dropdown */}
                    <Collapsible open={openSections.has('class')} onOpenChange={() => toggleSection('class')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <span>Class</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${openSections.has('class') ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-2 space-y-1">
                        {classesLoading ? (
                          <div className="px-2 text-sm text-gray-500">Loading classes...</div>
                        ) : (
                          classes.map((cls) => (
                            <Link
                              key={cls.id}
                              href={`/class/${cls.name.toLowerCase()}`}
                              prefetch={false}
                              onClick={() => setIsOpen(false)}
                              className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 rounded-md transition-colors"
                            >
                              {cls.name}
                            </Link>
                          ))
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Prop Dropdown */}
                    <Collapsible open={openSections.has('prop')} onOpenChange={() => toggleSection('prop')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <span>Prop</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${openSections.has('prop') ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-2 space-y-1">
                        {propItems.map((item) => (
                          <Link
                            key={item}
                            href={`/prop/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 rounded-md transition-colors"
                          >
                            {item}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Slot Dropdown */}
                    <Collapsible open={openSections.has('slot')} onOpenChange={() => toggleSection('slot')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <span>Slot</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${openSections.has('slot') ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-2 space-y-1">
                        {slotItems.map((item) => (
                          <Link
                            key={item}
                            href={`/UO/${slotToCategoryUrl(item)}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 rounded-md transition-colors"
                          >
                            {item}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Store Dropdown */}
                    <Collapsible open={openSections.has('store')} onOpenChange={() => toggleSection('store')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <span>Store</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${openSections.has('store') ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-2 space-y-1">
                        {categoriesLoading ? (
                          <div className="px-2 text-sm text-gray-500">Loading...</div>
                        ) : (
                          categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/UO/${categoryToUrl(category.name)}`}
                              onClick={() => setIsOpen(false)}
                              className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 rounded-md transition-colors"
                            >
                              {category.name}
                            </Link>
                          ))
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Gold Link */}
                    <Link
                      href="/UO/Gold"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-3 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    >
                      Gold
                    </Link>

                    {/* Suits Link */}
                    <Link
                      href="/UO/Custom-Suits"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-3 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    >
                      Suits
                    </Link>

                    {/* Scrolls Dropdown */}
                    <Collapsible open={openSections.has('scrolls')} onOpenChange={() => toggleSection('scrolls')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <span>Scrolls</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${openSections.has('scrolls') ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-2 space-y-1">
                        {scrollItems.map((item) => (
                          <Link
                            key={item}
                            href={`/UO/${scrollToUrl(item)}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 rounded-md transition-colors"
                          >
                            {item}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Tools Dropdown */}
                    <Collapsible open={openSections.has('tools')} onOpenChange={() => toggleSection('tools')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <span>Tools</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${openSections.has('tools') ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-2 space-y-1">
                        {toolItems.map((item) => (
                          <Link
                            key={item}
                            href={item === 'Skills' ? '/skills' :
                                 item === 'Maps' ? '/maps' : 
                                 item === 'Trading Board' ? '/trading' : 
                                 item === 'Event Rares' ? '/event-rares' : 
                                 item === 'EM Event List' ? '/em-events' : 
                                 item === 'IDOC' ? '/IDOC' :
                                 `/UO/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-amber-400 rounded-md transition-colors"
                          >
                            {item}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
      </header>
    </>
  )
}
