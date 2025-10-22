import { NextRequest, NextResponse } from 'next/server'
import { 
  getUserDailyCheckinStatus, 
  performDailyCheckin, 
  getUserCheckinHistory,
  getCheckinStreak
} from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    const userId = validatedUser.id
    
    // Get check-in status and history
    const [checkinStatus, checkinHistory, streak] = await Promise.all([
      getUserDailyCheckinStatus(userId),
      getUserCheckinHistory(userId, 7), // Last 7 days
      getCheckinStreak(userId)
    ])

    return NextResponse.json({
      status: checkinStatus,
      history: checkinHistory,
      streak: streak
    })
  } catch (error) {
    console.error('Error fetching daily check-in data:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch check-in data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    const userId = validatedUser.id
    
    // Perform daily check-in
    const result = await performDailyCheckin(userId)
    
    // Get updated status
    const [checkinStatus, streak] = await Promise.all([
      getUserDailyCheckinStatus(userId),
      getCheckinStreak(userId)
    ])

    return NextResponse.json({
      success: true,
      message: 'Daily check-in completed successfully!',
      points_awarded: result.points_awarded,
      status: checkinStatus,
      streak: streak
    })
  } catch (error) {
    console.error('Error performing daily check-in:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Already checked in today') {
        return NextResponse.json(
          { error: 'You have already checked in today' },
          { status: 400 }
        )
      }
      
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to perform daily check-in' },
      { status: 500 }
    )
  }
}
