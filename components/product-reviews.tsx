"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
      {/* Reviews Header */}
      <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
        <CardHeader>
                      <div className="flex items-center space-x-4">
              <CardTitle>Customer Reviews</CardTitle>
              {reviewCount > 0 && (
                <div className="flex items-center space-x-2">
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
            </div>
        </CardHeader>
      </Card>

      {/* Review Form or User Review Status */}
      {session?.user && (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
          </CardHeader>
          <CardContent>
            {isCheckingReview ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Checking review status...</p>
              </div>
            ) : userReview ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">You have already reviewed this product</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < userReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{userReview.rating}/5</span>
                    </div>
                    <Badge className={userReview.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {userReview.status}
                    </Badge>
                  </div>
                  {userReview.title && (
                    <h4 className="font-medium text-gray-900 mb-1">{userReview.title}</h4>
                  )}
                  <p className="text-gray-700 text-sm">{userReview.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reviewed on {new Date(userReview.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : showReviewForm ? (
              <ProductReviewForm 
                productId={productId} 
                onReviewSubmitted={handleReviewSubmitted}
              />
            ) : (
              <div className="text-center">
                <Button 
                  onClick={() => setShowReviewForm(true)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                            alt={review.username}
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
            <Button 
              onClick={() => setShowReviewForm(true)}
              variant="outline"
            >
              Write the First Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 