import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Ensure environment variables are loaded
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

export async function POST(request: NextRequest) {
  let ipnLogId: string | null = null
  
  try {
    console.log('PayPal IPN received - starting processing')
    
    const body = await request.text()
    console.log('IPN body received:', body.substring(0, 200) + '...')
    
    const formData = new URLSearchParams(body)
    
    // Log all form data for debugging
    console.log('IPN form data keys:', Array.from(formData.keys()))
    
    // Capture IPN data for debugging
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    
    // Parse key IPN fields
    const paymentStatus = formData.get('payment_status')
    const txnId = formData.get('txn_id')
    const receiverEmail = formData.get('receiver_email')
    const businessEmail = formData.get('business') // PayPal sometimes uses 'business' instead of 'receiver_email'
    const custom = formData.get('custom') // This should contain our order ID
    const mcGross = formData.get('mc_gross')
    const mcCurrency = formData.get('mc_currency')
    
    // Log IPN to database for debugging
    const logResult = await query(`
      INSERT INTO paypal_ipn_logs (
        raw_body,
        headers,
        user_agent,
        ip_address,
        payment_status,
        txn_id,
        receiver_email,
        custom,
        mc_gross,
        mc_currency,
        verification_status,
        processing_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      body,
      JSON.stringify(Object.fromEntries(request.headers.entries())),
      userAgent,
      ipAddress,
      paymentStatus,
      txnId,
      receiverEmail || businessEmail, // Use either field for logging
      custom,
      mcGross,
      mcCurrency,
      'pending',
      'pending'
    ])
    
    ipnLogId = logResult.rows[0].id
    console.log('IPN logged to database with ID:', ipnLogId)
    
    // Verify IPN signature with PayPal
    console.log('Verifying IPN signature...')
    const isValid = await verifyIPN(body, request.headers.get('user-agent') || '')
    
    // Update verification status in log
    await query(`
      UPDATE paypal_ipn_logs 
      SET verification_status = $1 
      WHERE id = $2
    `, [isValid ? 'verified' : 'failed', ipnLogId])
    
    if (!isValid) {
      console.error('Invalid IPN signature')
      
      // Send debug email for failed verification
      try {
        await sendIPNDebugEmail({
          ipnLogId,
          status: 'verification_failed',
          rawBody: body,
          parsedData: {
            paymentStatus,
            txnId,
            receiverEmail: receiverEmail || businessEmail,
            businessEmail,
            custom,
            mcGross,
            mcCurrency
          },
          error: 'Invalid IPN signature'
        })
      } catch (emailError) {
        console.error('Failed to send debug email:', emailError)
      }
      
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    
    console.log('IPN signature verified successfully')

    console.log('PayPal IPN received:', {
      paymentStatus,
      txnId,
      receiverEmail,
      businessEmail,
      custom,
      mcGross,
      mcCurrency
    })

    // Verify receiver email matches our PayPal email (check both receiver_email and business fields)
    const settingsResult = await query(`
      SELECT setting_value FROM site_settings WHERE setting_key = 'paypal_email'
    `)
    
    if (!settingsResult.rows || settingsResult.rows.length === 0) {
      console.error('PayPal email not configured')
      return NextResponse.json({ error: 'PayPal email not configured' }, { status: 500 })
    }

    const configuredPayPalEmail = settingsResult.rows[0].setting_value
    const receivedEmail = receiverEmail || businessEmail // Use either field
    
    console.log('Email verification:', {
      receiverEmail,
      businessEmail,
      receivedEmail,
      configuredPayPalEmail,
      matches: receivedEmail === configuredPayPalEmail
    })
    
    if (!receivedEmail) {
      console.error('No receiver email found in IPN')
      return NextResponse.json({ error: 'No receiver email found' }, { status: 400 })
    }
    
    if (receivedEmail !== configuredPayPalEmail) {
      console.error('Receiver email mismatch:', receivedEmail, 'vs', configuredPayPalEmail)
      console.error('receiver_email:', receiverEmail, 'business:', businessEmail)
      return NextResponse.json({ error: 'Receiver email mismatch' }, { status: 400 })
    }

    if (!custom) {
      console.error('No order ID in IPN')
      return NextResponse.json({ error: 'No order ID' }, { status: 400 })
    }

    // Get order details
    console.log('Looking up order:', custom)
    console.log('Order ID type:', typeof custom, 'Length:', custom?.length)
    
    const orderResult = await query(`
      SELECT o.*, u.email as user_email, u.first_name, u.last_name
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.id = $1
    `, [custom])

    console.log('Order lookup result:', {
      orderId: custom,
      found: orderResult.rows && orderResult.rows.length > 0,
      rowCount: orderResult.rows?.length || 0
    })

    if (!orderResult.rows || orderResult.rows.length === 0) {
      console.error('Order not found:', custom)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.rows[0]
    console.log('Order found:', { 
      id: order.id, 
      status: order.status, 
      total_amount: order.total_amount,
      user_email: order.user_email 
    })

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
        newStatus = 'processing'
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
        
        // Handle refund processing
        await handleRefund(order, ipnLogId)
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

    // If payment completed, process cashback rewards
    if (paymentStatus === 'Completed') {
      // Get cashback settings
      const settingsResult = await query(`
        SELECT setting_value FROM site_settings WHERE setting_key = 'customer_cashback_percentage'
      `)
      
      if (settingsResult.rows && settingsResult.rows.length > 0) {
        const buyerCashbackPercentage = parseFloat(settingsResult.rows[0].setting_value) || 5
        const buyerCashbackAmount = (parseFloat(order.total_amount) * buyerCashbackPercentage) / 100
        
        // Give cashback to the buyer
        await query(`
          UPDATE user_points 
          SET referral_cash = referral_cash + $1,
              updated_at = NOW()
          WHERE user_id = $2
        `, [buyerCashbackAmount, order.user_id])

        console.log(`Added $${buyerCashbackAmount} cashback to buyer ${order.user_id} for order ${custom}`)

        // Check if buyer was referred by someone and give referrer bonus
        const referralResult = await query(`
          SELECT referrer_id FROM user_referrals 
          WHERE referred_id = $1
        `, [order.user_id])
        
        if (referralResult.rows && referralResult.rows.length > 0) {
          const referrerId = referralResult.rows[0].referrer_id
          
          // Get referrer cashback percentage (default 2.5%)
          const referrerSettingsResult = await query(`
            SELECT setting_value FROM site_settings WHERE setting_key = 'referrer_cashback_percentage'
          `)
          
          const referrerCashbackPercentage = referrerSettingsResult.rows && referrerSettingsResult.rows.length > 0 
            ? parseFloat(referrerSettingsResult.rows[0].setting_value) 
            : 2.5
          
          const referrerCashbackAmount = (parseFloat(order.total_amount) * referrerCashbackPercentage) / 100
          
          // Give cashback to the referrer
          await query(`
            UPDATE user_points 
            SET referral_cash = referral_cash + $1,
                updated_at = NOW()
            WHERE user_id = $2
          `, [referrerCashbackAmount, referrerId])

          console.log(`Added $${referrerCashbackAmount} cashback to referrer ${referrerId} for order ${custom}`)
        }
      }

      // Send order confirmation email
      try {
        console.log('Sending order confirmation email...')
        console.log('Environment check in IPN:')
        console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET (' + process.env.RESEND_API_KEY.substring(0, 10) + '...)' : 'NOT SET')
        console.log('- NODE_ENV:', process.env.NODE_ENV)
        console.log('Email data:', {
          userEmail: order.user_email,
          customerName: `${order.first_name || ''} ${order.last_name || ''}`.trim() || 'Customer',
          orderId: custom,
          total: order.total_amount
        })
        
        // Get order items for email
        const orderItemsResult = await query(`
          SELECT oi.quantity, oi.unit_price as price, oi.product_name as name
          FROM order_items oi
          WHERE oi.order_id = $1
        `, [custom])

        console.log('Order items found:', orderItemsResult.rows.length)
        console.log('Order items:', orderItemsResult.rows)

        console.log('Importing email module...')
        const { sendEmail } = await import('@/lib/email')
        console.log('Email module imported successfully')
        
        console.log('Calling sendEmail...')
        const emailResult = await sendEmail(order.user_email, 'orderConfirmation', {
          orderId: custom,
          customerName: `${order.first_name || ''} ${order.last_name || ''}`.trim() || 'Customer',
          email: order.user_email,
          total: parseFloat(order.total_amount),
          items: orderItemsResult.rows.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price)
          })),
          deliveryCharacter: order.delivery_character,
          shard: order.delivery_shard
        }, {
          from: 'UO King <noreply@uoking.com>',
          replyTo: 'support@uoking.com',
          subject: `Order Confirmation - UO King (Order #${custom})`
        })
        
        console.log('Order confirmation email sent successfully:', emailResult)
        
        // Log email success in IPN logs
        await query(`
          UPDATE paypal_ipn_logs 
          SET email_sent = true, email_message_id = $1
          WHERE id = $2
        `, [emailResult.messageId || 'unknown', ipnLogId])
        
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError)
        console.error('Email error details:', {
          message: (emailError as any)?.message,
          stack: (emailError as any)?.stack,
          name: (emailError as any)?.name
        })
        
        // Log email failure in IPN logs
        await query(`
          UPDATE paypal_ipn_logs 
          SET email_sent = false, email_error = $1
          WHERE id = $2
        `, [(emailError as any)?.message || 'Unknown email error', ipnLogId])
        
        // Don't fail IPN processing if email fails
      }

      // Add customer to Mailchimp with order data
      try {
        console.log('Adding customer to Mailchimp...')
        const { addOrderCustomerToMailchimp } = await import('@/lib/mailchimp')
        await addOrderCustomerToMailchimp({
          email: order.user_email,
          firstName: order.first_name || '',
          lastName: order.last_name || '',
          characterName: order.delivery_character || '',
          mainShard: order.delivery_shard || '',
          orderId: custom,
          orderTotal: parseFloat(order.total_amount)
        })
        console.log('Customer added to Mailchimp successfully')
      } catch (mailchimpError) {
        console.error('Failed to add order customer to Mailchimp:', mailchimpError)
        // Don't fail IPN processing if Mailchimp fails
      }
    }

    console.log(`Order ${custom} updated to status: ${newStatus}`)
    
    // Update processing status to success
    await query(`
      UPDATE paypal_ipn_logs 
      SET processing_status = 'success', processed_at = NOW()
      WHERE id = $1
    `, [ipnLogId])
    
    console.log('IPN processing completed successfully')
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('IPN processing error:', error)
    console.error('Error details:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      name: error?.name
    })
    
    // Update processing status to error
    if (ipnLogId) {
      await query(`
        UPDATE paypal_ipn_logs 
        SET processing_status = 'error', 
            error_message = $1,
            processed_at = NOW()
        WHERE id = $2
      `, [error?.message || 'Unknown error', ipnLogId])
    }
    
    // Send debug email for processing error
    try {
      await sendIPNDebugEmail({
        ipnLogId,
        status: 'processing_error',
        rawBody: 'Error occurred before body parsing',
        parsedData: {
          paymentStatus: 'unknown',
          txnId: 'unknown',
          receiverEmail: 'unknown',
          custom: 'unknown',
          mcGross: 'unknown',
          mcCurrency: 'unknown'
        },
        error: error?.message || 'Unknown error'
      })
    } catch (emailError) {
      console.error('Failed to send debug email:', emailError)
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

// Function to send debug email for IPN issues
async function sendIPNDebugEmail(data: {
  ipnLogId: string | null
  status: string
  rawBody: string
  parsedData: any
  error?: string
}) {
  try {
    const { sendEmail } = await import('@/lib/email')
    
    const subject = `PayPal IPN Debug Alert - ${data.status}`
    const html = `
      <h2>PayPal IPN Debug Alert</h2>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>IPN Log ID:</strong> ${data.ipnLogId || 'N/A'}</p>
      <p><strong>Error:</strong> ${data.error || 'N/A'}</p>
      
      <h3>Parsed IPN Data:</h3>
      <pre>${JSON.stringify(data.parsedData, null, 2)}</pre>
      
      <h3>Raw IPN Body:</h3>
      <pre>${data.rawBody}</pre>
      
      <p><em>This email was sent automatically for debugging purposes.</em></p>
    `
    
    // Send to admin email (you can configure this in environment variables)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@uoking.com'
    
    await sendEmail(adminEmail, 'debug', {
      subject,
      html,
      status: data.status,
      ipnLogId: data.ipnLogId,
      error: data.error,
      parsedData: data.parsedData,
      rawBody: data.rawBody
    })
    
    console.log('Debug email sent successfully')
  } catch (error) {
    console.error('Failed to send debug email:', error)
  }
}

async function verifyIPN(body: string, userAgent: string): Promise<boolean> {
  try {
    console.log('Starting IPN verification...')
    
    // For development/testing, skip verification
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - skipping IPN verification')
      return true
    }
    
    // For production, verify the IPN with PayPal
    const verificationBody = `cmd=_notify-validate&${body}`
    
    console.log('Sending verification request to PayPal...')
    
    // Use the correct PayPal IPN verification URL
    const paypalIPNUrl = process.env.NODE_ENV === 'production' 
      ? 'https://ipnpb.paypal.com/cgi-bin/webscr'
      : 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr'
    
    const response = await fetch(paypalIPNUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': userAgent
      },
      body: verificationBody
    })

    const verificationResult = await response.text()
    console.log('PayPal verification result:', verificationResult)
    
    const isValid = verificationResult === 'VERIFIED'
    console.log('IPN verification result:', isValid ? 'VERIFIED' : 'INVALID')
    
    return isValid
  } catch (error: any) {
    console.error('IPN verification error:', error)
    console.error('Verification error details:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack
    })
    
    // For development/testing, return true to allow processing
    // In production, this should be false to prevent processing unverified IPNs
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - allowing unverified IPN due to verification error')
      return true
    }
    
    return false
  }
}

