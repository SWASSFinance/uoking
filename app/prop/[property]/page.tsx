"use client"

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ProductImage } from "@/components/ui/product-image"
import { Sword, ArrowUp, Star, Target, Zap, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"

interface PropertyPageProps {
  params: Promise<{ property: string }>
}

interface Product {
  id: string | number
  name: string
  slug: string
  price: string
  sale_price?: string
  image_url?: string
  short_description?: string
  featured: boolean
  avg_rating: number
  review_count: number
  category?: string
  stats?: any[]
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const [propertyName, setPropertyName] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { addItem } = useCart()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { property } = await params
        
        // Convert URL slug back to property name (e.g., "damage-increase" -> "Damage Increase")
        const propertyNameValue = property
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        setPropertyName(propertyNameValue)

        // Search for products containing the property name
        const response = await fetch(`/api/products?search=${encodeURIComponent(propertyNameValue)}&limit=50`)
        if (response.ok) {
          const productsData = await response.json()
          setProducts(productsData)
        }
      } catch (error) {
        console.error('Error loading property data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: parseFloat(product.sale_price || product.price),
      image_url: product.image_url || '',
      category: product.category || ''
    })
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    })
  }

  // Function to convert item name to URL-friendly slug
  const createProductSlug = (itemName: string) => {
    return itemName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  }

  // Property descriptions and icons
  const propertyInfo = {
    "Damage Increase": {
      description: "Increase your weapon damage and become a more formidable fighter. Damage Increase is one of the most important combat properties in Ultima Online.",
      icon: Sword,
      color: "from-red-500 to-red-600",
      category: "Combat"
    },
    "Defense Chance Increase": {
      description: "Improve your chance to avoid attacks and increase your survivability in combat. Essential for any defensive build.",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      category: "Defense"
    },
    "Enhance Potions": {
      description: "Make your potions more effective and get better value from your healing items. Perfect for characters who rely on potions.",
      icon: Zap,
      color: "from-green-500 to-green-600",
      category: "Utility"
    },
    "Faster Cast Recovery": {
      description: "Reduce spell casting delay and cast spells more frequently. Essential for mages and spellcasters.",
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      category: "Magic"
    },
    "Faster Casting": {
      description: "Increase your spell casting speed and become a more effective spellcaster. Perfect for mage builds.",
      icon: Zap,
      color: "from-yellow-500 to-yellow-600",
      category: "Magic"
    },
    "Hit Chance Increase": {
      description: "Improve your accuracy in combat and land more successful attacks. Essential for any combat build.",
      icon: Target,
      color: "from-orange-500 to-orange-600",
      category: "Combat"
    },
    "Hit Point Regeneration": {
      description: "Automatically regenerate health over time and improve your survivability. Great for PvE and sustained combat.",
      icon: Star,
      color: "from-pink-500 to-pink-600",
      category: "Defense"
    },
    "Lower Mana Cost": {
      description: "Reduce spell mana consumption and cast more spells with the same mana pool. Essential for mage efficiency.",
      icon: Zap,
      color: "from-indigo-500 to-indigo-600",
      category: "Magic"
    },
    "Lower Reagent Cost": {
      description: "Reduce spell reagent usage and save on casting costs. Perfect for mages who cast frequently.",
      icon: Star,
      color: "from-teal-500 to-teal-600",
      category: "Magic"
    },
    "Mana Regeneration": {
      description: "Automatically regenerate mana over time and maintain sustained spellcasting. Essential for mage builds.",
      icon: Zap,
      color: "from-cyan-500 to-cyan-600",
      category: "Magic"
    },
    "Spell Channeling": {
      description: "Allow movement while casting spells and gain a significant advantage in combat. Perfect for mobile mages.",
      icon: Zap,
      color: "from-violet-500 to-violet-600",
      category: "Magic"
    },
    "Spell Damage Increase": {
      description: "Increase magical damage output and become a more powerful spellcaster. Essential for offensive mage builds.",
      icon: Zap,
      color: "from-rose-500 to-rose-600",
      category: "Magic"
    },
    "Stamina Regeneration": {
      description: "Automatically regenerate stamina and maintain peak performance in combat. Essential for melee characters.",
      icon: Star,
      color: "from-emerald-500 to-emerald-600",
      category: "Utility"
    },
    "Swing Speed Increase": {
      description: "Increase weapon attack speed and deal more damage over time. Perfect for melee DPS builds.",
      icon: Sword,
      color: "from-amber-500 to-amber-600",
      category: "Combat"
    }
  }

  const currentProperty = propertyInfo[propertyName as keyof typeof propertyInfo]
  const IconComponent = currentProperty?.icon || Sword

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/prop" className="hover:text-amber-600 transition-colors">
              Properties
            </Link>
            <span>/</span>
            <span className="text-amber-600 font-medium">{propertyName}</span>
          </nav>

          {/* Property Header */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-amber-200">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0 -mt-4">
                  <div className={`w-full h-full rounded-lg bg-gradient-to-r ${currentProperty?.color || 'from-amber-500 to-amber-600'} flex items-center justify-center`}>
                    <IconComponent className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4 mt-6">Ultima Online {propertyName} Items</h1>
                  <div className="prose prose-amber max-w-none">
                    <div className="text-gray-600 leading-relaxed">
                      {currentProperty?.description || `Items with ${propertyName} property`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details - Compact Version */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What is Property */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Star className="h-5 w-5 text-amber-500 mr-2" />
                  What is {propertyName}?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {propertyName} is a property that enhances your character's abilities in Ultima Online. 
                  It's one of the most sought-after properties for optimizing your build.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-400 mr-1" />
                    Enhances performance
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-400 mr-1" />
                    Works with various equipment
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-400 mr-1" />
                    Stacks with other properties
                  </div>
                </div>
              </div>

              {/* How to Get Property */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 text-blue-500 mr-2" />
                  How to Get {propertyName}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Target className="h-4 w-4 text-blue-400 mr-2" />
                    Find items with {propertyName}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Zap className="h-4 w-4 text-purple-400 mr-2" />
                    Use enhancement materials
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Sword className="h-4 w-4 text-green-400 mr-2" />
                    Craft items with {propertyName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {propertyName} Products
              </h2>
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? 'item' : 'items'} available
              </p>
            </div>
          </div>

                    {/* Products Grid */}
          {products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-amber-200 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-3">
                    <Link href={`/product/${product.slug}`}>
                      <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden group">
                        <ProductImage
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Short Description Overlay */}
                        {product.short_description && (
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                            <div className="text-white text-center max-w-full">
                              <pre className="text-xs whitespace-pre-wrap font-sans text-left">
                                {product.short_description}
                              </pre>
                            </div>
                          </div>
                        )}
                        
                        {product.featured && (
                          <Badge className="absolute top-1 left-1 bg-amber-500 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors text-sm">
                        {product.name}
                      </h3>
                      
                      <div className="min-h-[3rem] mb-3">
                        {product.short_description && (
                          <pre className="text-xs text-gray-600 line-clamp-2 whitespace-pre-wrap font-sans">
                            {product.short_description}
                          </pre>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          {product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price) ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-amber-600">
                                ${parseFloat(product.sale_price).toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                ${parseFloat(product.price).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-amber-600">
                              ${parseFloat(product.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        {product.avg_rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium">
                              {typeof product.avg_rating === 'string' ? parseFloat(product.avg_rating).toFixed(1) : product.avg_rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Quantity and Add to Cart Section */}
                    <div className="flex items-center gap-2">
                      <input
                        id={`qty-${product.id}`}
                        type="number"
                        min="1"
                        max="10000"
                        defaultValue="1"
                        title="Maximum quantity: 10,000"
                        className="w-12 h-8 text-center text-sm border border-gray-300 rounded-md bg-white text-black font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                      
                      <Button 
                        onClick={() => {
                          const input = document.getElementById(`qty-${product.id}`) as HTMLInputElement
                          const quantity = parseInt(input?.value) || 1
                          for (let i = 0; i < quantity; i++) {
                            handleAddToCart(product)
                          }
                        }}
                        size="sm"
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs py-2"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Items Found */}
          {products.length === 0 && (
            <div className="text-center mb-12">
              <Card className="border-amber-200 max-w-md mx-auto">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <Target className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Items Found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any items with the {propertyName} property. 
                    Try browsing our general store for similar items.
                  </p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700" asChild>
                    <Link href="/store">
                      Browse All Items
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Tips for Maximizing {propertyName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Equipment Strategy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Focus on items that complement your build
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Look for items with multiple beneficial properties
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Consider the trade-off with other properties
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Build Optimization</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Combine with complementary properties
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Balance with your character's strengths
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Test different combinations for best results
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Enhance Your Equipment?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our selection of equipment with {propertyName} properties.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">
                Browse Equipment
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 