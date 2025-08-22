import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminResult = await query(`
      SELECT id, is_admin FROM users WHERE email = $1
    `, [session.user.email])

    if (!adminResult.rows || adminResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!adminResult.rows[0].is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Check if target user exists
    const targetUserResult = await query(`
      SELECT id, email, username, status FROM users WHERE id = $1
    `, [userId])

    if (!targetUserResult.rows || targetUserResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      )
    }

    const targetUser = targetUserResult.rows[0]

    // Check if user is banned
    if (targetUser.status !== 'banned') {
      return NextResponse.json(
        { error: 'User is not banned' },
        { status: 400 }
      )
    }

    // Unban the user using the database function
    const unbanResult = await query(`
      SELECT unban_user($1, $2) as result
    `, [userId, adminResult.rows[0].id])

    const result = unbanResult.rows[0].result

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to unban user' },
        { status: 500 }
      )
    }

    // Get updated user info
    const updatedUserResult = await query(`
      SELECT 
        u.id, u.email, u.username, u.status, u.banned_at, u.ban_reason, 
        u.ban_expires_at, u.is_permanently_banned
      FROM users u
      WHERE u.id = $1
    `, [userId])

    return NextResponse.json({
      success: true,
      message: result.message,
      user: updatedUserResult.rows[0]
    })

  } catch (error) {
    console.error('Error unbanning user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
