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

    // Check if user is admin
    const userResult = await query(`
      SELECT id, is_admin FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!userResult.rows[0].is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const orderId = params.id

    // Get order details
    const orderResult = await query(`
      SELECT 
        o.*,
        u.email as user_email,
        u.username,
        u.first_name,
        u.last_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [orderId])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Get order items
    const itemsResult = await query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image,
        p.category as category
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const userResult = await query(`
      SELECT id, is_admin FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!userResult.rows[0].is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const orderId = params.id
    const body = await request.json()
    const { status, payment_status, admin_notes } = body

    // Get current order details
    const orderResult = await query(`
      SELECT * FROM orders WHERE id = $1
    `, [orderId])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const currentOrder = orderResult.rows[0]

    // Update order
    const updateResult = await query(`
      UPDATE orders 
      SET 
        status = COALESCE($1, status),
        payment_status = COALESCE($2, payment_status),
        admin_notes = COALESCE($3, admin_notes),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [status, payment_status, admin_notes, orderId])

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      order: updateResult.rows[0] 
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
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

    // Check if user is admin
    const userResult = await query(`
      SELECT id, is_admin FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!userResult.rows[0].is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const orderId = params.id

    // Get order details before deletion
    const orderResult = await query(`
      SELECT 
        o.*,
        u.id as user_id,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [orderId])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Handle refunds for completed orders
    if (order.payment_status === 'completed') {
      // Return cashback if used
      if (parseFloat(order.cashback_used || '0') > 0) {
        await query(`
          UPDATE users 
          SET referral_cash = referral_cash + $1
          WHERE id = $2
        `, [order.cashback_used, order.user_id])
      }

      // Remove points if granted for this order
      // This would need to be tracked in a separate table or order_items
      // For now, we'll just log the refund
      console.log(`Refunding cashback ${order.cashback_used} to user ${order.user_id} for order ${orderId}`)
    }

    // Delete order items first (due to foreign key constraint)
    await query(`
      DELETE FROM order_items 
      WHERE order_id = $1
    `, [orderId])

    // Delete the order
    const deleteOrderResult = await query(`
      DELETE FROM orders 
      WHERE id = $1
    `, [orderId])

    if (deleteOrderResult.rowCount === 0) {
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
    }

    console.log(`Admin ${session.user.email} deleted order ${orderId}`)

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