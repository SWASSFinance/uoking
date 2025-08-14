import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user ID from email
    const userResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [token.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userResult.rows[0].id

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

    return NextResponse.json({
      referral_cash: parseFloat(userPoints.referral_cash || 0),
      current_points: parseInt(userPoints.current_points || 0),
      lifetime_points: parseInt(userPoints.lifetime_points || 0)
    })

  } catch (error) {
    console.error('Error fetching cashback balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cashback balance' },
      { status: 500 }
    )
  }
} 