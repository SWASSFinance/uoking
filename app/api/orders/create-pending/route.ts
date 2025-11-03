import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { cartItems, cashbackToUse, selectedShard, couponCode, giftId, paymentMethod } = body

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!selectedShard) {
      return NextResponse.json({ error: 'Shard selection required' }, { status: 400 })
    }

    // Validate cart items
    for (const item of cartItems) {
      if (!item.id || !item.name || !item.price || !item.quantity) {
        return NextResponse.json({ 
          error: 'Invalid cart item data', 
          details: `Missing required fields for item: ${item.name || 'unknown'}` 
        }, { status: 400 })
      }
    }

    // Check if user exists in database
    const userCheckResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [session.user.email])
    
    if (!userCheckResult.rows || userCheckResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }
    
    const userId = userCheckResult.rows[0].id

    // Validate cashback amount against user's available balance
    if (cashbackToUse > 0) {
      const userPointsResult = await query(`
        SELECT up.referral_cash,
               COALESCE(SUM(o.cashback_used), 0) as pending_cashback
        FROM user_points up
        LEFT JOIN orders o ON o.user_id = up.user_id 
          AND o.payment_status = 'pending' 
          AND o.cashback_used > 0
        WHERE up.user_id = $1
        GROUP BY up.referral_cash
      `, [userId])

      if (!userPointsResult.rows || userPointsResult.rows.length === 0) {
        return NextResponse.json({ error: 'User points not found' }, { status: 404 })
      }

      const userPoints = userPointsResult.rows[0]
      const rawCashbackBalance = parseFloat(userPoints.referral_cash || 0)
      const pendingCashback = parseFloat(userPoints.pending_cashback || 0)
      const availableCashback = Math.max(0, rawCashbackBalance - pendingCashback)

      if (cashbackToUse > availableCashback) {
        return NextResponse.json({ 
          error: 'Insufficient cashback balance. Available: $' + availableCashback.toFixed(2) 
        }, { status: 400 })
      }
    }

    // Calculate totals
    let subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    let discount = 0
    let premiumDiscount = 0
    let finalTotal = subtotal - cashbackToUse

    // Check if user is premium and apply premium discount
    const userResult = await query(`
      SELECT account_rank FROM users WHERE email = $1
    `, [session.user.email])

    const isPremiumUser = userResult.rows[0]?.account_rank === 1

    if (isPremiumUser) {
      // Get premium discount percentage from settings
      const premiumSettingsResult = await query(`
        SELECT setting_value FROM site_settings WHERE setting_key = 'premium_discount_percentage'
      `)
      
      const discountPercentage = premiumSettingsResult.rows[0]?.setting_value || 10
      premiumDiscount = (subtotal * parseFloat(discountPercentage)) / 100
      finalTotal -= premiumDiscount
    }

    // Apply coupon if provided
    if (couponCode) {
      const couponResult = await query(`
        SELECT * FROM coupons 
        WHERE code = $1 
        AND is_active = true 
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (usage_limit IS NULL OR usage_count < usage_limit)
      `, [couponCode])

      if (couponResult.rows && couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0]
        
        // Check minimum order amount
        if (!coupon.minimum_order_amount || subtotal >= parseFloat(coupon.minimum_order_amount)) {
          if (coupon.discount_type === 'percentage') {
            discount = (subtotal * parseFloat(coupon.discount_value)) / 100
          } else {
            discount = parseFloat(coupon.discount_value)
          }
          finalTotal -= discount
        }
      }
    }

    // Ensure final total is not negative
    finalTotal = Math.max(0, finalTotal)

    // Generate unique order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase()

    // Create order in database with pending payment status
    const orderResult = await query(`
      INSERT INTO orders (
        order_number, user_id, status, payment_status, delivery_status,
        subtotal, discount_amount, premium_discount, cashback_used, total_amount,
        currency, payment_method, delivery_shard, delivery_character, 
        customer_notes, admin_notes, coupon_code, gift_id,
        created_at, updated_at
      ) VALUES (
        $1, $2, 'pending', 'pending', 'pending',
        $3, $4, $5, $6, $7,
        'USD', $8, $9, $10, $11, $12, $13, $14,
        NOW(), NOW()
      ) RETURNING id
    `, [
      orderNumber, userId, subtotal.toFixed(2), discount.toFixed(2), 
      premiumDiscount.toFixed(2), cashbackToUse.toFixed(2), finalTotal.toFixed(2),
      'manual_payment', selectedShard, '', '', '', couponCode || null, giftId || null
    ])

    const orderId = orderResult.rows[0].id

    // OPTIMIZED: Batch insert order items in a single query
    if (cartItems.length > 0) {
      const values: string[] = []
      const params: any[] = []
      let paramIndex = 1

      for (const item of cartItems) {
        const isCustomProduct = !item.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        const productId = isCustomProduct ? randomUUID() : item.id
        
        values.push(`($${paramIndex}, $${paramIndex+1}, $${paramIndex+2}, $${paramIndex+3}, $${paramIndex+4}, $${paramIndex+5}, $${paramIndex+6}, NOW())`)
        params.push(
          orderId,
          productId,
          item.name,
          item.quantity,
          item.price.toFixed(2),
          (item.price * item.quantity).toFixed(2),
          item.details ? JSON.stringify(item.details) : null
        )
        paramIndex += 7
      }

      await query(`
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity, unit_price, total_price, 
          custom_details, created_at
        ) VALUES ${values.join(', ')}
      `, params)
    }

    // Update coupon usage if coupon was applied
    if (couponCode && discount > 0) {
      await query(`
        UPDATE coupons SET usage_count = usage_count + 1 WHERE code = $1
      `, [couponCode])
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      orderNumber: orderNumber,
      message: 'Order created successfully and is pending payment'
    })

  } catch (error) {
    console.error('Error creating pending order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
