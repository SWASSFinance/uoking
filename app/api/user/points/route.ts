import { NextRequest, NextResponse } from 'next/server'
import { getUserPoints, getCheckinTotals, getReferralPoints } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    const userId = validatedUser.id
    
    console.log('Getting points for user ID:', userId)
    
    // Get points, check-in totals, and referral points
    const [points, checkinTotals, referralPoints] = await Promise.all([
      getUserPoints(userId),
      getCheckinTotals(userId),
      getReferralPoints(userId)
    ])
    
    console.log('Points data returned:', points)
    console.log('Check-in totals returned:', checkinTotals)
    console.log('Referral points returned:', referralPoints)

    return NextResponse.json({ 
      points: {
        ...points,
        checkin_totals: checkinTotals,
        referral_points: referralPoints
      }
    })
  } catch (error) {
    console.error('Error fetching user points:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch points' },
      { status: 500 }
    )
  }
} 