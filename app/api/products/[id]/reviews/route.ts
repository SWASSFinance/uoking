import { NextRequest, NextResponse } from 'next/server'
import { getProductReviews, createProductReview } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await getProductReviews(params.id)
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { rating, title, content } = body

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: 'Review content must be at least 10 characters' },
        { status: 400 }
      )
    }

    const review = await createProductReview({
      productId: params.id,
      userId: session.user.id,
      rating,
      title: title?.trim() || null,
      content: content.trim(),
      status: 'pending' // Will be approved by admin
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    
    // Handle specific error messages for rate limiting
    if (error instanceof Error) {
      if (error.message.includes('maximum limit of 5 pending reviews')) {
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        )
      } else if (error.message.includes('already reviewed this product')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
} 