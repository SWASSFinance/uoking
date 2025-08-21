"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/ui/product-image"
import { Star, ShoppingCart, Crown, Shield, Zap, Target, Eye, Hand, Hammer, Users, Sword } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface ClassPageProps {
  params: Promise<{ class: string }>
}

interface ClassData {
  id: string
  name: string
  slug: string
  description: string
  image_url?: string
  primary_stats: string[]
  skills: string[]
  playstyle: string
  difficulty_level: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Icon mapping for classes
const classIcons: { [key: string]: any } = {
  'mage': Zap,
  'tamer': Users,
  'melee': Sword,
  'ranged': Target,
  'thief': Eye,
  'crafter': Hammer,
  'default': Shield
}

// Color mapping for classes
const classColors: { [key: string]: string } = {
  'mage': 'from-purple-500 to-purple-600',
  'tamer': 'from-green-500 to-green-600',
  'melee': 'from-red-500 to-red-600',
  'ranged': 'from-blue-500 to-blue-600',
  'thief': 'from-gray-500 to-gray-600',
  'crafter': 'from-yellow-500 to-yellow-600',
  'default': 'from-amber-500 to-amber-600'
}

export default function ClassPage({ params }: ClassPageProps) {
  const [classParam, setClassParam] = useState<string>('')
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params
        const classValue = resolvedParams.class
        setClassParam(classValue)

        // Fetch class data from database
        const classResponse = await fetch(`/api/admin/classes`)
        if (classResponse.ok) {
          const classes = await classResponse.json()
          const currentClass = classes.find((cls: ClassData) => cls.slug === classValue && cls.is_active)
          
          if (!currentClass) {
            notFound()
          }
          
          setClassData(currentClass)
        } else {
          notFound()
        }

        // Fetch products for this class
        const productsResponse = await fetch(`/api/products?class=${classValue}&limit=100`)
        if (productsResponse.ok) {
          const data = await productsResponse.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Error loading class data:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params])

  const handleAddToCart = (product: any) => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: parseFloat(product.sale_price || product.price),
      image_url: product.image_url || '',
      category: product.category_names ? product.category_names.split(', ')[0] : ''
    })
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading class information...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!classData) {
    notFound()
  }

  const IconComponent = classIcons[classData.slug] || classIcons.default
  const classColor = classColors[classData.slug] || classColors.default

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-4 rounded-lg bg-gradient-to-r ${classColor}`}>
                <IconComponent className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">UO {classData.name} Items</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mt-4 leading-relaxed">
              {classData.description}
            </p>
            {classData.difficulty_level <= 2 && (
              <Badge className="mt-4 bg-amber-500 text-white">Popular Class</Badge>
            )}
          </div>

          {/* Class Items Grid */}
          {products && products.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{classData.name} Items</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {products.map((product: any) => (
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
                          
                          {product.featured && (
                            <Badge className="absolute top-1 left-1 bg-amber-500 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors text-sm">
                          {product.name}
                        </h3>
                        
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

                      {/* Add to Cart Button */}
                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => handleAddToCart(product)}
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
            </div>
          )}

          {/* Class Features */}
          {classData.primary_stats && classData.primary_stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {classData.primary_stats.map((stat, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border border-amber-200">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <Star className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{stat}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Class Skills */}
          {classData.skills && classData.skills.length > 0 && (
            <div className="mb-12">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {classData.name} Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-white rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Playstyle Description */}
          {classData.playstyle && (
            <div className="mb-12">
              <Card className={`bg-gradient-to-r ${classColor.replace('500', '50').replace('600', '100')} border border-amber-200`}>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {classData.name} Playstyle
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {classData.playstyle}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Newest Products for this Class */}
          {products && products.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest {classData.name} Items</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {products.slice(0, 12).map((product: any) => (
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
                          
                          {product.featured && (
                            <Badge className="absolute top-1 left-1 bg-amber-500 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors text-sm">
                          {product.name}
                        </h3>
                        
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

                      {/* Add to Cart Button */}
                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => handleAddToCart(product)}
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
              
              {/* View All Products Button */}
              <div className="text-center mt-8">
                <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
                  <Link href={`/UO/${classData.slug}`}>
                    View All {classData.name} Items
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Equip Your {classData.name}?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Discover the perfect items to enhance your {classData.name.toLowerCase()} character's abilities.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">
                Browse All Items
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 