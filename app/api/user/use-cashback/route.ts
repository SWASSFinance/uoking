import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { amount, orderId } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Get user ID
    const userResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userResult.rows[0].id

    // Get current cashback balance
    const balanceResult = await query(`
      SELECT referral_cash FROM user_points WHERE user_id = $1
    `, [userId])

    if (!balanceResult.rows || balanceResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User points record not found' },
        { status: 404 }
      )
    }

    const currentBalance = parseFloat(balanceResult.rows[0].referral_cash || 0)

    if (amount > currentBalance) {
      return NextResponse.json(
        { error: 'Insufficient cashback balance' },
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
      newBalance: currentBalance - amount,
      amountUsed: amount
    })

  } catch (error) {
    console.error('Error using cashback balance:', error)
    return NextResponse.json(
      { error: 'Failed to use cashback balance' },
      { status: 500 }
    )
  }
} 