import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateAdminSession } from '@/lib/auth-security'

export async function POST(request: NextRequest) {
  try {
    // Validate admin session
    await validateAdminSession()

    const body = await request.json()
    const { email, keepUserId } = body

    if (!email || !keepUserId) {
      return NextResponse.json(
        { error: 'Email and keepUserId are required' },
        { status: 400 }
      )
    }

    // Get all users with this email
    const allUsers = await query(`
      SELECT id, username, first_name, last_name, created_at, status, is_admin
      FROM users 
      WHERE email = $1
      ORDER BY created_at DESC
    `, [email])

    if (allUsers.rows.length <= 1) {
      return NextResponse.json({
        success: true,
        message: 'No duplicates found for this email'
      })
    }

    // Verify the keepUserId exists and is the most recent
    const keepUser = allUsers.rows.find(user => user.id === keepUserId)
    if (!keepUser) {
      return NextResponse.json(
        { error: 'Keep user ID not found for this email' },
        { status: 400 }
      )
    }

    // Get users to remove (all except the one to keep)
    const usersToRemove = allUsers.rows.filter(user => user.id !== keepUserId)
    
    console.log(`Cleaning up ${usersToRemove.length} duplicate users for email: ${email}`)
    console.log('Keeping user:', keepUser)
    console.log('Removing users:', usersToRemove)

    // Start transaction
    await query('BEGIN')

    try {
      // Remove duplicate users
      for (const userToRemove of usersToRemove) {
        console.log(`Removing user: ${userToRemove.id} (${userToRemove.username})`)
        
        // Delete user-related data first
        await query('DELETE FROM cart_items WHERE user_id = $1', [userToRemove.id])
        await query('DELETE FROM product_reviews WHERE user_id = $1', [userToRemove.id])
        await query('DELETE FROM user_points WHERE user_id = $1', [userToRemove.id])
        await query('DELETE FROM user_sessions WHERE user_id = $1', [userToRemove.id])
        await query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userToRemove.id])
        await query('DELETE FROM user_referrals WHERE referrer_id = $1 OR referred_id = $1', [userToRemove.id])
        await query('DELETE FROM user_referral_codes WHERE user_id = $1', [userToRemove.id])
        await query('DELETE FROM user_profiles WHERE user_id = $1', [userToRemove.id])
        
        // Finally delete the user
        await query('DELETE FROM users WHERE id = $1', [userToRemove.id])
      }

      // Commit transaction
      await query('COMMIT')

      return NextResponse.json({
        success: true,
        message: `Successfully cleaned up ${usersToRemove.length} duplicate users`,
        keptUser: keepUser,
        removedUsers: usersToRemove
      })

    } catch (error) {
      // Rollback transaction
      await query('ROLLBACK')
      throw error
    }

  } catch (error) {
    console.error('Error cleaning up duplicate users:', error)
    return NextResponse.json(
      { 
        error: 'Failed to cleanup duplicate users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
