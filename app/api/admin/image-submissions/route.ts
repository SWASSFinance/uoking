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

    // Fetch all image submissions with product and user information
    const result = await query(`
      SELECT 
        pis.id,
        pis.product_id,
        pis.user_id,
        pis.image_url,
        pis.cloudinary_public_id,
        pis.status,
        pis.created_at,
        p.name as product_name,
        p.image_url as product_image,
        u.username as user_username,
        u.email as user_email
      FROM product_image_submissions pis
      JOIN products p ON pis.product_id = p.id
      JOIN users u ON pis.user_id = u.id
      ORDER BY pis.created_at DESC
    `)

    return NextResponse.json({ submissions: result.rows })
  } catch (error) {
    console.error('Error fetching image submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image submissions' },
      { status: 500 }
    )
  }
}
