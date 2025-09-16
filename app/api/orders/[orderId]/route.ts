import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.orderId

    // Get user ID
    const userResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Get order details
    const orderResult = await query(`
      SELECT 
        o.*,
        g.name as gift_name
      FROM orders o
      LEFT JOIN gifts g ON o.gift_id = g.id
      WHERE o.id = $1 AND o.user_id = $2
    `, [orderId, userId])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Get order items
    const itemsResult = await query(`
      SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at
    `, [orderId])

    const orderWithItems = {
      ...order,
      items: itemsResult.rows || []
    }

    return NextResponse.json({
      success: true,
      order: orderWithItems
    })

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
