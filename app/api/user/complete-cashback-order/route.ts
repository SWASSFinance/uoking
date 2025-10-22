import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateSession, getAuthErrorResponse, validateResourceOwnership } from '@/lib/auth-security'

export async function POST(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    const userId = validatedUser.id

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get order details and verify it belongs to the user
    const orderResult = await query(`
      SELECT id, total_amount, cashback_used, payment_status, status
      FROM orders 
      WHERE id = $1 AND user_id = $2
    `, [orderId, userId])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      )
    }

    const order = orderResult.rows[0]

    // Additional security: Validate resource ownership
    try {
      validateResourceOwnership(userId, order.user_id || userId)
    } catch (error) {
      console.error(`Security violation: User ${userId} attempted to complete order ${orderId}`)
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Verify the order is pending payment
    if (order.payment_status !== 'pending') {
      return NextResponse.json(
        { error: 'Order is not in pending payment status' },
        { status: 400 }
      )
    }

    // Verify this is a cashback-only order (total amount should be 0 or very close to 0)
    const totalAmount = parseFloat(order.total_amount)
    if (totalAmount > 0.01) {
      return NextResponse.json(
        { error: 'This order cannot be completed with cashback only. Please use PayPal checkout.' },
        { status: 400 }
      )
    }

    // Verify cashback amount matches the order total
    const cashbackUsed = parseFloat(order.cashback_used)
    if (cashbackUsed <= 0) {
      return NextResponse.json(
        { error: 'No cashback was used for this order' },
        { status: 400 }
      )
    }

    // Get current cashback balance
    const balanceResult = await query(`
      SELECT referral_cash FROM user_points WHERE user_id = $1
    `, [userId])

    if (!balanceResult.rows || balanceResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User points record not found' },
        { status: 404 }
      )
    }

    const currentBalance = parseFloat(balanceResult.rows[0].referral_cash || 0)

    // Verify sufficient cashback balance
    if (currentBalance < cashbackUsed) {
      return NextResponse.json(
        { error: `Insufficient cashback balance. Required: $${cashbackUsed.toFixed(2)}, Available: $${currentBalance.toFixed(2)}` },
        { status: 400 }
      )
    }

    // Begin transaction
    await query('BEGIN')

    try {
      // Deduct cashback from user's balance
      await query(`
        UPDATE user_points 
        SET referral_cash = referral_cash - $1, updated_at = NOW()
        WHERE user_id = $2
      `, [cashbackUsed, userId])

      // Update order status - payment completed, order processing
      await query(`
        UPDATE orders 
        SET payment_status = 'completed',
            status = 'processing',
            payment_method = 'cashback',
            updated_at = NOW()
        WHERE id = $1 AND user_id = $2
      `, [orderId, userId])

      // Commit transaction
      await query('COMMIT')

      return NextResponse.json({
        success: true,
        message: 'Order completed successfully with cashback',
        orderId: orderId,
        cashbackUsed: cashbackUsed,
        newBalance: currentBalance - cashbackUsed
      })

    } catch (error) {
      // Rollback transaction on error
      await query('ROLLBACK')
      throw error
    }

  } catch (error) {
    console.error('Error completing cashback order:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to complete order with cashback' },
      { status: 500 }
    )
  }
}
