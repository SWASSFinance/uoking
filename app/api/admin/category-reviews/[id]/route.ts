import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { createNoCacheResponse } from '@/lib/api-utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: reviewId } = await params
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }
    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    // Update review status
    const result = await query(`
      UPDATE category_reviews 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [newStatus, reviewId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category review not found' },
        { status: 404 }
      )
    }

    // If approving, update user review counts and add points
    if (action === 'approve') {
      const review = result.rows[0]
      
      try {
        // Calculate points to add
        let pointsToAdd = 10 // Base points for review
        
        if (review.rating) {
          pointsToAdd += 5 // Points for rating
        }
        
        // Update user review counts and add points
        await query(`
          UPDATE users 
          SET review_count = COALESCE(review_count, 0) + 1,
              rating_count = COALESCE(rating_count, 0) + CASE WHEN $1 IS NOT NULL THEN 1 ELSE 0 END,
              total_points_earned = COALESCE(total_points_earned, 0) + $2
          WHERE id = $3
        `, [review.rating, pointsToAdd, review.user_id])
        
        // Also update user_points table
        await query(`
          INSERT INTO user_points (user_id, current_points, lifetime_points)
          VALUES ($1, $2, $2)
          ON CONFLICT (user_id) 
          DO UPDATE SET 
            current_points = user_points.current_points + $2,
            lifetime_points = user_points.lifetime_points + $2
        `, [review.user_id, pointsToAdd])
        
      } catch (error) {
        console.warn('Could not update user review counts or points (columns may not exist):', error)
        // Continue without failing the approval
      }
    }

    return createNoCacheResponse({ 
      success: true, 
      message: `Category review ${action}d successfully`,
      review: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating category review:', error)
    return NextResponse.json(
      { error: 'Failed to update category review' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: reviewId } = await params
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    // Get review details before deletion for user count updates
    const reviewResult = await query(`
      SELECT user_id, rating, status FROM category_reviews WHERE id = $1
    `, [reviewId])

    if (reviewResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category review not found' },
        { status: 404 }
      )
    }

    const review = reviewResult.rows[0]

    // Delete the review
    const deleteResult = await query(`
      DELETE FROM category_reviews WHERE id = $1
    `, [reviewId])

    if (deleteResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete category review' },
        { status: 500 }
      )
    }

    // If the review was approved, update user review counts and deduct points
    if (review.status === 'approved') {
      try {
        // Calculate points to deduct
        let pointsToDeduct = 10 // Base points for review
        
        if (review.rating) {
          pointsToDeduct += 5 // Points for rating
        }
        
        // Update user review counts and deduct points
        await query(`
          UPDATE users 
          SET review_count = GREATEST(COALESCE(review_count, 0) - 1, 0),
              rating_count = GREATEST(COALESCE(rating_count, 0) - CASE WHEN $1 IS NOT NULL THEN 1 ELSE 0 END, 0),
              total_points_earned = GREATEST(COALESCE(total_points_earned, 0) - $2, 0)
          WHERE id = $3
        `, [review.rating, pointsToDeduct, review.user_id])
        
        // Also update user_points table
        await query(`
          UPDATE user_points 
          SET current_points = GREATEST(current_points - $1, 0),
              lifetime_points = GREATEST(lifetime_points - $1, 0)
          WHERE user_id = $2
        `, [pointsToDeduct, review.user_id])
        
      } catch (error) {
        console.warn('Could not update user review counts or points (columns may not exist):', error)
        // Continue without failing the deletion
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Category review deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category review:', error)
    return NextResponse.json(
      { error: 'Failed to delete category review' },
      { status: 500 }
    )
  }
}
