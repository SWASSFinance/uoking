"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImage } from '@/components/ui/product-image'
import { Clock, Tag, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useApiCache } from '@/hooks/use-api-cache'

interface DealOfTheDayProps {
  className?: string
}

interface DealProduct {
  id: string
  name: string
  slug: string
  price: number
  sale_price: number
  image_url: string
  short_description: string
  discount_percentage: number
  time_remaining: string
}

export function DealOfTheDay({ className = "" }: DealOfTheDayProps) {
  const [timeRemaining, setTimeRemaining] = useState('')
  
  const { data: dealData, loading } = useApiCache<{ deal: DealProduct }>({
    cacheKey: 'deal-of-the-day',
    url: '/api/deal-of-the-day',
    cacheDuration: 60 * 1000 // 1 minute cache for deals
  })
  
  const deal = dealData?.deal || null

  useEffect(() => {
    const interval = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [deal])

  const updateTimeRemaining = () => {
    if (!deal) return
    
    const now = new Date()
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)
    
    const diff = endOfDay.getTime() - now.getTime()
    
    if (diff <= 0) {
      setTimeRemaining('Deal ended')
      return
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
  }

  if (loading) {
    return (
      <Card className={`border-2 border-orange-200 bg-gradient-to-r from-orange-50/95 to-amber-50/95 backdrop-blur-md shadow-2xl ${className}`}>
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Deal of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!deal) {
    return null
  }

  const savings = deal.price - deal.sale_price
  const savingsPercentage = Math.round((savings / deal.price) * 100)

  return (
    <Card className={`border-2 border-orange-200 bg-gradient-to-r from-orange-50/95 to-amber-50/95 backdrop-blur-md shadow-2xl ${className}`}>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative">
            <ProductImage
              src={deal.image_url}
              alt={deal.name}
              width={300}
              height={300}
              className="rounded-lg object-contain w-full max-h-64"
            />
            <Badge className="absolute top-2 left-2 bg-amber-600 text-white">
              -{deal.discount_percentage}%
            </Badge>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {deal.name} 
              </h3>  
              <div className="text-gray-600 text-sm mb-4">
                <pre className="whitespace-pre-wrap font-sans">{deal.short_description}</pre>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-amber-600">
                  ${deal.sale_price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${deal.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-amber-600 font-medium">
                You save ${savings.toFixed(2)} ({savingsPercentage}% off!)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link href={`/product/${deal.slug}`}>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Deal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 text-center">
                This deal expires at midnight! Don't miss out!
              </p>
              <Badge variant="destructive" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {timeRemaining}
          </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 