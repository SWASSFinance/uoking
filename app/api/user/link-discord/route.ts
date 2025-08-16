import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { discordUsername, discordId, profileImageUrl } = body

    if (!discordUsername || !discordId) {
      return NextResponse.json({ error: 'Discord username and ID are required' }, { status: 400 })
    }

    // Check if Discord ID is already linked to another account
    const existingDiscordUser = await query(`
      SELECT id, email FROM users WHERE discord_id = $1 AND email != $2
    `, [discordId, session.user.email])

    if (existingDiscordUser.rows && existingDiscordUser.rows.length > 0) {
      return NextResponse.json({ 
        error: 'This Discord account is already linked to another user' 
      }, { status: 400 })
    }

    // Update user with Discord information
    await query(`
      UPDATE users 
      SET 
        discord_username = $1,
        discord_id = $2,
        updated_at = NOW()
      WHERE email = $3
    `, [discordUsername, discordId, session.user.email])

    // Update profile image if provided
    if (profileImageUrl) {
      await query(`
        INSERT INTO user_profiles (user_id, profile_image_url, updated_at)
        VALUES (
          (SELECT id FROM users WHERE email = $1),
          $2,
          NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
          profile_image_url = EXCLUDED.profile_image_url,
          updated_at = NOW()
      `, [session.user.email, profileImageUrl])
    }

    return NextResponse.json({
      success: true,
      message: 'Discord account linked successfully'
    })

  } catch (error) {
    console.error('Error linking Discord account:', error)
    return NextResponse.json(
      { error: 'Failed to link Discord account' },
      { status: 500 }
    )
  }
} 