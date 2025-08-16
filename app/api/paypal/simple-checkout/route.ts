import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { cartItems, cashbackToUse, selectedShard, couponCode } = body

    console.log('Received checkout request:', {
      cartItemsCount: cartItems?.length,
      cashbackToUse,
      selectedShard,
      couponCode
    })

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
    const userResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [session.user.email])
    
    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }
    
    console.log('User found:', userResult.rows[0].id)

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

    console.log('PayPal email found:', paypalEmail)

    // Calculate totals
    let subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    let discount = 0
    let finalTotal = subtotal - cashbackToUse

    // Apply coupon if provided
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
          finalTotal = subtotal - discount - cashbackToUse
        }
      }
    }

    // Create order in database
    const orderResult = await query(`
      INSERT INTO orders (
        user_id, 
        order_number,
        status, 
        total_amount, 
        subtotal,
        discount_amount,
        cashback_used,
        delivery_shard,
        coupon_code,
        payment_method,
        payment_status
      ) VALUES (
        (SELECT id FROM users WHERE email = $1),
        'ORD-' || EXTRACT(EPOCH FROM NOW())::BIGINT,
        'pending',
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        'paypal_form',
        'pending'
      ) RETURNING id
    `, [session.user.email, finalTotal, subtotal, discount, cashbackToUse, selectedShard, couponCode || null])

    const orderId = orderResult.rows[0].id
    console.log('Order created with ID:', orderId)

    // Insert order items
    console.log('Inserting order items:', cartItems.length)
    for (const item of cartItems) {
      console.log('Inserting item:', item.name, 'for order:', orderId)
      await query(`
        INSERT INTO order_items (
          order_id, 
          product_id, 
          product_name, 
          quantity, 
          unit_price, 
          total_price
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [orderId, item.id, item.name, item.quantity, item.price, item.price * item.quantity])
    }
    console.log('All order items inserted successfully')

    // Create PayPal form data
    const paypalFormData = {
      business: paypalEmail,
      item_name: `UOKing Order #${orderId}`,
      amount: finalTotal.toFixed(2),
      currency_code: 'USD',
      return: `${process.env.NEXTAUTH_URL}/paypal/success?order_id=${orderId}`,
      cancel_return: `${process.env.NEXTAUTH_URL}/paypal/cancel?order_id=${orderId}`,
      notify_url: `${process.env.NEXTAUTH_URL}/api/paypal/simple-ipn`,
      custom: orderId,
      no_shipping: '1',
      no_note: '1',
      charset: 'utf-8'
    }
    
    console.log('PayPal form data created:', paypalFormData)

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paypalFormData: paypalFormData,
      paypalUrl: 'https://www.paypal.com/cgi-bin/webscr'
    })

  } catch (error: any) {
    console.error('PayPal simple checkout error:', error)
    console.error('Error details:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack
    })
    return NextResponse.json(
      { error: 'Failed to create order', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
} 