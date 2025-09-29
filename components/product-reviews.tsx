"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MessageSquare, CheckCircle } from 'lucide-react'
import { ProductReviewForm } from './product-review-form'

interface Review {
  id: string
  rating: number
  title?: string
  content: string
  username: string
  first_name?: string
  last_name?: string
  character_names?: string[]
  profile_image_url?: string
  verified_purchase?: boolean
  created_at: string
}

interface ProductReviewsProps {
  productId: string
  initialReviews: Review[]
  avgRating: number
  reviewCount: number
}

export function ProductReviews({ 
  productId, 
  initialReviews, 
  avgRating, 
  reviewCount 
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState<any>(null)
  const [isCheckingReview, setIsCheckingReview] = useState(false)
  const { data: session } = useSession()

  const handleReviewSubmitted = () => {
    setShowReviewForm(false)
    // Check if user has already reviewed after submission
    checkUserReview()
    // In a real app, you'd refetch the reviews here
    // For now, we'll just show a success message
  }

  const checkUserReview = async () => {
    if (!session?.user) return
    
    setIsCheckingReview(true)
    try {
      const response = await fetch(`/api/products/${productId}/reviews/check`)
      if (response.ok) {
        const data = await response.json()
        setUserReview(data.review)
      }
    } catch (error) {
      console.error('Error checking user review:', error)
    } finally {
      setIsCheckingReview(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      checkUserReview()
    }
  }, [session, productId])

  return (
    <div className="space-y-8">
      {/* Reviews List */}
      {reviews.length > 0 ? (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-6">
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {/* Profile Image */}
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {review.profile_image_url ? (
                          <img
                            src={review.profile_image_url}
                            alt={`Profile picture of ${review.username}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                            {review.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {review.character_names && review.character_names.length > 0 
                            ? review.character_names[0] 
                            : review.username}
                        </span>
                        {review.character_names && review.character_names.length > 0 && (
                          <span className="text-sm text-gray-500">({review.username})</span>
                        )}
                      </div>
                      
                      {review.verified_purchase && (
                        <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                      )}
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="font-medium mb-2">{review.title}</h4>
                  )}
                  <p className="text-gray-700">{review.content}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to review this product and help other customers make informed decisions.
            </p>
            {session ? (
              <Button 
                onClick={() => setShowReviewForm(true)}
                variant="outline"
              >
                Write the First Review
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Please log in to write a review.</p>
                <Button asChild>
                  <Link href="/login">Log In to Review</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Write Review Button for existing reviews */}
      {reviews.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-6 text-center">
            {session ? (
              <Button 
                onClick={() => setShowReviewForm(true)}
                variant="outline"
              >
                Write a Review
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Please log in to write a review.</p>
                <Button asChild>
                  <Link href="/login">Log In to Review</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductReviewForm 
              productId={productId} 
              onReviewSubmitted={handleReviewSubmitted} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
} 