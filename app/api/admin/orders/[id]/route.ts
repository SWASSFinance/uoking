import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== STARTING ORDER DETAILS API ===')
    console.log('🌐 Request URL:', request.url)
    console.log('🌐 Request method:', request.method)
    
    // Step 1: Extract params
    let orderId: string
    try {
      const { id } = await params
      orderId = id
      console.log('✅ Params extracted successfully. Order ID:', orderId)
    } catch (paramError) {
      console.error('❌ Error extracting params:', paramError)
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }
    
    // Step 2: Get session
    let session: any
    try {
      session = await auth()
      console.log('✅ Session retrieved:', session ? 'Found' : 'Not found')
      console.log('User email:', session?.user?.email)
    } catch (sessionError) {
      console.error('❌ Error getting session:', sessionError)
      return NextResponse.json({ error: 'Session error' }, { status: 500 })
    }
    
    if (!session?.user?.email) {
      console.log('❌ Unauthorized - No session or email')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 3: Check admin status
    let userResult: any
    try {
      console.log('Checking admin status for user:', session.user.email)
      userResult = await query(`
        SELECT id, is_admin FROM users WHERE email = $1
      `, [session.user.email])
      console.log('✅ User query successful:', userResult.rows?.length || 0, 'rows')
    } catch (userError) {
      console.error('❌ Error checking user admin status:', userError)
      return NextResponse.json({ error: 'Database error checking user' }, { status: 500 })
    }

    if (!userResult.rows || userResult.rows.length === 0) {
      console.log('❌ User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!userResult.rows[0].is_admin) {
      console.log('❌ User is not admin')
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('✅ User is admin, proceeding with order lookup')

    // Step 4: Get order details
    let orderResult: any
    try {
      console.log('Fetching order details for ID:', orderId)
      orderResult = await query(`
        SELECT 
          o.*,
          u.email as user_email,
          u.username,
          u.first_name,
          u.last_name,
          u.character_names,
          g.name as gift_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN gifts g ON o.gift_id = g.id
        WHERE o.id = $1
      `, [orderId])
      console.log('✅ Order query successful:', orderResult.rows?.length || 0, 'rows')
    } catch (orderError) {
      console.error('❌ Error fetching order details:', orderError)
      return NextResponse.json({ error: 'Database error fetching order' }, { status: 500 })
    }

    if (!orderResult.rows || orderResult.rows.length === 0) {
      console.log('❌ Order not found in database')
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.rows[0]
    console.log('✅ Order found:', order.id, 'Status:', order.status)
    console.log('💰 Order financial data:', {
      subtotal: order.subtotal,
      total_amount: order.total_amount,
      discount_amount: order.discount_amount,
      cashback_used: order.cashback_used,
      subtotal_type: typeof order.subtotal,
      total_amount_type: typeof order.total_amount
    })

    // Step 5: Get order items with categories
    let itemsResult: any
    try {
      console.log('Fetching order items for order ID:', orderId)
      itemsResult = await query(`
        SELECT 
          oi.*,
          p.name as product_name,
          p.slug as product_slug,
          p.image_url as product_image,
          p.admin_notes as product_admin_notes,
          STRING_AGG(DISTINCT c.name, ', ') as category
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        WHERE oi.order_id = $1
        GROUP BY oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price, oi.total_price, oi.created_at, p.name, p.slug, p.image_url, p.admin_notes
        ORDER BY oi.created_at
      `, [orderId])
      console.log('✅ Order items query successful:', itemsResult.rows?.length || 0, 'rows')
    } catch (itemsError) {
      console.error('❌ Error fetching order items:', itemsError)
      return NextResponse.json({ error: 'Database error fetching order items' }, { status: 500 })
    }

    const orderItems = itemsResult.rows || []

    console.log('✅ Successfully returning order data')
    return NextResponse.json({
      order: {
        ...order,
        items: orderItems
      }
    })

  } catch (error) {
    console.error('=== CRITICAL ERROR IN ORDER DETAILS API ===')
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : 'No message')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    
    // Return more detailed error information in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to fetch order details: ${error instanceof Error ? error.message : 'Unknown error'}`
      : 'Failed to fetch order details'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
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