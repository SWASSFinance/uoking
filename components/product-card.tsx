"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, ShoppingCart, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { ProductImage } from "@/components/ui/product-image"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

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

interface ProductCardProps {
  product: Product
  showQuantity?: boolean
  showAddToCart?: boolean
  className?: string
}

export function ProductCard({ 
  product, 
  showQuantity = true, 
  showAddToCart = true,
  className = ""
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    const price = parseFloat(product.sale_price || product.price || '0') || 0
    
    addItem({
      id: String(product.id),
      name: product.name || 'Unknown Product',
      price: price,
      image_url: product.image_url || '',
      category: product.category || ''
    }, quantity)
    
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} has been added to your cart.`,
      variant: "default",
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10000) {
      setQuantity(newQuantity)
    }
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:scale-105 border-amber-200 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col ${className}`}>
      <CardContent className="p-3 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col">
          <div className="aspect-square relative mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden group">
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
          
          <h3 className="font-semibold text-gray-800 dark:text-amber-400 mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-white transition-colors text-sm">
            {product.name}
          </h3>
          
          <div className="min-h-[2.5rem] mb-3 flex-1">
            {product.short_description && (
              <pre className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 whitespace-pre-wrap font-sans">
                {product.short_description}
              </pre>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {product.sale_price && parseFloat(product.sale_price || 0) < parseFloat(product.price || 0) ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    ${(parseFloat(product.sale_price || 0) || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                    ${(parseFloat(product.price || 0) || 0).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  ${(parseFloat(product.price || 0) || 0).toFixed(2)}
                </span>
              )}
            </div>
            
            {product.avg_rating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {typeof product.avg_rating === 'string' ? parseFloat(product.avg_rating).toFixed(1) : product.avg_rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Quantity Selector and Add to Cart Button */}
        {showQuantity && showAddToCart && (
          <div className="mt-auto pt-2 space-y-2">
            {/* Quantity Selector */}
            <div className="flex items-center justify-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max="10000"
                className="w-16 h-8 text-center text-xs"
              />
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10000}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              size="sm"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-2"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        )}

        {/* View Details Button (when Add to Cart is disabled) */}
        {!showAddToCart && (
          <div className="mt-auto pt-2">
            <Button 
              size="sm"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-2"
              asChild
            >
              <Link href={`/product/${product.slug}`}>
                <ShoppingCart className="h-3 w-3 mr-1" />
                View Details
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
