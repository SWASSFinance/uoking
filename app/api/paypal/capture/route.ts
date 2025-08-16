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
    const { paypalOrderId } = body

    if (!paypalOrderId) {
      return NextResponse.json({ error: 'PayPal order ID required' }, { status: 400 })
    }

    // Get order by PayPal order ID
    const orderResult = await query(`
      SELECT o.*, u.email as user_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.payment_provider_id = $1 AND u.email = $2
    `, [paypalOrderId, session.user.email])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Capture the payment with PayPal
    const captureResponse = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getPayPalAccessToken()}`
      }
    })

    if (!captureResponse.ok) {
      throw new Error('Failed to capture PayPal payment')
    }

    const captureData = await captureResponse.json()

    // Check if capture was successful
    if (captureData.status === 'COMPLETED') {
      // Update order status
      await query(`
        UPDATE orders 
        SET 
          status = 'paid',
          payment_status = 'completed',
          payment_transaction_id = $1,
          updated_at = NOW()
        WHERE id = $2
      `, [captureData.purchase_units[0].payments.captures[0].id, order.id])

      // Process cashback if used
      if (order.cashback_used > 0) {
        await query(`
          UPDATE user_points 
          SET referral_cash = referral_cash - $1,
              updated_at = NOW()
          WHERE user_id = $2
        `, [order.cashback_used, order.user_id])
      }

      // Add cashback for this purchase
      const settingsResult = await query(`
        SELECT setting_value FROM site_settings WHERE setting_key = 'customer_cashback_percentage'
      `)
      
      if (settingsResult.rows && settingsResult.rows.length > 0) {
        const cashbackPercentage = parseFloat(settingsResult.rows[0].setting_value) || 5
        const cashbackAmount = (parseFloat(order.total_amount) * cashbackPercentage) / 100
        
        await query(`
          UPDATE user_points 
          SET referral_cash = referral_cash + $1,
              updated_at = NOW()
          WHERE user_id = $2
        `, [cashbackAmount, order.user_id])

        // Log cashback transaction
        await query(`
          INSERT INTO user_referrals (
            referrer_id,
            referred_id,
            order_id,
            amount,
            type,
            status
          ) VALUES ($1, $2, $3, $4, 'purchase_cashback', 'completed')
        `, [order.user_id, order.user_id, order.id, cashbackAmount])
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        status: 'paid'
      })
    } else {
      // Payment failed or is pending
      await query(`
        UPDATE orders 
        SET 
          status = 'pending',
          payment_status = 'pending',
          updated_at = NOW()
        WHERE id = $1
      `, [order.id])

      return NextResponse.json({
        success: false,
        orderId: order.id,
        status: 'pending',
        message: 'Payment is pending or failed'
      })
    }

  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture payment' },
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