import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const userResult = await query('SELECT is_admin FROM users WHERE email = $1', [session.user.email])
    
    if (!userResult.rows.length || !userResult.rows[0].is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action } = body

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    const reviewId = params.id
    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    // Update review status
    const result = await query(`
      UPDATE product_reviews 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [newStatus, reviewId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // If approving, update user review counts
    if (action === 'approve') {
      const review = result.rows[0]
      
      try {
        // Try to update user's review count (columns might not exist in all schemas)
        await query(`
          UPDATE users 
          SET review_count = COALESCE(review_count, 0) + 1,
              rating_count = COALESCE(rating_count, 0) + CASE WHEN $1 IS NOT NULL THEN 1 ELSE 0 END
          WHERE id = $2
        `, [review.rating, review.user_id])
      } catch (error) {
        console.warn('Could not update user review counts (columns may not exist):', error)
        // Continue without failing the approval
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Review ${action}d successfully`,
      review: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const userResult = await query('SELECT is_admin FROM users WHERE email = $1', [session.user.email])
    
    if (!userResult.rows.length || !userResult.rows[0].is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const reviewId = params.id

    // Get review details before deletion for user count updates
    const reviewResult = await query(`
      SELECT user_id, rating, status FROM product_reviews WHERE id = $1
    `, [reviewId])

    if (reviewResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    const review = reviewResult.rows[0]

    // Delete the review
    const deleteResult = await query(`
      DELETE FROM product_reviews WHERE id = $1
    `, [reviewId])

    if (deleteResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      )
    }

    // If the review was approved, update user review counts
    if (review.status === 'approved') {
      try {
        await query(`
          UPDATE users 
          SET review_count = GREATEST(COALESCE(review_count, 0) - 1, 0),
              rating_count = GREATEST(COALESCE(rating_count, 0) - CASE WHEN $1 IS NOT NULL THEN 1 ELSE 0 END, 0)
          WHERE id = $2
        `, [review.rating, review.user_id])
      } catch (error) {
        console.warn('Could not update user review counts (columns may not exist):', error)
        // Continue without failing the deletion
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Review deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
} 