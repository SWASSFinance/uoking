import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, spawnLocation, description, coordinates, shard } = body

    // Validate required fields
    if (!productId || !spawnLocation) {
      return NextResponse.json(
        { error: 'Product ID and spawn location are required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const productResult = await query(
      'SELECT id, name FROM products WHERE id = $1 AND status = $2',
      [productId, 'active']
    )

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found or not active' },
        { status: 404 }
      )
    }

    // Check if user already submitted for this product
    const existingSubmission = await query(
      'SELECT id, status FROM spawn_location_submissions WHERE product_id = $1 AND user_id = $2',
      [productId, session.user.id]
    )

    if (existingSubmission.rows.length > 0) {
      const submission = existingSubmission.rows[0]
      if (submission.status === 'pending') {
        return NextResponse.json(
          { error: 'You already have a pending submission for this product' },
          { status: 400 }
        )
      } else if (submission.status === 'approved') {
        return NextResponse.json(
          { error: 'You already have an approved submission for this product' },
          { status: 400 }
        )
      }
    }

    // Insert the submission
    const result = await query(
      `INSERT INTO spawn_location_submissions 
       (product_id, user_id, spawn_location, description, coordinates, shard, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, created_at`,
      [productId, session.user.id, spawnLocation, description, coordinates, shard]
    )

    const submission = result.rows[0]

    return NextResponse.json({
      success: true,
      message: 'Spawn location submitted successfully! It will be reviewed by our team.',
      submission: {
        id: submission.id,
        createdAt: submission.created_at
      }
    })

  } catch (error) {
    console.error('Error submitting spawn location:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get user's submission for this product
    const result = await query(
      `SELECT 
        sls.*,
        p.name as product_name,
        p.slug as product_slug
       FROM spawn_location_submissions sls
       JOIN products p ON sls.product_id = p.id
       WHERE sls.product_id = $1 AND sls.user_id = $2`,
      [productId, session.user.id]
    )

    return NextResponse.json({
      submission: result.rows[0] || null
    })

  } catch (error) {
    console.error('Error fetching spawn location submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
