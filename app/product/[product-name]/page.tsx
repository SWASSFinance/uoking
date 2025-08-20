"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Star, Shield, CreditCard, MessageCircle, Truck, CheckCircle } from 'lucide-react'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ProductImageGallery } from '@/components/product-image-gallery'
import { ProductReviewForm } from '@/components/product-review-form'
import { ProductReviews } from '@/components/product-reviews'
import { SpawnLocationForm } from '@/components/spawn-location-form'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/hooks/use-toast'

export default function ProductPage() {
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
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
    
    addItem({
      id: String(product.id),
      name: product.name,
      price: parseFloat(product.sale_price || product.price),
      image_url: product.image_url || '',
      category: product.category_name || ''
    })
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading product...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm text-gray-600">
              <Link href="/" className="hover:text-amber-600">Home</Link>
              <span className="mx-2">/</span>
              {product.category_slug && (
                <>
                  <Link href={`/UO/${product.category_slug}`} className="hover:text-amber-600">
                    {product.category_name}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )}
              <span className="text-gray-900">{product.name}</span>
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
            </div>

            {/* Product Details - 75% */}
            <div className="lg:col-span-3 space-y-6">
              {/* Product Header */}
              <div className="bg-white/90 backdrop-blur-sm border-amber-200 rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
                
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
                    <span className="text-sm text-gray-600">
                      {avgRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}

                {/* Price and Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-amber-600">${price.toFixed(2)}</span>
                    {originalPrice && (
                      <span className="text-lg text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                    )}
                    {salePrice && (
                      <Badge variant="destructive">Sale</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">In Stock</span>
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
                  <Button size="lg" variant="outline" className="flex-1">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Live Chat
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
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
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">{product.short_description}</pre>
                )}
              </div>

              {/* Game Info */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg">Game Information</CardTitle>
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
                  {product.class_names && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recommended Class:</span>
                      <span className="font-medium">{product.class_names}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Spawn Location Submission */}
              <SpawnLocationForm 
                productId={product.id}
                productName={product.name}
                currentSpawnLocation={product.spawn_location}
              />


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
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">{product.description}</pre>
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