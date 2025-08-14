import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

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
      is_admin
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