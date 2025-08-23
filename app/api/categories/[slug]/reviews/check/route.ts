import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
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
    
    // Check if user has already reviewed this category
    const reviewResult = await query(`
      SELECT id, status, rating, title, content, created_at 
      FROM category_reviews 
      WHERE category_id = $1 AND user_id = $2
    `, [categoryId, session.user.id])
    
    if (reviewResult.rows.length > 0) {
      const review = reviewResult.rows[0]
      return NextResponse.json({
        hasReview: true,
        review: {
          id: review.id,
          status: review.status,
          rating: review.rating,
          title: review.title,
          content: review.content,
          created_at: review.created_at
        }
      })
    }
    
    return NextResponse.json({
      hasReview: false,
      review: null
    })
  } catch (error) {
    console.error('Error checking category review:', error)
    return NextResponse.json(
      { error: 'Failed to check category review' },
      { status: 500 }
    )
  }
}
