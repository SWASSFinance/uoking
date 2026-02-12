"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Star, Shield, CreditCard, MessageCircle, Truck, CheckCircle, Crown } from 'lucide-react'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ProductImageGallery } from '@/components/product-image-gallery'
import { ProductReviewForm } from '@/components/product-review-form'
import { ProductReviews } from '@/components/product-reviews'
import { SpawnLocationForm } from '@/components/spawn-location-form'
import { ProductImageSubmissions } from '@/components/product-image-submissions'
import { ProductStructuredData } from '@/components/product-structured-data'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/hooks/use-toast'

export default function ProductPage() {
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { toast } = useToast()
  const paramsHook = useParams()
  const productSlug = paramsHook['product-name'] as string

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch product and reviews from API
        const response = await fetch(`/api/products/by-slug/${productSlug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch product')
        }

        const data = await response.json()
        setProduct(data.product)
        setReviews(data.reviews)

        // Fetch related products from the same category
        if (data.product?.category_id) {
          try {
            const relatedResponse = await fetch(`/api/products?categoryId=${data.product.category_id}&limit=4`)
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json()
              // Filter out the current product
              setRelatedProducts(relatedData.products.filter((p: any) => p.id !== data.product.id).slice(0, 3))
            }
          } catch (error) {
            console.error('Error loading related products:', error)
          }
        }
      } catch (error) {
        console.error('Error loading product:', error)
        notFound();
      } finally {
        setLoading(false)
      }
    }

    if (productSlug) {
      loadData()
    }
  }, [productSlug])

  const handleAddToCart = () => {
    if (!product) return
    
    // Use deal price if available, otherwise use regular price
    const itemPrice = product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.price)
    
    addItem({
      id: String(product.id),
      name: product.name,
      price: itemPrice,
      image_url: product.image_url || '',
      category: product.category_name || ''
    })
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart${product.is_deal_of_the_day ? ' at the deal price!' : '.'}`,
      variant: "default",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading product...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    notFound();
  }



  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const regularPrice = parseFloat(product.price);
  const price = salePrice || regularPrice;
  const originalPrice = salePrice ? regularPrice : null;
  const avgRating = parseFloat(product.avg_rating || '0');
  const reviewCount = parseInt(product.review_count || '0');

  // Helper function to format description based on whether it contains HTML
  const formatDescription = (desc: string) => {
    if (!desc) return '';
    
    // Check if description contains HTML tags
    const hasHTML = /<[^>]+>/.test(desc);
    
    if (hasHTML) {
      // Already has HTML, return as-is
      return desc;
    } else {
      // Plain text - convert line breaks to <br> tags
      return desc.replace(/\n/g, '<br>');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Add structured data for SEO */}
      <ProductStructuredData product={product} />

      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm text-gray-600 dark:text-gray-300">
              <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400">Home</Link>
              <span className="mx-2">/</span>
              {product.category_slug && (
                <>
                  <Link href={`/UO/${product.category_slug}`} className="hover:text-amber-600 dark:hover:text-amber-400">
                    {product.category_name}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )}
              <span className="text-gray-900 dark:text-white">{product.name}</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Product Image - 25% */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                              <ProductImageGallery 
                imageUrl={product.image_url} 
                productName={product.name}
                description={product.description}
              />
                
                {/* Features */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free Transfer To All Shards</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Debit Card Accepted</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Credit Card Accepted</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Live Chat Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details - 75% */}
            <div className="lg:col-span-3 space-y-6">
              {/* Product Header */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-600 rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Ultima Online {product.name}</h1>
                
                {/* Rating */}
                {reviewCount > 0 && (
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {avgRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}

                {/* Price and Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">${price.toFixed(2)}</span>
                    {originalPrice && (
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                    )}
                    {salePrice && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive">
                          {product.is_deal_of_the_day ? 'Deal of the Day' : 'Sale'}
                        </Badge>
                        {product.is_premium_user && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">In Stock</span>
                  </div>
                </div>

                {/* Purchase Buttons */}
                <div className="flex space-x-4 mb-4">
                  <Button 
                    size="lg" 
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
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

                {/* Short Description */}
                {product.short_description && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">{product.short_description}</pre>
                  </div>
                )}

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-900 dark:text-white">In Stock</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-center">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-900 dark:text-white">Fast Delivery</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 text-center">
                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-900 dark:text-white">Secure</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 text-center">
                    <Star className="h-5 w-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-900 dark:text-white">5% Cashback</p>
                  </div>
                </div>
              </div>

              {/* Game Info */}
              {(product.spawn_location || product.drop_rate || product.class_names || product.type) && (
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-white">Game Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {product.type && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Item Type:</span>
                        <span className="font-medium dark:text-white capitalize">{product.type}</span>
                      </div>
                    )}
                    {product.spawn_location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Spawn Location:</span>
                        <span className="font-medium dark:text-white">{product.spawn_location}</span>
                      </div>
                    )}
                    {product.drop_rate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Drop Rate:</span>
                        <span className="font-medium dark:text-white">{product.drop_rate}</span>
                      </div>
                    )}
                    {product.class_names && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Recommended Class:</span>
                        <span className="font-medium dark:text-white">{product.class_names}</span>
                      </div>
                    )}
                    {product.category_name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Category:</span>
                        <Link href={`/UO/${product.category_slug}`} className="font-medium text-amber-600 dark:text-amber-400 hover:underline">
                          {product.category_name}
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Spawn Location Submission */}
              {product?.id && (
                <SpawnLocationForm 
                  productId={product.id}
                  productName={product.name}
                  currentSpawnLocation={product.spawn_location}
                />
              )}


            </div>
          </div>

          {/* Product Description and Reviews */}
          <div className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Product Description */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-600 mb-8">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div 
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatDescription(product.description) }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews Section */}
                {product?.id && (
                  <ProductReviews 
                    productId={product.id} 
                    initialReviews={reviews}
                    avgRating={avgRating}
                    reviewCount={reviewCount}
                  />
                )}

                {/* User Image Submissions Section */}
                {product?.id && (
                  <div className="mt-8">
                    <ProductImageSubmissions 
                      productId={product.id} 
                      productName={product.name}
                      initialSubmissions={[]}
                    />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Delivery Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="dark:text-gray-300">Usually delivered within 24 hours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="dark:text-gray-300">100% secure delivery guarantee</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="dark:text-gray-300">All shards supported</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Why Buy From Us */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Why UO King?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-semibold text-amber-600 dark:text-amber-400 mb-1">💰 5% Loyalty Cashback</div>
                        <p className="text-gray-600 dark:text-gray-300">Earn rewards on every purchase</p>
                      </div>
                      <Separator />
                      <div>
                        <div className="font-semibold text-amber-600 dark:text-amber-400 mb-1">📊 Volume Discounts</div>
                        <p className="text-gray-600 dark:text-gray-300">Save up to 20% on bulk orders</p>
                      </div>
                      <Separator />
                      <div>
                        <div className="font-semibold text-amber-600 dark:text-amber-400 mb-1">🎖️ Military Support</div>
                        <p className="text-gray-600 dark:text-gray-300">3% of orders support veterans</p>
                      </div>
                      <Separator />
                      <div>
                        <div className="font-semibold text-amber-600 dark:text-amber-400 mb-1">👥 Referral Program</div>
                        <p className="text-gray-600 dark:text-gray-300">Earn 10% for every friend</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Need Help */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <p>Have questions about this item?</p>
                      <Link href="/contact" className="block">
                        <Button variant="outline" className="w-full">
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.slug}`}
                    className="group"
                  >
                    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
                          {relatedProduct.image_url ? (
                            <img
                              src={relatedProduct.image_url}
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            ${parseFloat(relatedProduct.sale_price || relatedProduct.price).toFixed(2)}
                          </span>
                          {relatedProduct.sale_price && (
                            <Badge variant="destructive" className="text-xs">Sale</Badge>
                          )}
                        </div>
                        {relatedProduct.avg_rating > 0 && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {parseFloat(relatedProduct.avg_rating).toFixed(1)} ({relatedProduct.review_count})
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 