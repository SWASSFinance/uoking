"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Star, 
  FolderOpen,
  User,
  Calendar,
  Eye,
  Check,
  X,
  Trash2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CategoryReview {
  id: string
  category_id: string
  user_id: string
  rating: number
  title?: string
  content: string
  status: string
  created_at: string
  category_name: string
  category_image?: string
  user_username: string
  user_email: string
}

export default function AdminCategoryReviewsPage() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<CategoryReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/admin/category-reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load category reviews",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading category reviews:', error)
      toast({
        title: "Error",
        description: "Failed to load category reviews",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/category-reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Category review ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        })
        loadReviews() // Reload the list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || `Failed to ${action} category review`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error ${action}ing category review:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} category review`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this category review? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/category-reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category review deleted successfully",
        })
        loadReviews() // Reload the list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete category review",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting category review:', error)
      toast({
        title: "Error",
        description: "Failed to delete category review",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'pending') return review.status === 'pending'
    if (activeTab === 'approved') return review.status === 'approved'
    if (activeTab === 'rejected') return review.status === 'rejected'
    return true
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center py-12">
              <LoadingSpinner size="lg" text="Loading category reviews..." />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Category Reviews</h1>
            </div>
            <p className="text-gray-600">Manage and approve customer category reviews</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Reviews</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {reviews.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approved Reviews</p>
                    <p className="text-2xl font-bold text-green-600">
                      {reviews.filter(r => r.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rejected Reviews</p>
                    <p className="text-2xl font-bold text-red-600">
                      {reviews.filter(r => r.status === 'rejected').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-blue-600">{reviews.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <CardTitle>Category Review Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pending" className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Pending ({reviews.filter(r => r.status === 'pending').length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Approved ({reviews.filter(r => r.status === 'approved').length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4" />
                    <span>Rejected ({reviews.filter(r => r.status === 'rejected').length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="all" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>All ({reviews.length})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredReviews.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Category Reviews</h3>
                      <p className="text-gray-600">
                        {activeTab === 'pending' && "No pending category reviews to approve"}
                        {activeTab === 'approved' && "No approved category reviews yet"}
                        {activeTab === 'rejected' && "No rejected category reviews"}
                        {activeTab === 'all' && "No category reviews found"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredReviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                          <div className="flex items-start space-x-4">
                            {/* Category Image */}
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {review.category_image ? (
                                <Image
                                  src={review.category_image}
                                  alt={review.category_name}
                                  width={80}
                                  height={80}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FolderOpen className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Review Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-1">
                                    <Link href={`/UO/${review.category_name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-600">
                                      {review.category_name}
                                    </Link>
                                  </h3>
                                  <div className="flex items-center space-x-2 mb-2">
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
                                    <Badge className={getStatusColor(review.status)}>
                                      {review.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  <div className="flex items-center space-x-1 mb-1">
                                    <User className="h-3 w-3" />
                                    <span>{review.user_username || review.user_email}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>

                              {review.title && (
                                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                              )}
                              
                              <p className="text-gray-600 mb-4">{review.content}</p>

                              {/* Action Buttons */}
                              <div className="flex space-x-2">
                                {review.status === 'pending' && (
                                  <>
                                    <Button
                                      onClick={() => handleReviewAction(review.id, 'approve')}
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleReviewAction(review.id, 'reject')}
                                      size="sm"
                                      variant="destructive"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                <Button
                                  onClick={() => handleDeleteReview(review.id)}
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
