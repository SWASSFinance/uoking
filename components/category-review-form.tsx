"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'

interface CategoryReviewFormProps {
  categoryId: string
  onReviewSubmitted: () => void
}

export function CategoryReviewForm({ categoryId, onReviewSubmitted }: CategoryReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating.",
        variant: "destructive",
      })
      return
    }

    if (content.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please write at least 10 characters for your review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/categories/${categoryId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          title: title.trim() || null,
          content: content.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit review')
      }

      toast({
        title: "Review Submitted",
        description: "Your category review has been submitted and is pending approval.",
        variant: "default",
      })

      // Reset form
      setRating(0)
      setTitle('')
      setContent('')
      onReviewSubmitted()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please log in to write a category review.</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {rating === 0 && 'Click to rate'}
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review Title (Optional)
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience with this category"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review *
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this category..."
          rows={4}
          maxLength={1000}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          {content.length}/1000 characters
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0 || content.trim().length < 10}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Category Review'}
      </Button>
    </form>
  )
}
