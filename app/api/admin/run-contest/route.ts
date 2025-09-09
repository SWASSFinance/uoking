import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { selectContestWinners, query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const userResult = await query(`
      SELECT is_admin FROM users WHERE id = $1
    `, [session.user.id])

    if (!userResult.rows[0]?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const result = await selectContestWinners()

    return NextResponse.json({
      success: true,
      message: `Contest completed successfully for period ${result.contest_period}`,
      ...result
    })

  } catch (error) {
    console.error('Error running contest:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to run contest' },
      { status: 500 }
    )
  }
}
