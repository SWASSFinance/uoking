import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Crown } from "lucide-react"
import Link from "next/link"
import { ProductImage } from "@/components/ui/product-image"
import { getFeaturedProducts } from "@/lib/db"

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

export async function FeaturedProducts() {
  // Fetch featured products from database
  const products = await getFeaturedProducts(6)

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our most popular and highest-rated Ultima Online items</p>
        </div>

        {products.length > 0 ? (
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

                  {/* Add to Cart Button - Simplified for server component */}
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm"
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs py-2"
                      asChild
                    >
                      <Link href={`/product/${product.slug}`}>
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/store">
            <Button variant="outline" size="lg" className="px-8 bg-white/90 backdrop-blur-sm border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
