import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function POST(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    const userId = validatedUser.id

    const { amount, orderId } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Get current cashback balance and pending cashback
    const balanceResult = await query(`
      SELECT up.referral_cash,
             COALESCE(SUM(o.cashback_used), 0) as pending_cashback
      FROM user_points up
      LEFT JOIN orders o ON o.user_id = up.user_id 
        AND o.payment_status = 'pending' 
        AND o.cashback_used > 0
      WHERE up.user_id = $1
      GROUP BY up.referral_cash
    `, [userId])

    if (!balanceResult.rows || balanceResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User points record not found' },
        { status: 404 }
      )
    }

    const rawCashbackBalance = parseFloat(balanceResult.rows[0].referral_cash || 0)
    const pendingCashback = parseFloat(balanceResult.rows[0].pending_cashback || 0)
    const availableCashback = Math.max(0, rawCashbackBalance - pendingCashback)

    if (amount > availableCashback) {
      return NextResponse.json(
        { error: `Insufficient cashback balance. Available: $${availableCashback.toFixed(2)}` },
        { status: 400 }
      )
    }

    // Update cashback balance
    await query(`
      UPDATE user_points 
      SET referral_cash = referral_cash - $1, updated_at = NOW()
      WHERE user_id = $2
    `, [amount, userId])

    // If orderId is provided, update the order
    if (orderId) {
      await query(`
        UPDATE orders 
        SET discount_amount = discount_amount + $1, 
            total_amount = total_amount - $1,
            updated_at = NOW()
        WHERE id = $2 AND user_id = $3
      `, [amount, orderId, userId])
    }

    return NextResponse.json({
      success: true,
      newBalance: availableCashback - amount,
      amountUsed: amount
    })

  } catch (error) {
    console.error('Error using cashback balance:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to use cashback balance' },
      { status: 500 }
    )
  }
} 