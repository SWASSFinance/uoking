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

    // Validate order ID format (basic UUID validation)
    if (!orderId || typeof orderId !== 'string' || orderId.length < 10) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    // Get user ID from session for additional security
    const userResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Get order details with user ownership verification
    const orderResult = await query(`
      SELECT 
        o.*,
        u.email as user_email,
        u.id as user_id
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1 AND u.id = $2
    `, [orderId, userId])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Additional security: Double-check user ownership
    if (order.user_id !== userId) {
      console.error(`Security violation: User ${userId} attempted to access order ${orderId} owned by user ${order.user_id}`)
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

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

    // Validate order ID format (basic UUID validation)
    if (!orderId || typeof orderId !== 'string' || orderId.length < 10) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    // Get user ID from session for additional security
    const userResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Check if order exists and belongs to the authenticated user
    const orderResult = await query(`
      SELECT 
        o.*,
        u.email as user_email,
        u.id as user_id
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1 AND u.id = $2
    `, [orderId, userId])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Additional security: Double-check user ownership
    if (order.user_id !== userId) {
      console.error(`Security violation: User ${userId} attempted to delete order ${orderId} owned by user ${order.user_id}`)
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if order is pending (protect against deleting completed orders)
    if (order.payment_status !== 'pending') {
      return NextResponse.json({ 
        error: 'Only pending orders can be deleted. Completed or processing orders cannot be deleted.' 
      }, { status: 400 })
    }

    // Check if order is older than 5 minutes
    const orderDate = new Date(order.created_at)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    if (orderDate > fiveMinutesAgo) {
      return NextResponse.json({ 
        error: 'Orders can only be deleted after 5 minutes from creation' 
      }, { status: 400 })
    }

    // Log the deletion attempt for audit purposes
    console.log(`User ${userId} (${session.user.email}) deleting order ${orderId} created at ${order.created_at}`)

    // Delete order items first (due to foreign key constraint)
    const deleteItemsResult = await query(`
      DELETE FROM order_items 
      WHERE order_id = $1
    `, [orderId])

    // Delete the order
    const deleteOrderResult = await query(`
      DELETE FROM orders 
      WHERE id = $1 AND user_id = $2
    `, [orderId, userId])

    // Verify deletion was successful
    if (deleteOrderResult.rowCount === 0) {
      console.error(`Failed to delete order ${orderId} for user ${userId}`)
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
    }

    console.log(`Successfully deleted order ${orderId} for user ${userId}`)

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