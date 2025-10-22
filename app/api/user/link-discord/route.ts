import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function POST(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()

    const body = await request.json()
    const { discordUsername, discordId, profileImageUrl } = body

    if (!discordUsername || !discordId) {
      return NextResponse.json({ error: 'Discord username and ID are required' }, { status: 400 })
    }

    // Check if Discord ID is already linked to another account
    const existingDiscordUser = await query(`
      SELECT id, email FROM users WHERE discord_id = $1 AND id != $2
    `, [discordId, validatedUser.id])

    if (existingDiscordUser.rows && existingDiscordUser.rows.length > 0) {
      return NextResponse.json({ 
        error: 'This Discord account is already linked to another user' 
      }, { status: 400 })
    }

    // Update user with Discord information using validated user ID
    await query(`
      UPDATE users 
      SET 
        discord_username = $1,
        discord_id = $2,
        updated_at = NOW()
      WHERE id = $3
    `, [discordUsername, discordId, validatedUser.id])

    // Update profile image if provided
    if (profileImageUrl) {
      await query(`
        INSERT INTO user_profiles (user_id, profile_image_url, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          profile_image_url = EXCLUDED.profile_image_url,
          updated_at = NOW()
      `, [validatedUser.id, profileImageUrl])
    }

    return NextResponse.json({
      success: true,
      message: 'Discord account linked successfully'
    })

  } catch (error) {
    console.error('Error linking Discord account:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to link Discord account' },
      { status: 500 }
    )
  }
} 