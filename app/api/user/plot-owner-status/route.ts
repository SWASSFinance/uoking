import { NextRequest, NextResponse } from 'next/server'
import { isUserPlotOwner } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()

    const isPlotOwner = await isUserPlotOwner(validatedUser.id)

    return NextResponse.json({ 
      isPlotOwner,
      message: isPlotOwner 
        ? 'You are a plot owner and can create trading posts' 
        : 'You need to own at least one plot to create trading posts'
    })
  } catch (error) {
    console.error('Error checking plot owner status:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to check plot owner status' },
      { status: 500 }
    )
  }
}

