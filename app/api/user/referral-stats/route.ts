import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { getUserReferralStats, generateReferralCode } from '@/lib/referral'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user ID from session
    const userResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Get or create referral code
    let referralCodeResult = await query(`
      SELECT referral_code FROM user_referral_codes 
      WHERE user_id = $1 AND is_active = true
    `, [userId])

    let referralCode = null
    if (!referralCodeResult.rows || referralCodeResult.rows.length === 0) {
      // Generate a new referral code
      referralCode = await generateReferralCode(userId)
    } else {
      referralCode = referralCodeResult.rows[0].referral_code
    }

    // Get referral statistics
    const statsResult = await query(`
      SELECT 
        COUNT(ur.id) as total_referrals,
        COUNT(CASE WHEN ur.reward_status = 'earned' THEN 1 END) as active_referrals,
        COALESCE(SUM(ur.reward_amount), 0) as total_earnings,
        COALESCE(SUM(CASE WHEN ur.reward_status = 'earned' THEN ur.reward_amount ELSE 0 END), 0) as earned_amount
      FROM user_referrals ur
      WHERE ur.referrer_id = $1
    `, [userId])

    const stats = {
      referral_code: referralCode,
      total_referrals: parseInt(statsResult.rows[0]?.total_referrals || '0'),
      active_referrals: parseInt(statsResult.rows[0]?.active_referrals || '0'),
      total_earnings: parseFloat(statsResult.rows[0]?.total_earnings || '0'),
      earned_amount: parseFloat(statsResult.rows[0]?.earned_amount || '0')
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching referral stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    )
  }
} 