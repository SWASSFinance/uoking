import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()

    // Get user orders with item counts using validated user ID
    // This ensures we only return orders for the authenticated user
    const result = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.total_amount,
        o.created_at,
        g.name as gift_name,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN gifts g ON o.gift_id = g.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id, o.order_number, o.status, o.total_amount, o.created_at, g.name
      ORDER BY o.created_at DESC
    `, [validatedUser.id])

    return NextResponse.json({
      orders: result.rows || []
    })

  } catch (error) {
    console.error('Error fetching user orders:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user orders' },
      { status: 500 }
    )
  }
} 