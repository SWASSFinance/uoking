"use client"

import { useState, useEffect } from 'react'
import { Star, MessageCircle, Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CategoryReviewForm } from './category-review-form'
import { useSession } from 'next-auth/react'

interface CategoryReviewsProps {
  categoryId: string // This is actually the category slug
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

interface UserReview {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  rating: number
  title?: string
  content: string
  created_at: string
}

export function CategoryReviews({ 
  categoryId, // This is actually the category slug
  initialReviews = [], 
  avgRating = 0, 
  reviewCount = 0 
}: CategoryReviewsProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [userReview, setUserReview] = useState<UserReview | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [checkingUserReview, setCheckingUserReview] = useState(false)

  // Check if user has already submitted a review
  useEffect(() => {
    if (session?.user?.id) {
      checkUserReview()
    }
  }, [session, categoryId])

  const checkUserReview = async () => {
    setCheckingUserReview(true)
    try {
      const response = await fetch(`/api/categories/${categoryId}/reviews/check`)
      if (response.ok) {
        const data = await response.json()
        if (data.hasReview) {
          setUserReview(data.review)
        }
      }
    } catch (error) {
      console.error('Error checking user review:', error)
    } finally {
      setCheckingUserReview(false)
    }
  }

  const handleReviewSubmitted = async () => {
    setShowForm(false)
    // Refresh reviews and user review status
    setIsLoading(true)
    try {
      const [reviewsResponse, userReviewResponse] = await Promise.all([
        fetch(`/api/categories/${categoryId}/reviews`),
        fetch(`/api/categories/${categoryId}/reviews/check`)
      ])
      
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData)
      }
      
      if (userReviewResponse.ok) {
        const userReviewData = await userReviewResponse.json()
        if (userReviewData.hasReview) {
          setUserReview(userReviewData.review)
        }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review'
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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
        
        {/* Show different button based on user review status */}
        {session?.user?.id ? (
          checkingUserReview ? (
            <Button disabled variant="outline">
              Checking...
            </Button>
          ) : userReview ? (
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(userReview.status)} flex items-center space-x-1`}>
                {getStatusIcon(userReview.status)}
                <span>{getStatusText(userReview.status)}</span>
              </Badge>
            </div>
          ) : (
            <Button 
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? "outline" : "default"}
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </Button>
          )
        ) : (
          <Button disabled variant="outline">
            Sign in to Review
          </Button>
        )}
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

      {/* User's Review Status */}
      {userReview && (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(userReview.status)}
              <span>Your Review</span>
              <Badge className={getStatusColor(userReview.status)}>
                {getStatusText(userReview.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= userReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{userReview.rating}/5</span>
              </div>

              {userReview.title && (
                <h4 className="font-medium text-gray-900">{userReview.title}</h4>
              )}
              
              <p className="text-gray-600">{userReview.content}</p>

              <div className="text-sm text-gray-500">
                Submitted on {formatDate(userReview.created_at)}
              </div>

              {userReview.status === 'pending' && (
                <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                  Your review is currently being reviewed by our team. It will be visible once approved.
                </div>
              )}

              {userReview.status === 'rejected' && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  Your review was not approved. Please ensure your review follows our community guidelines.
                </div>
              )}
            </div>
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
            {session?.user?.id && !userReview && !showForm && (
              <Button onClick={() => setShowForm(true)}>
                Write the First Review
              </Button>
            )}
            {!session?.user?.id && (
              <Button disabled variant="outline">
                Sign in to Review
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
