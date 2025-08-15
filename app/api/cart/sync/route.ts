import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { Cart } from '@/lib/cart'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { cart, cashbackAmount = 0 }: { cart: Cart, cashbackAmount?: number } = await request.json()

    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Get user ID and cashback balance
    const userResult = await query(`
      SELECT u.id, up.referral_cash 
      FROM users u 
      LEFT JOIN user_points up ON u.id = up.user_id 
      WHERE u.email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userResult.rows[0].id
    const currentCashbackBalance = parseFloat(userResult.rows[0].referral_cash || 0)

    // Validate cashback amount
    if (cashbackAmount > currentCashbackBalance) {
      return NextResponse.json(
        { error: 'Insufficient cashback balance' },
        { status: 400 }
      )
    }

    if (cashbackAmount > cart.total) {
      return NextResponse.json(
        { error: 'Cashback amount cannot exceed cart total' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `UOK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate final amounts
    const subtotal = cart.total
    const discountAmount = cashbackAmount
    const totalAmount = subtotal - discountAmount

    // Create order
    const orderResult = await query(`
      INSERT INTO orders (
        user_id, 
        order_number, 
        status, 
        subtotal,
        discount_amount,
        total_amount, 
        currency,
        payment_status,
        delivery_status,
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING id
    `, [userId, orderNumber, 'pending', subtotal, discountAmount, totalAmount, 'USD', 'pending', 'pending'])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    const orderId = orderResult.rows[0].id

    // Insert cart items
    for (const item of cart.items) {
      await query(`
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          quantity,
          unit_price,
          total_price,
          product_snapshot,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `, [
        orderId,
        item.id,
        item.name,
        item.quantity,
        item.price,
        item.price * item.quantity,
        JSON.stringify({
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          category: item.category
        })
      ])
    }

    // Update cashback balance if used
    if (cashbackAmount > 0) {
      await query(`
        UPDATE user_points 
        SET referral_cash = referral_cash - $1, updated_at = NOW()
        WHERE user_id = $2
      `, [cashbackAmount, userId])
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      cashbackUsed: cashbackAmount,
      finalTotal: totalAmount,
      message: 'Cart synced successfully'
    })

  } catch (error) {
    console.error('Error syncing cart:', error)
    return NextResponse.json(
      { error: 'Failed to sync cart' },
      { status: 500 }
    )
  }
} 