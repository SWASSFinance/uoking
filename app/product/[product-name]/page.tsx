import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Star, Shield, CreditCard, MessageCircle, Truck, CheckCircle } from 'lucide-react'
import { getProductBySlug, getProductReviews } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ProductImageGallery } from '@/components/product-image-gallery'
import { ProductReviewForm } from '@/components/product-review-form'
import { ProductReviews } from '@/components/product-reviews'

interface ProductPageProps {
  params: Promise<{ 'product-name': string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { 'product-name': productSlug } = await params;
  
  // Fetch product and reviews from database
  const [product, reviews] = await Promise.all([
    getProductBySlug(productSlug),
    getProductBySlug(productSlug).then(product => 
      product ? getProductReviews(product.id) : []
    )
  ]);

  // If product not found, return 404
  if (!product) {
    notFound();
  }

  // Parse stats if they exist
  const stats = product.stats || [];
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const regularPrice = parseFloat(product.price);
  const price = salePrice || regularPrice;
  const originalPrice = salePrice ? regularPrice : null;
  const avgRating = parseFloat(product.avg_rating || '0');
  const reviewCount = parseInt(product.review_count || '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm text-gray-600">
              <a href="/" className="hover:text-amber-600">Home</a>
              <span className="mx-2">/</span>
              {product.category_slug && (
                <>
                  <a href={`/store/${product.category_slug}`} className="hover:text-amber-600">
                    {product.category_name}
                  </a>
                  <span className="mx-2">/</span>
                </>
              )}
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-6">
              <ProductImageGallery 
                imageUrl={product.image_url} 
                productName={product.name} 
              />
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free Transfer To All Shards</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Debit Card Accepted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Credit Card Accepted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Live Chat Support</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Rating */}
                {reviewCount > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {avgRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-amber-600">${price.toFixed(2)}</span>
                  {originalPrice && (
                    <span className="text-xl text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                  )}
                  {salePrice && (
                    <Badge variant="destructive">Sale</Badge>
                  )}
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">In Stock</span>
                </div>

                {/* Short Description */}
                {product.short_description && (
                  <p className="text-lg text-gray-700 mb-6">{product.short_description}</p>
                )}
              </div>

              {/* Stats */}
              {stats.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      <span>Item Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {stats.map((stat: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-gray-600">{stat.name}</span>
                          <span className="font-semibold text-amber-600">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Game Info */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                <CardHeader>
                  <CardTitle>Game Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.spawn_location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spawn Location:</span>
                      <span className="font-medium">{product.spawn_location}</span>
                    </div>
                  )}
                  {product.drop_rate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drop Rate:</span>
                      <span className="font-medium">{product.drop_rate}</span>
                    </div>
                  )}
                  {product.class_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recommended Class:</span>
                      <span className="font-medium">{product.class_name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Purchase Options */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.requires_shard && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Shard *
                        </label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                          <option value="">Choose your shard...</option>
                          <option value="Arirang">Arirang</option>
                          <option value="Ultima">Ultima</option>
                          <option value="Tokuno">Tokuno</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}

                    {product.requires_character_name && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Character Name *
                        </label>
                        <input 
                          type="text" 
                          placeholder="Enter your character name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button size="lg" className="flex-1 bg-amber-600 hover:bg-amber-700">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>
                      <Button size="lg" variant="outline" className="flex-1">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Live Chat
                      </Button>
                    </div>

                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Truck className="h-4 w-4" />
                        <span>Fast Delivery</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="h-4 w-4" />
                        <span>PayPal Accepted</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Description and Reviews */}
          <div className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Product Description */}
                <Card className="bg-white/90 backdrop-blur-sm border-amber-200 mb-8">
                  <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p>{product.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews Section */}
                <ProductReviews 
                  productId={product.id} 
                  initialReviews={reviews}
                  avgRating={avgRating}
                  reviewCount={reviewCount}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Live Chat Support
                      </Button>
                      <div className="text-sm text-gray-600">
                        <p>Our support team is available 24/7 to help with your order.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                  <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-amber-600" />
                        <span>Usually delivered within 24 hours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-amber-600" />
                        <span>100% secure delivery guarantee</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-amber-600" />
                        <span>SMS notification when ready</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 