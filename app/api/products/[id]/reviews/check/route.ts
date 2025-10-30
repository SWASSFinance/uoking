import { NextRequest, NextResponse } from 'next/server'
import { hasUserReviewedProduct } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const existingReview = await hasUserReviewedProduct(session.user.id, id)

    return NextResponse.json({
      hasReviewed: !!existingReview,
      review: existingReview
    })
  } catch (error) {
    console.error('Error checking user review:', error)
    return NextResponse.json(
      { error: 'Failed to check review status' },
      { status: 500 }
    )
  }
} 