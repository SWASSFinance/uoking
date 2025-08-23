import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dngclyzkj',
  api_key: process.env.CLOUDINARY_API_KEY || '827585767246395',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'q4JyvKJGRoyoI0AJ3fxgR8p8nNA'
})

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

    const submissionId = params.id
    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    // Update submission status
    const result = await query(`
      UPDATE product_image_submissions 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [newStatus, submissionId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Image submission not found' },
        { status: 404 }
      )
    }

    // If approving, add 30 points to user
    if (action === 'approve') {
      const submission = result.rows[0]
      
      try {
        // Add 30 points for approved image submission
        const pointsToAdd = 30
        
        // Update user points
        await query(`
          UPDATE users 
          SET total_points_earned = COALESCE(total_points_earned, 0) + $1
          WHERE id = $2
        `, [pointsToAdd, submission.user_id])
        
        // Also update user_points table
        await query(`
          INSERT INTO user_points (user_id, current_points, lifetime_points)
          VALUES ($1, $2, $2)
          ON CONFLICT (user_id) 
          DO UPDATE SET 
            current_points = user_points.current_points + $2,
            lifetime_points = user_points.lifetime_points + $2
        `, [submission.user_id, pointsToAdd])
        
      } catch (error) {
        console.warn('Could not update user points (columns may not exist):', error)
        // Continue without failing the approval
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Image submission ${action}d successfully`,
      submission: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating image submission:', error)
    return NextResponse.json(
      { error: 'Failed to update image submission' },
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

    const submissionId = params.id

    // Get submission details before deletion
    const submissionResult = await query(`
      SELECT user_id, cloudinary_public_id, status FROM product_image_submissions WHERE id = $1
    `, [submissionId])

    if (submissionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Image submission not found' },
        { status: 404 }
      )
    }

    const submission = submissionResult.rows[0]

    // Delete the submission
    const deleteResult = await query(`
      DELETE FROM product_image_submissions WHERE id = $1
    `, [submissionId])

    if (deleteResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete image submission' },
        { status: 500 }
      )
    }

    // If the submission was approved, deduct 30 points from user
    if (submission.status === 'approved') {
      try {
        const pointsToDeduct = 30
        
        // Update user points
        await query(`
          UPDATE users 
          SET total_points_earned = GREATEST(COALESCE(total_points_earned, 0) - $1, 0)
          WHERE id = $2
        `, [pointsToDeduct, submission.user_id])
        
        // Also update user_points table
        await query(`
          UPDATE user_points 
          SET current_points = GREATEST(current_points - $1, 0),
              lifetime_points = GREATEST(lifetime_points - $1, 0)
          WHERE user_id = $2
        `, [pointsToDeduct, submission.user_id])
        
      } catch (error) {
        console.warn('Could not update user points (columns may not exist):', error)
        // Continue without failing the deletion
      }
    }

    // If there's a Cloudinary image, delete it too
    if (submission.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(submission.cloudinary_public_id)
        console.log(`Deleted Cloudinary image: ${submission.cloudinary_public_id}`)
      } catch (cloudinaryError) {
        console.error('Error deleting Cloudinary image:', cloudinaryError)
        // Don't fail the request if Cloudinary deletion fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Image submission deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting image submission:', error)
    return NextResponse.json(
      { error: 'Failed to delete image submission' },
      { status: 500 }
    )
  }
}
