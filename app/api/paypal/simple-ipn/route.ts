import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const formData = new URLSearchParams(body)
    
    // Parse IPN data
    const paymentStatus = formData.get('payment_status')
    const txnId = formData.get('txn_id')
    const receiverEmail = formData.get('receiver_email')
    const custom = formData.get('custom') // This should contain our order ID
    const mcGross = formData.get('mc_gross')
    const mcCurrency = formData.get('mc_currency')

    console.log('PayPal IPN received:', {
      paymentStatus,
      txnId,
      receiverEmail,
      custom,
      mcGross,
      mcCurrency
    })

    // Verify receiver email matches our PayPal email
    const settingsResult = await query(`
      SELECT setting_value FROM site_settings WHERE setting_key = 'paypal_email'
    `)
    
    if (!settingsResult.rows || settingsResult.rows.length === 0) {
      console.error('PayPal email not configured')
      return NextResponse.json({ error: 'PayPal email not configured' }, { status: 500 })
    }

    const configuredPayPalEmail = settingsResult.rows[0].setting_value
    if (receiverEmail !== configuredPayPalEmail) {
      console.error('Receiver email mismatch:', receiverEmail, 'vs', configuredPayPalEmail)
      return NextResponse.json({ error: 'Receiver email mismatch' }, { status: 400 })
    }

    if (!custom) {
      console.error('No order ID in IPN')
      return NextResponse.json({ error: 'No order ID' }, { status: 400 })
    }

    // Get order details
    const orderResult = await query(`
      SELECT o.*, u.email as user_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.id = $1
    `, [custom])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      console.error('Order not found:', custom)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Verify amount matches
    const expectedAmount = parseFloat(order.total_amount).toFixed(2)
    const receivedAmount = parseFloat(mcGross || '0').toFixed(2)
    
    if (expectedAmount !== receivedAmount) {
      console.error('Amount mismatch:', expectedAmount, 'vs', receivedAmount)
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
    }

    // Update order based on payment status
    let newStatus = order.status
    let paymentStatusDB = order.payment_status

    switch (paymentStatus) {
      case 'Completed':
        newStatus = 'paid'
        paymentStatusDB = 'completed'
        break
      case 'Pending':
        newStatus = 'pending'
        paymentStatusDB = 'pending'
        break
      case 'Failed':
      case 'Denied':
      case 'Expired':
      case 'Canceled_Reversal':
        newStatus = 'cancelled'
        paymentStatusDB = 'failed'
        break
      case 'Refunded':
      case 'Reversed':
        newStatus = 'refunded'
        paymentStatusDB = 'refunded'
        break
      default:
        console.log('Unknown payment status:', paymentStatus)
        return NextResponse.json({ success: true })
    }

    // Update order status
    await query(`
      UPDATE orders 
      SET 
        status = $1,
        payment_status = $2,
        payment_transaction_id = $3,
        updated_at = NOW()
      WHERE id = $4
    `, [newStatus, paymentStatusDB, txnId, custom])

    // If payment completed, process referral cashback
    if (paymentStatus === 'Completed' && order.cashback_used > 0) {
      // Deduct cashback from user's balance
      await query(`
        UPDATE user_points 
        SET referral_cash = referral_cash - $1,
            updated_at = NOW()
        WHERE user_id = $2
      `, [order.cashback_used, order.user_id])
    }

    // If payment completed, add cashback for this purchase and process referral bonuses
    if (paymentStatus === 'Completed') {
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
          INSERT INTO cashback_transactions (
            user_id,
            transaction_type,
            amount,
            description,
            order_id,
            created_at
          ) VALUES ($1, 'purchase_cashback', $2, 'Purchase cashback', $3, NOW())
        `, [order.user_id, cashbackAmount, custom])
      }

      // Process referral bonus (2.5% for referrer)
      const referralResult = await query(`
        SELECT ur.referrer_id, ur.referral_code
        FROM user_referrals ur
        WHERE ur.referred_id = $1 AND ur.reward_status = 'pending'
        LIMIT 1
      `, [order.user_id])

      if (referralResult.rows && referralResult.rows.length > 0) {
        const referral = referralResult.rows[0]
        const referralBonus = (parseFloat(order.total_amount) * 2.5) / 100 // 2.5% referral bonus
        
        // Add referral bonus to referrer's account
        await query(`
          UPDATE user_points 
          SET referral_cash = referral_cash + $1,
              updated_at = NOW()
          WHERE user_id = $2
        `, [referralBonus, referral.referrer_id])

        // Update referral record
        await query(`
          UPDATE user_referrals 
          SET 
            reward_amount = $1,
            reward_status = 'earned',
            first_purchase_amount = $2,
            first_purchase_date = NOW(),
            updated_at = NOW()
          WHERE referrer_id = $3 AND referred_id = $4
        `, [referralBonus, parseFloat(order.total_amount), referral.referrer_id, order.user_id])

        // Log referral bonus transaction
        await query(`
          INSERT INTO cashback_transactions (
            user_id,
            transaction_type,
            amount,
            description,
            referral_code_used,
            order_id,
            created_at
          ) VALUES ($1, 'referral_bonus', $2, 'Referral bonus from ${referral.referral_code}', $3, $4, NOW())
        `, [referral.referrer_id, referralBonus, referral.referral_code, custom])

        console.log(`Referral bonus of $${referralBonus} added to user ${referral.referrer_id} for referral ${referral.referral_code}`)
      }
    }

    console.log(`Order ${custom} updated to status: ${newStatus}`)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('IPN processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 