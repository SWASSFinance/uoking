import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
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

    // Fetch all category reviews with category and user information
    const result = await query(`
      SELECT 
        cr.id,
        cr.category_id,
        cr.user_id,
        cr.rating,
        cr.title,
        cr.content,
        cr.status,
        cr.created_at,
        c.name as category_name,
        c.image_url as category_image,
        u.username as user_username,
        u.email as user_email
      FROM category_reviews cr
      JOIN categories c ON cr.category_id = c.id
      JOIN users u ON cr.user_id = u.id
      ORDER BY cr.created_at DESC
    `)

    return NextResponse.json({ reviews: result.rows })
  } catch (error) {
    console.error('Error fetching category reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category reviews' },
      { status: 500 }
    )
  }
}
