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
    const { cartItems, cashbackToUse, selectedShard, couponCode, giftId, existingOrderId } = body

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

    // Get PayPal email from admin settings
    const settingsResult = await query(`
      SELECT setting_value FROM site_settings WHERE setting_key = 'paypal_email'
    `)
    
    if (!settingsResult.rows || settingsResult.rows.length === 0) {
      return NextResponse.json({ error: 'PayPal email not configured in admin settings' }, { status: 500 })
    }

    const paypalEmail = settingsResult.rows[0].setting_value
    if (!paypalEmail) {
      return NextResponse.json({ error: 'PayPal email not configured in admin settings' }, { status: 500 })
    }

    // Validate cashback amount against user's available balance
    if (cashbackToUse > 0) {
      const userPointsResult = await query(`
        SELECT up.referral_cash,
               COALESCE(SUM(o.cashback_used), 0) as pending_cashback
        FROM user_points up
        LEFT JOIN orders o ON o.user_id = up.user_id 
          AND o.payment_status = 'pending' 
          AND o.cashback_used > 0
        WHERE up.user_id = (SELECT id FROM users WHERE email = $1)
        GROUP BY up.referral_cash
      `, [session.user.email])

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
        SELECT setting_value FROM premium_settings WHERE setting_key = 'premium_discount_percentage'
      `)
      
      if (premiumSettingsResult.rows && premiumSettingsResult.rows.length > 0) {
        const premiumDiscountPercentage = parseFloat(premiumSettingsResult.rows[0].setting_value) || 0
        premiumDiscount = (subtotal * premiumDiscountPercentage) / 100
        finalTotal = subtotal - premiumDiscount - cashbackToUse
      }
    }

    // Apply coupon if provided (coupon discounts are applied on top of premium discount)
    if (couponCode) {
      const couponResult = await query(`
        SELECT * FROM coupons WHERE code = $1 AND is_active = true 
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (starts_at IS NULL OR starts_at <= NOW())
      `, [couponCode])

      if (couponResult.rows && couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0]
        if (subtotal >= coupon.minimum_amount) {
          if (coupon.type === 'percentage') {
            discount = (subtotal * coupon.value) / 100
          } else if (coupon.type === 'fixed') {
            discount = coupon.value
          }
          finalTotal = subtotal - premiumDiscount - discount - cashbackToUse
        }
      }
    }

    let orderId: string

    if (existingOrderId) {
      // Update existing order - verify the order exists and belongs to the user
      const existingOrderResult = await query(`
        SELECT id, payment_status FROM orders 
        WHERE id = $1 AND user_id = (SELECT id FROM users WHERE email = $2)
      `, [existingOrderId, session.user.email])

      if (!existingOrderResult.rows || existingOrderResult.rows.length === 0) {
        return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 })
      }

      const existingOrder = existingOrderResult.rows[0]
      if (existingOrder.payment_status !== 'pending') {
        return NextResponse.json({ error: 'Order is not in pending status' }, { status: 400 })
      }

      // Update the existing order
      await query(`
        UPDATE orders SET
          total_amount = $1,
          subtotal = $2,
          discount_amount = $3,
          premium_discount = $4,
          cashback_used = $5,
          delivery_shard = $6,
          coupon_code = $7,
          updated_at = NOW()
        WHERE id = $8
      `, [finalTotal, subtotal, discount, premiumDiscount, cashbackToUse, selectedShard, couponCode || null, existingOrderId])

      // Clear existing order items
      await query(`
        DELETE FROM order_items WHERE order_id = $1
      `, [existingOrderId])

      // OPTIMIZED: Batch insert order items in a single query
      if (cartItems.length > 0) {
        const values: string[] = []
        const params: any[] = []
        let paramIndex = 1

        for (const item of cartItems) {
          const isCustomProduct = !item.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
          const productId = isCustomProduct ? randomUUID() : item.id
          
          values.push(`($${paramIndex}, $${paramIndex+1}, $${paramIndex+2}, $${paramIndex+3}, $${paramIndex+4}, $${paramIndex+5}, $${paramIndex+6})`)
          params.push(
            existingOrderId,
            productId,
            item.name,
            item.quantity,
            item.price,
            item.price * item.quantity,
            item.details ? JSON.stringify(item.details) : null
          )
          paramIndex += 7
        }

        console.log('Batch inserting', cartItems.length, 'items for existing order')
        try {
          await query(`
            INSERT INTO order_items (
              order_id, product_id, product_name, quantity, unit_price, total_price, custom_details
            ) VALUES ${values.join(', ')}
          `, params)
        } catch (batchError) {
          console.error('Batch insert failed for existing order:', batchError)
          throw batchError
        }
      }

      orderId = existingOrderId
    } else {
      // Get user's character name from profile
      const userDetailsResult = await query(`
        SELECT id, character_names, main_shard FROM users WHERE email = $1
      `, [session.user.email])

      if (!userDetailsResult.rows || userDetailsResult.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const user = userDetailsResult.rows[0]
      const userCharacterName = user.character_names && user.character_names.length > 0 
        ? user.character_names[0] 
        : null

      // Create new order
      const orderResult = await query(`
        INSERT INTO orders (
          user_id, 
          order_number,
          status, 
          subtotal,
          discount_amount,
          premium_discount,
          total_amount,
          currency,
          payment_method,
          payment_status,
          delivery_shard,
          delivery_character,
          cashback_used,
          gift_id
        ) VALUES (
          $1,
          'ORD-' || EXTRACT(EPOCH FROM NOW())::BIGINT,
          'pending',
          $2,
          $3,
          $4,
          $5,
          'USD',
          'paypal_form',
          'pending',
          $6,
          $7,
          $8,
          $9
        ) RETURNING id
      `, [user.id, subtotal, discount, premiumDiscount, finalTotal, selectedShard, userCharacterName, cashbackToUse, giftId || null])

      orderId = orderResult.rows[0].id
      console.log('New order created with ID:', orderId)

      // OPTIMIZED: Batch insert order items in a single query
      if (cartItems.length > 0) {
        const values: string[] = []
        const params: any[] = []
        let paramIndex = 1

        for (const item of cartItems) {
          const isCustomProduct = !item.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
          const productId = isCustomProduct ? randomUUID() : item.id
          
          values.push(`($${paramIndex}, $${paramIndex+1}, $${paramIndex+2}, $${paramIndex+3}, $${paramIndex+4}, $${paramIndex+5}, $${paramIndex+6})`)
          params.push(
            orderId,
            productId,
            item.name,
            item.quantity,
            item.price,
            item.price * item.quantity,
            item.details ? JSON.stringify(item.details) : null
          )
          paramIndex += 7
        }

        console.log('Batch inserting', cartItems.length, 'items for new order')
        try {
          await query(`
            INSERT INTO order_items (
              order_id, product_id, product_name, quantity, unit_price, total_price, custom_details
            ) VALUES ${values.join(', ')}
          `, params)
          console.log('Batch insert successful')
        } catch (batchError) {
          console.error('Batch insert failed for new order:', batchError)
          throw batchError
        }
      }
    }

    // Create PayPal form data
    const paypalFormData = {
      business: paypalEmail,
      item_name: `UOKing Order #${orderId}`,
      amount: finalTotal.toFixed(2),
      currency_code: 'USD',
      return: `${process.env.NEXTAUTH_URL}/paypal/success?order_id=${orderId}`,
      cancel_return: `${process.env.NEXTAUTH_URL}/paypal/cancel?order_id=${orderId}`,
      notify_url: `${process.env.NEXTAUTH_URL}/api/paypal/ipn`,
      custom: orderId,
      no_shipping: '1',
      no_note: '1',
      charset: 'utf-8'
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paypalFormData: paypalFormData,
      paypalUrl: 'https://www.paypal.com/cgi-bin/webscr'
    })

  } catch (error: any) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        details: error?.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
} 