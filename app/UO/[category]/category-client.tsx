"use client"

import { useState, useEffect } from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ProductImage } from '@/components/ui/product-image'
import { Star, ArrowLeft, Filter, Grid, List, ShoppingCart, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/contexts/cart-context'

interface CategoryClientProps {
  category: any
  products: any[]
  categoryParam: string
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
  category_names?: string
  stats?: any[]
}

export default function CategoryClient({ category, products, categoryParam }: CategoryClientProps) {
  const { toast } = useToast()
  const { addItem } = useCart()

  const handleAddToCart = (product: Product) => {
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

  if (!category) {
    redirect('/store')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/store" className="hover:text-amber-600 transition-colors">
            Store
          </Link>
          <span>/</span>
          <span className="text-amber-600 font-medium">{category.name}</span>
        </nav>



        {/* Category Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-amber-200">
            {category.image_url && (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0 -mt-4">
                  <ProductImage
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{category.name}</h1>
                  {category.description && (
                    <div className="prose prose-amber max-w-none">
                      <div 
                        className="text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: category.description.split('\n\n')[0] }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!category.image_url && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{category.name}</h1>
                {category.description && (
                  <div className="prose prose-amber max-w-none">
                    <div 
                      className="text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: category.description.split('\n\n')[0] }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {category.name} Products
            </h2>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'item' : 'items'} available
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-amber-200">
              <div className="mb-4">
                <Grid className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600 mb-6">
                We don't have any products in this category yet, but we're always adding new items!
              </p>
              <Button asChild>
                <Link href="/store">
                  Browse Other Categories
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Category Description (Full) */}
        {category.description && category.description.includes('\n\n') && (
          <div className="mt-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-amber-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                About {category.name}
              </h3>
              <div className="prose prose-amber max-w-none">
                <div 
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: category.description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
