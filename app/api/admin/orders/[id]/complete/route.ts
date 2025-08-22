import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { sendOrderCompletedEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminResult = await query(`
      SELECT id, is_admin FROM users WHERE email = $1
    `, [session.user.email])

    if (!adminResult.rows || adminResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!adminResult.rows[0].is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get order details
    const orderResult = await query(`
      SELECT 
        o.*,
        u.email as user_email,
        u.first_name,
        u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [orderId])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const order = orderResult.rows[0]

    // Check if order is already completed
    if (order.status === 'completed') {
      return NextResponse.json(
        { error: 'Order is already completed' },
        { status: 400 }
      )
    }

    // Check if order is paid
    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: 'Order must be paid before marking as completed' },
        { status: 400 }
      )
    }

    // Update order status to completed
    await query(`
      UPDATE orders 
      SET 
        status = 'completed',
        completed_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
    `, [orderId])

    // Send order completed email
    try {
      await sendOrderCompletedEmail({
        orderId: order.id,
        customerName: order.customer_name || `${order.first_name} ${order.last_name}`.trim() || 'Customer',
        email: order.user_email,
        deliveryCharacter: order.delivery_character,
        shard: order.shard
      })
    } catch (emailError) {
      console.error('Failed to send order completed email:', emailError)
      // Don't fail the operation if email fails
    }

    // Get updated order info
    const updatedOrderResult = await query(`
      SELECT 
        o.*,
        u.email as user_email,
        u.first_name,
        u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [orderId])

    return NextResponse.json({
      success: true,
      message: 'Order marked as completed successfully',
      order: updatedOrderResult.rows[0]
    })

  } catch (error) {
    console.error('Error completing order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
