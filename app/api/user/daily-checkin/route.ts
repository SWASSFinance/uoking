import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { 
  getUserDailyCheckinStatus, 
  performDailyCheckin, 
  getUserCheckinHistory,
  getCheckinStreak,
  query 
} from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user ID from session
    const userResult = await query('SELECT id FROM users WHERE email = $1', [session.user.email])
    
    if (!userResult.rows.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userResult.rows[0].id
    
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
    return NextResponse.json(
      { error: 'Failed to fetch check-in data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user ID from session
    const userResult = await query('SELECT id FROM users WHERE email = $1', [session.user.email])
    
    if (!userResult.rows.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userResult.rows[0].id
    
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
    
    if (error instanceof Error && error.message === 'Already checked in today') {
      return NextResponse.json(
        { error: 'You have already checked in today' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to perform daily check-in' },
      { status: 500 }
    )
  }
}
