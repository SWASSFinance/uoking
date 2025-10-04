"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/ui/product-image"
import { 
  Search, 
  X, 
  Package, 
  Sword, 
  Shield, 
  Crown,
  ArrowRight,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: string
  name: string
  type: 'product' | 'category' | 'class' | 'prop'
  url: string
  description?: string
  image_url?: string
  price?: string
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save search to recent searches
  const saveSearch = (term: string) => {
    if (!term.trim()) return
    
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Handle search
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    saveSearch(term)

    try {
      // Search products
      const productsResponse = await fetch(`/api/products?search=${encodeURIComponent(term)}&limit=10`)
      const products = productsResponse.ok ? await productsResponse.json() : []

      // Search categories
      const categoriesResponse = await fetch(`/api/categories`)
      const allCategories = categoriesResponse.ok ? await categoriesResponse.json() : []
      const matchingCategories = allCategories.filter((cat: any) => 
        cat.name.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 5)

      // Search classes
      const classesResponse = await fetch(`/api/admin/classes`)
      const allClasses = classesResponse.ok ? await classesResponse.json() : []
      const matchingClasses = allClasses.filter((cls: any) => 
        cls.name.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 5)

      // Define property search terms
      const propertyTerms = [
        'Damage Increase', 'Defense Chance Increase', 'Enhance Potions', 
        'Faster Cast Recovery', 'Faster Casting', 'Hit Chance Increase',
        'Hit Point Regeneration', 'Lower Mana Cost', 'Lower Reagent Cost',
        'Mana Regeneration', 'Spell Channeling', 'Spell Damage Increase',
        'Stamina Regeneration', 'Swing Speed Increase'
      ]
      
      const matchingProps = propertyTerms.filter(prop => 
        prop.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 5)

      // Combine and format results
      const searchResults: SearchResult[] = [
        // Products
        ...products.map((product: any) => ({
          id: `product-${product.id}`,
          name: product.name,
          type: 'product' as const,
          url: `/product/${product.slug}`,
          description: product.short_description,
          image_url: product.image_url,
          price: product.price
        })),
        
        // Categories
        ...matchingCategories.map((category: any) => ({
          id: `category-${category.id}`,
          name: category.name,
          type: 'category' as const,
          url: `/UO/${category.name.replace(/\s+/g, '-')}`,
          description: 'Browse category items'
        })),
        
        // Classes
        ...matchingClasses.map((cls: any) => ({
          id: `class-${cls.id}`,
          name: cls.name,
          type: 'class' as const,
          url: `/Class/${cls.name}`,
          description: 'Class-specific items'
        })),
        
        // Properties
        ...matchingProps.map((prop) => ({
          id: `prop-${prop}`,
          name: prop,
          type: 'prop' as const,
          url: `/prop/${prop.toLowerCase().replace(/\s+/g, '-')}`,
          description: 'Property enhancement items'
        }))
      ]

      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    onClose()
    setSearchTerm("")
  }

  // Handle recent search click
  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term)
  }

  // Get icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4" />
      case 'class':
        return <Sword className="h-4 w-4" />
      case 'prop':
        return <Shield className="h-4 w-4" />
      case 'category':
        return <Crown className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  // Get badge color for result type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'product':
        return 'bg-blue-100 text-blue-800'
      case 'class':
        return 'bg-purple-100 text-purple-800'
      case 'prop':
        return 'bg-green-100 text-green-800'
      case 'category':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0 w-full">
        <div className="flex flex-col h-full">
          {/* Header - Removed custom close button to avoid overlap */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Search</h2>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products, classes, props, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
                autoFocus
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!searchTerm && recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Searches</h3>
                <div className="space-y-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(term)}
                      className="flex items-center space-x-2 w-full p-2 text-left text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!searchTerm && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Searches</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Sword of Power', 'Mage Class', 'Damage Increase', 'Head Armor'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleRecentSearchClick(term)}
                      className="flex items-center space-x-2 p-2 text-left text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchTerm && (
              <div className="p-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2 overflow-hidden">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="flex items-start space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group overflow-hidden"
                      >
                        <div className="flex-shrink-0">
                          {result.type === 'product' && result.image_url ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                              <ProductImage
                                src={result.image_url}
                                alt={result.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center">
                              {getResultIcon(result.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 truncate">
                                  {result.name}
                                </span>
                                <Badge className={`text-xs flex-shrink-0 ${getBadgeColor(result.type)}`}>
                                  {result.type}
                                </Badge>
                              </div>
                              {result.description && (
                                <p className="text-sm text-gray-600 break-words overflow-hidden" style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {result.description}
                                </p>
                              )}
                            </div>
                            {result.type === 'product' && result.price && (
                              <div className="text-sm font-semibold text-green-600 flex-shrink-0">
                                ${parseFloat(result.price).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try searching for something else or browse our categories
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 