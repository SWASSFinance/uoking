import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { getUserPoints, query } from '@/lib/db'

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
    console.log('Getting points for user ID:', userId)
    const points = await getUserPoints(userId)
    console.log('Points data returned:', points)

    return NextResponse.json({ points })
  } catch (error) {
    console.error('Error fetching user points:', error)
    return NextResponse.json(
      { error: 'Failed to fetch points' },
      { status: 500 }
    )
  }
} 