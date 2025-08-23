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
import { ProductsGrid } from '@/components/products-grid'
import { CategoryReviews } from '@/components/category-reviews'

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
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 mt-6">Ultima Online {category.name} Items</h1>
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{category.name}</h1>
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
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {category.name} Products
            </h2>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'item' : 'items'} available
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <ProductsGrid products={products} />
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

        {/* Category Reviews Section */}
        <div className="mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-amber-200">
            <CategoryReviews 
              categoryId={category.id} 
              initialReviews={[]}
              avgRating={0}
              reviewCount={0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
