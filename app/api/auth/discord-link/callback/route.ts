import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This will be the user's email
    
    if (!code || !state) {
      return NextResponse.redirect(new URL('/account?error=missing_params', request.url))
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXTAUTH_URL || 'https://uoking.vercel.app'}/api/auth/discord-link/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Discord token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(new URL('/account?error=token_exchange_failed', request.url))
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userResponse.ok) {
      console.error('Discord user info fetch failed:', await userResponse.text())
      return NextResponse.redirect(new URL('/account?error=user_info_failed', request.url))
    }

    const discordUser = await userResponse.json()

    // Update the user's Discord information in the database
    await query(`
      UPDATE users 
      SET 
        discord_username = $1,
        discord_id = $2,
        updated_at = NOW()
      WHERE email = $3
    `, [discordUser.username, discordUser.id, state])

    // Redirect back to account page with success
    return NextResponse.redirect(new URL('/account?discord_linked=true', request.url))
  } catch (error) {
    console.error('Error in Discord callback:', error)
    return NextResponse.redirect(new URL('/account?error=callback_failed', request.url))
  }
}
