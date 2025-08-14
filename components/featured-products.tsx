import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Crown } from "lucide-react"
import Link from "next/link"
import { getFeaturedProducts } from "@/lib/db"
import { ProductImageFallback } from "@/components/ui/product-image"

export async function FeaturedProducts() {
  // Fetch featured products from database
  const products = await getFeaturedProducts(6); // Get 6 featured products

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our most popular and highest-rated Ultima Online items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => {
            const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
            const regularPrice = parseFloat(product.price);
            const price = salePrice || regularPrice;
            const originalPrice = salePrice ? regularPrice : null;
            const avgRating = parseFloat(product.avg_rating || '0');
            const reviewCount = parseInt(product.review_count || '0');
            
            return (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer">
                  <div className="relative">
                    <ProductImageFallback
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-amber-600 text-white">Featured</Badge>
                    )}
                    {originalPrice && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white">Sale</Badge>
                    )}

                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    {reviewCount > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(avgRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({reviewCount})</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
                      {originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    {product.short_description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.short_description}</p>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/store">
            <Button variant="outline" size="lg" className="px-8 bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
