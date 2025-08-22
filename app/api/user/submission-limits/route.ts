import { NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { getUserPendingReviewCount, getUserPendingSpawnSubmissionCount } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const [pendingReviews, pendingSpawnSubmissions] = await Promise.all([
      getUserPendingReviewCount(session.user.id),
      getUserPendingSpawnSubmissionCount(session.user.id)
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
    return NextResponse.json(
      { error: 'Failed to fetch submission limits' },
      { status: 500 }
    )
  }
}