// Function to handle refund processing
async function handleRefund(order: any, ipnLogId: string | null) {
  try {
    console.log('Processing refund for order:', order.id)
    
    // 1. Subtract cashback the customer received from this order
    if (order.cashback_used > 0) {
      await query(`
        UPDATE user_points 
        SET referral_cash = referral_cash - $1,
            updated_at = NOW()
        WHERE user_id = $2
      `, [order.cashback_used, order.user_id])
      console.log('Subtracted cashback used from customer:', order.cashback_used)
    }
    
    // 2. Find and subtract referral cashback if this order generated any
    const referralResult = await query(`
      SELECT ur.*, u.email as referrer_email, u.first_name, u.last_name
      FROM user_referrals ur
      JOIN users u ON ur.referrer_id = u.id
      WHERE ur.order_id = $1 AND ur.type = 'purchase_cashback'
    `, [order.id])
    
    if (referralResult.rows && referralResult.rows.length > 0) {
      for (const referral of referralResult.rows) {
        // Subtract the cashback from the referrer
        await query(`
          UPDATE user_points 
          SET referral_cash = referral_cash - $1,
              updated_at = NOW()
          WHERE user_id = $2
        `, [referral.amount, referral.referrer_id])
        
        console.log('Subtracted referral cashback from referrer:', referral.amount)
        
        // Update referral status to refunded
        await query(`
          UPDATE user_referrals 
          SET status = 'refunded', updated_at = NOW()
          WHERE id = $1
        `, [referral.id])
      }
    }
    
    // 3. Send refund email to customer
    await sendRefundEmail(order)
    
    console.log('Refund processing completed for order:', order.id)
    
  } catch (error: any) {
    console.error('Error processing refund:', error)
    
    // Log the error
    if (ipnLogId) {
      await query(`
        UPDATE paypal_ipn_logs 
        SET error_message = COALESCE(error_message, '') || '; Refund processing error: ' || $1
        WHERE id = $2
      `, [error?.message || 'Unknown error', ipnLogId])
    }
  }
}

// Function to send refund email
async function sendRefundEmail(order: any) {
  try {
    const { sendEmail } = await import('@/lib/email')
    
    await sendEmail(order.user_email, 'orderConfirmation', {
      firstName: order.first_name || 'Customer',
      lastName: order.last_name || '',
      orderNumber: order.order_number,
      orderId: order.id,
      refundAmount: order.total_amount,
      refundDate: new Date().toLocaleDateString()
    }, {
      from: 'UO King <noreply@uoking.com>',
      replyTo: 'support@uoking.com',
      subject: `Order Refund Confirmation - UO King (Order #${order.id})`
    })
    console.log('Refund email sent to:', order.user_email)
    
  } catch (error) {
    console.error('Error sending refund email:', error)
  }
} 