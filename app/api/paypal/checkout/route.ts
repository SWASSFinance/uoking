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

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!selectedShard) {
      return NextResponse.json({ error: 'Shard selection required' }, { status: 400 })
    }

    // Get PayPal email from admin settings
    const settingsResult = await query(`
      SELECT setting_value FROM site_settings WHERE setting_key = 'paypal_email'
    `)
    
    if (!settingsResult.rows || settingsResult.rows.length === 0) {
      return NextResponse.json({ error: 'PayPal email not configured' }, { status: 500 })
    }

    const paypalEmail = settingsResult.rows[0].setting_value
    if (!paypalEmail) {
      return NextResponse.json({ error: 'PayPal email not configured' }, { status: 500 })
    }

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

    // Get user's character name from profile
    const userResult = await query(`
      SELECT id, character_names, main_shard FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0]
    const userCharacterName = user.character_names && user.character_names.length > 0 
      ? user.character_names[0] 
      : null

    // Create order in database
    const orderResult = await query(`
      INSERT INTO orders (
        user_id, 
        order_number,
        status, 
        subtotal,
        discount_amount,
        total_amount,
        currency,
        payment_method,
        payment_status,
        delivery_shard,
        delivery_character,
        cashback_used
      ) VALUES (
        $1,
        $2,
        'pending',
        $3,
        $4,
        $5,
        'USD',
        'paypal',
        'pending',
        $6,
        $7,
        $8
      ) RETURNING id
    `, [
      user.id, 
      `ORD-${Date.now()}`, 
      subtotal, 
      discount, 
      finalTotal, 
      selectedShard, 
      userCharacterName, 
      cashbackToUse
    ])

    const orderId = orderResult.rows[0].id

    // Insert order items
    for (const item of cartItems) {
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

    // Create PayPal order
    const paypalOrder = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId,
        description: `UOKing Order #${orderId}`,
        custom_id: orderId,
        amount: {
          currency_code: 'USD',
          value: finalTotal.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: subtotal.toFixed(2)
            },
            discount: {
              currency_code: 'USD',
              value: discount.toFixed(2)
            }
          }
        },
        payee: {
          email_address: paypalEmail
        },
        items: cartItems.map((item: any) => ({
          name: item.name,
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: 'USD',
            value: item.price.toFixed(2)
          }
        }))
      }],
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL}/paypal/return`,
        cancel_url: `${process.env.NEXTAUTH_URL}/paypal/return?cancelled=true`,
        brand_name: 'UOKing',
        shipping_preference: 'NO_SHIPPING'
      }
    }

    // Create PayPal order via PayPal API
    const paypalResponse = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getPayPalAccessToken()}`
      },
      body: JSON.stringify(paypalOrder)
    })

    if (!paypalResponse.ok) {
      throw new Error('Failed to create PayPal order')
    }

    const paypalData = await paypalResponse.json()

    // Update order with PayPal ID
    await query(`
      UPDATE orders SET payment_provider_id = $1 WHERE id = $2
    `, [paypalData.id, orderId])

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paypalOrderId: paypalData.id,
      approvalUrl: paypalData.links.find((link: any) => link.rel === 'approve').href
    })

  } catch (error) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
}

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token')
  }

  const data = await response.json()
  return data.access_token
} 