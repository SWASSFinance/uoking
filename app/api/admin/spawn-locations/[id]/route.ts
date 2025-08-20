import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

// Review a spawn location submission (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, reviewNotes } = body

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be "approved" or "rejected"' },
        { status: 400 }
      )
    }

    // Get the submission
    const submissionResult = await query(
      `SELECT 
        sls.*,
        p.name as product_name,
        u.username as user_username
       FROM spawn_location_submissions sls
       JOIN products p ON sls.product_id = p.id
       JOIN users u ON sls.user_id = u.id
       WHERE sls.id = $1`,
      [params.id]
    )

    if (submissionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    const submission = submissionResult.rows[0]

    // Check if already reviewed
    if (submission.status !== 'pending') {
      return NextResponse.json(
        { error: 'Submission has already been reviewed' },
        { status: 400 }
      )
    }

    await query('BEGIN')

    try {
      // Update the submission
      await query(
        `UPDATE spawn_location_submissions 
         SET status = $1, reviewed_by = $2, reviewed_at = NOW(), review_notes = $3, updated_at = NOW()
         WHERE id = $4`,
        [status, session.user.id, reviewNotes, params.id]
      )

      // If approved, award points and update product
      if (status === 'approved') {
        // Award 20 points to the user
        await query(
          `UPDATE user_points 
           SET current_points = current_points + 20, 
               lifetime_points = lifetime_points + 20,
               updated_at = NOW()
           WHERE user_id = $1`,
          [submission.user_id]
        )

        // Update the submission with points awarded
        await query(
          `UPDATE spawn_location_submissions 
           SET points_awarded = 20, points_awarded_at = NOW()
           WHERE id = $1`,
          [params.id]
        )

        // Update the product's spawn location if it's empty or different
        if (!submission.product_spawn_location || submission.product_spawn_location !== submission.spawn_location) {
          await query(
            `UPDATE products 
             SET spawn_location = $1, updated_at = NOW()
             WHERE id = $2`,
            [submission.spawn_location, submission.product_id]
          )
        }
      }

      await query('COMMIT')

      return NextResponse.json({
        success: true,
        message: `Submission ${status} successfully`,
        pointsAwarded: status === 'approved' ? 20 : 0
      })

    } catch (error) {
      await query('ROLLBACK')
      throw error
    }

  } catch (error) {
    console.error('Error reviewing spawn location submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get a specific submission (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const result = await query(
      `SELECT 
        sls.*,
        p.name as product_name,
        p.slug as product_slug,
        p.spawn_location as product_spawn_location,
        u.username as user_username,
        u.email as user_email
       FROM spawn_location_submissions sls
       JOIN products p ON sls.product_id = p.id
       JOIN users u ON sls.user_id = u.id
       WHERE sls.id = $1`,
      [params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      submission: result.rows[0]
    })

  } catch (error) {
    console.error('Error fetching spawn location submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
