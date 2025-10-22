import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getUserReferralCode } from '@/lib/referral'
import { getReferralPoints } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    const userId = validatedUser.id

    // Get or create referral code
    const referralCodeData = await getUserReferralCode(userId)
    const referralCode = referralCodeData.referral_code

    // Get referral statistics and points
    const [statsResult, referralPoints] = await Promise.all([
      query(`
        SELECT 
          COUNT(ur.id) as total_referrals,
          COUNT(CASE WHEN ur.reward_status = 'earned' THEN 1 END) as active_referrals,
          COALESCE(SUM(ur.reward_amount), 0) as total_earnings,
          COALESCE(SUM(CASE WHEN ur.reward_status = 'earned' THEN ur.reward_amount ELSE 0 END), 0) as earned_amount
        FROM user_referrals ur
        WHERE ur.referrer_id = $1
      `, [userId]),
      getReferralPoints(userId)
    ])

    const stats = {
      referral_code: referralCode,
      total_referrals: parseInt(statsResult.rows[0]?.total_referrals || '0'),
      active_referrals: parseInt(statsResult.rows[0]?.active_referrals || '0'),
      total_earnings: parseFloat(statsResult.rows[0]?.total_earnings || '0'),
      earned_amount: parseFloat(statsResult.rows[0]?.earned_amount || '0'),
      referral_points: referralPoints
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching referral stats:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    )
  }
} 