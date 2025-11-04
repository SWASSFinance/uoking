"use client"

import { ProductCard } from "./product-card"

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

interface ProductsGridProps {
  products: Product[]
  showQuantity?: boolean
  showAddToCart?: boolean
  className?: string
}

export function ProductsGrid({ 
  products, 
  showQuantity = true, 
  showAddToCart = true,
  className = ""
}: ProductsGridProps) {
  // Safety check for products array
  if (!products || !Array.isArray(products) || products.length === 0) {
    return null
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ${className}`}>
      {products.map((product: Product) => (
        <ProductCard
          key={product.id}
          product={product}
          showQuantity={showQuantity}
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  )
}
