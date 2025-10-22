import { NextRequest, NextResponse } from 'next/server'
import { getUserOwnedPlots } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    
    // Get plots for authenticated user only
    const plots = await getUserOwnedPlots(validatedUser.id)

    return NextResponse.json({
      plots
    })

  } catch (error) {
    console.error('Error fetching user plots:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ) 
  }
}
