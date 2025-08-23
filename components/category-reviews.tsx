"use client"

import { useState, useEffect } from 'react'
import { Star, MessageCircle, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CategoryReviewForm } from './category-review-form'

interface CategoryReviewsProps {
  categoryId: string
  initialReviews?: any[]
  avgRating?: number
  reviewCount?: number
}

interface Review {
  id: string
  rating: number
  title?: string
  content: string
  created_at: string
  user_username?: string
  user_email: string
}

export function CategoryReviews({ 
  categoryId, 
  initialReviews = [], 
  avgRating = 0, 
  reviewCount = 0 
}: CategoryReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleReviewSubmitted = async () => {
    setShowForm(false)
    // Refresh reviews
    setIsLoading(true)
    try {
      const response = await fetch(`/api/categories/${categoryId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error refreshing reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDisplayName = (review: Review) => {
    return review.user_username || review.user_email.split('@')[0]
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-lg font-semibold">{avgRating.toFixed(1)}</span>
          </div>
          <div className="text-gray-600">
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </div>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle>Write a Category Review</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryReviewForm 
              categoryId={categoryId} 
              onReviewSubmitted={handleReviewSubmitted}
            />
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-white/90 backdrop-blur-sm border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </div>
                    </div>

                    {review.title && (
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                    )}
                    
                    <p className="text-gray-600 mb-3">{review.content}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{getDisplayName(review)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to review this category and share your experience!
            </p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                Write the First Review
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
