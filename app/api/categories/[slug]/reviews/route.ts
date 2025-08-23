import { NextRequest, NextResponse } from 'next/server'
import { getCategoryReviews, createCategoryReview, query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const reviews = await getCategoryReviews(slug)
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching category reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category reviews' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params
    
    // Get category ID from slug
    const categoryResult = await query(`
      SELECT id FROM categories WHERE slug = $1
    `, [slug])
    
    if (categoryResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    const categoryId = categoryResult.rows[0].id
    
    const review = await createCategoryReview({
      categoryId: categoryId,
      userId: session.user.id,
      rating,
      title: title?.trim() || null,
      content: content.trim(),
      status: 'pending' // Will be approved by admin
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating category review:', error)
    
    // Handle specific error messages for rate limiting
    if (error instanceof Error) {
      if (error.message.includes('maximum limit of 5 pending reviews')) {
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        )
      } else if (error.message.includes('already reviewed this category')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create category review' },
      { status: 500 }
    )
  }
}
