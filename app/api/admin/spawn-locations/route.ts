import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

// Get all spawn location submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Get submissions with product and user info
    const result = await query(
      `SELECT 
        sls.*,
        p.name as product_name,
        p.slug as product_slug,
        u.username as user_username,
        u.email as user_email
       FROM spawn_location_submissions sls
       JOIN products p ON sls.product_id = p.id
       JOIN users u ON sls.user_id = u.id
       WHERE sls.status = $1
       ORDER BY sls.created_at DESC
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    )

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM spawn_location_submissions WHERE status = $1',
      [status]
    )

    return NextResponse.json({
      submissions: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching spawn location submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
