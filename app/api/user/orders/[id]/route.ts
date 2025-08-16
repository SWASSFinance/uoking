import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.id

    // Get order details
    const orderResult = await query(`
      SELECT 
        o.*,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1 AND u.email = $2
    `, [orderId, session.user.email])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Get order items
    const itemsResult = await query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at
    `, [orderId])

    const orderItems = itemsResult.rows || []

    return NextResponse.json({
      order: {
        ...order,
        items: orderItems
      }
    })

  } catch (error) {
    console.error('Error fetching order details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.id

    // Check if order exists and belongs to user, and is pending and older than 5 minutes
    const orderResult = await query(`
      SELECT 
        o.*,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1 AND u.email = $2
    `, [orderId, session.user.email])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Check if order is pending
    if (order.payment_status !== 'pending') {
      return NextResponse.json({ error: 'Only pending orders can be deleted' }, { status: 400 })
    }

    // Check if order is older than 5 minutes
    const orderDate = new Date(order.created_at)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    if (orderDate > fiveMinutesAgo) {
      return NextResponse.json({ error: 'Orders can only be deleted after 5 minutes' }, { status: 400 })
    }

    // Delete order items first (due to foreign key constraint)
    await query(`
      DELETE FROM order_items 
      WHERE order_id = $1
    `, [orderId])

    // Delete the order
    await query(`
      DELETE FROM orders 
      WHERE id = $1
    `, [orderId])

    return NextResponse.json({ 
      success: true, 
      message: 'Order deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
} 