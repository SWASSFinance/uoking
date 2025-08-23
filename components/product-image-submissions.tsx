"use client"

import { useState, useEffect } from 'react'
import { Image as ImageIcon, User, Calendar, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductImageSubmissionForm } from './product-image-submission-form'

interface ProductImageSubmissionsProps {
  productId: string
  initialSubmissions?: any[]
}

interface Submission {
  id: string
  image_url: string
  created_at: string
  user_username?: string
  user_email: string
}

export function ProductImageSubmissions({ 
  productId, 
  initialSubmissions = []
}: ProductImageSubmissionsProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageSubmitted = async () => {
    setShowForm(false)
    // Refresh submissions
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}/images`)
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error('Error refreshing submissions:', error)
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

  const getDisplayName = (submission: Submission) => {
    return submission.user_username || submission.user_email.split('@')[0]
  }

  return (
    <div className="space-y-6">
      {/* Submissions Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">User Images</span>
          </div>
          <div className="text-gray-600">
            {submissions.length} {submissions.length === 1 ? 'image' : 'images'}
          </div>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
        >
          {showForm ? 'Cancel' : 'Submit Image'}
        </Button>
      </div>

      {/* Image Submission Form */}
      {showForm && (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle>Submit Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductImageSubmissionForm 
              productId={productId} 
              onImageSubmitted={handleImageSubmitted}
            />
          </CardContent>
        </Card>
      )}

      {/* Submissions Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading images...</p>
        </div>
      ) : submissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <Card key={submission.id} className="bg-white/90 backdrop-blur-sm border-amber-200 overflow-hidden">
              <div className="relative">
                <img
                  src={submission.image_url}
                  alt="User submitted product image"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-3 w-3" />
                      <span>{getDisplayName(submission)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(submission.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Submitted by {getDisplayName(submission)}</span>
                  <span className="text-xs">{formatDate(submission.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No User Images Yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to submit an image for this product and earn 30 points when approved!
            </p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                Submit the First Image
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
