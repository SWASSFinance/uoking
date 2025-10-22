import { NextResponse } from 'next/server'
import { getUserPendingReviewCount, getUserPendingSpawnSubmissionCount } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET() {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()

    const [pendingReviews, pendingSpawnSubmissions] = await Promise.all([
      getUserPendingReviewCount(validatedUser.id),
      getUserPendingSpawnSubmissionCount(validatedUser.id)
    ])

    return NextResponse.json({
      pendingReviews,
      pendingSpawnSubmissions,
      limits: {
        maxPendingReviews: 5,
        maxPendingSpawnSubmissions: 5
      },
      canSubmitReview: pendingReviews < 5,
      canSubmitSpawnLocation: pendingSpawnSubmissions < 5
    })

  } catch (error) {
    console.error('Error fetching submission limits:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch submission limits' },
      { status: 500 }
    )
  }
}
