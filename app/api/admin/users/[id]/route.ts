import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    const result = await query(`
      SELECT 
        u.id, 
        u.email, 
        u.username, 
        u.first_name, 
        u.last_name, 
        u.discord_username, 
        u.main_shard, 
        u.character_names, 
        u.status, 
        u.email_verified, 
        u.is_admin, 
        u.created_at, 
        u.updated_at, 
        u.last_login_at,
        COALESCE(up.referral_cash, 0) as referral_cash
      FROM users u
      LEFT JOIN user_points up ON u.id = up.user_id
      WHERE u.id = $1
    `, [userId])

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Check if user exists
    const userCheck = await query(`
      SELECT id, email FROM users WHERE id = $1
    `, [userId])

    if (!userCheck.rows || userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (this will cascade to related tables due to foreign key constraints)
    await query(`
      DELETE FROM users WHERE id = $1
    `, [userId])

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const body = await request.json()
    const { 
      email, 
      username, 
      first_name, 
      last_name, 
      discord_username,
      main_shard,
      character_names,
      status,
      email_verified,
      is_admin,
      referral_cash
    } = body

    // Check if user exists
    const userCheck = await query(`
      SELECT id FROM users WHERE id = $1
    `, [userId])

    if (!userCheck.rows || userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user
    await query(`
      UPDATE users 
      SET 
        email = $1,
        username = $2,
        first_name = $3,
        last_name = $4,
        discord_username = $5,
        main_shard = $6,
        character_names = $7,
        status = $8,
        email_verified = $9,
        is_admin = $10,
        updated_at = NOW()
      WHERE id = $11
    `, [email, username, first_name, last_name, discord_username, main_shard, character_names, status, email_verified, is_admin, userId])

    // Update or create user_points record for cashback
    if (referral_cash !== undefined) {
      const pointsCheck = await query(`
        SELECT user_id FROM user_points WHERE user_id = $1
      `, [userId])

      if (pointsCheck.rows && pointsCheck.rows.length > 0) {
        // Update existing record
        await query(`
          UPDATE user_points 
          SET referral_cash = $1, updated_at = NOW()
          WHERE user_id = $2
        `, [referral_cash, userId])
      } else {
        // Create new record
        await query(`
          INSERT INTO user_points (user_id, referral_cash, created_at, updated_at)
          VALUES ($1, $2, NOW(), NOW())
        `, [userId, referral_cash])
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
} 