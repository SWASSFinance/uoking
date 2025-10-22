import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    const userId = validatedUser.id

    // Get user's cashback balance from user_points table
    const result = await query(`
      SELECT referral_cash, current_points, lifetime_points
      FROM user_points 
      WHERE user_id = $1
    `, [userId])

    if (!result.rows || result.rows.length === 0) {
      // Create user_points record if it doesn't exist
      await query(`
        INSERT INTO user_points (user_id, referral_cash, current_points, lifetime_points)
        VALUES ($1, 0, 0, 0)
      `, [userId])

      return NextResponse.json({
        referral_cash: 0,
        current_points: 0,
        lifetime_points: 0
      })
    }

    const userPoints = result.rows[0]
    const rawCashbackBalance = parseFloat(userPoints.referral_cash || 0)

    // Get total cashback used in pending orders to prevent double spending
    const pendingCashbackResult = await query(`
      SELECT COALESCE(SUM(cashback_used), 0) as pending_cashback
      FROM orders 
      WHERE user_id = $1 
      AND payment_status = 'pending'
      AND cashback_used > 0
    `, [userId])

    const pendingCashback = parseFloat(pendingCashbackResult.rows[0]?.pending_cashback || 0)
    const availableCashback = Math.max(0, rawCashbackBalance - pendingCashback)

    return NextResponse.json({
      referral_cash: availableCashback,
      current_points: parseInt(userPoints.current_points || 0),
      lifetime_points: parseInt(userPoints.lifetime_points || 0),
      raw_balance: rawCashbackBalance,
      pending_orders_cashback: pendingCashback
    })

  } catch (error) {
    console.error('Error fetching cashback balance:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch cashback balance' },
      { status: 500 }
    )
  }
} 