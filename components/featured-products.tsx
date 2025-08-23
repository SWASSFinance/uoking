"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import Link from "next/link"
import { ProductsGrid } from "@/components/products-grid"
import { useApiCache } from "@/hooks/use-api-cache"

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

export function FeaturedProducts() {
  const { data: products = [], loading } = useApiCache<Product[]>({
    cacheKey: 'featured-products',
    url: '/api/products?featured=true&limit=6'
  })

  if (loading) {
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </section>
    )
  }

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
          <ProductsGrid products={products} />
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
