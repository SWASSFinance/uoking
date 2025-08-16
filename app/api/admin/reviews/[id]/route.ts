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
      
      // Update user's review count
      await query(`
        UPDATE users 
        SET review_count = review_count + 1,
            rating_count = rating_count + CASE WHEN $1 IS NOT NULL THEN 1 ELSE 0 END
        WHERE id = $2
      `, [review.rating, review.user_id])
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