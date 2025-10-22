import { NextRequest, NextResponse } from 'next/server'
import { upgradeUserAccount } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function POST(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()

    // Attempt to upgrade the user's account
    const result = await upgradeUserAccount(validatedUser.id)

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
      const { message, statusCode } = getAuthErrorResponse(error)
      if (statusCode !== 500) {
        return NextResponse.json({ error: message }, { status: statusCode })
      }
      
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
