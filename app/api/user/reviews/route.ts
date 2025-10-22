import { NextRequest, NextResponse } from 'next/server'
import { getUserReviews } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    
    // Get reviews for authenticated user only
    const reviews = await getUserReviews(validatedUser.id)

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
} 