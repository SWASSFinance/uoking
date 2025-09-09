import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { upgradeUserAccount } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Attempt to upgrade the user's account
    const result = await upgradeUserAccount(session.user.id)

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded your account to premium! You spent ${result.pointsSpent} points.`,
      user: result.user,
      pointsSpent: result.pointsSpent,
      newPointsBalance: result.newPointsBalance
    })

  } catch (error) {
    console.error('Error upgrading account:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
