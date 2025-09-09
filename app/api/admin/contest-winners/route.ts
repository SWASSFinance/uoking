import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { getContestWinners, query } from '@/lib/db'

export async function GET(request: NextRequest) {
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

    const winners = await getContestWinners(20)

    return NextResponse.json({
      success: true,
      winners
    })

  } catch (error) {
    console.error('Error fetching contest winners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contest winners' },
      { status: 500 }
    )
  }
}
