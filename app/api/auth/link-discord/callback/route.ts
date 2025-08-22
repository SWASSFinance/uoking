import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    if (error) {
      console.error('Discord OAuth error:', error)
      return NextResponse.redirect('/account?error=discord_auth_failed')
    }
    
    if (!code || !state) {
      return NextResponse.redirect('/account?error=missing_parameters')
    }
    
    // Decode state parameter
    let stateData
    try {
      const stateJson = Buffer.from(state, 'base64').toString()
      stateData = JSON.parse(stateJson)
    } catch (error) {
      console.error('Error decoding state:', error)
      return NextResponse.redirect('/account?error=invalid_state')
    }
    
    const { userId, userEmail, callbackUrl } = stateData
    
    // Exchange code for access token
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
        redirect_uri: `${process.env.NEXTAUTH_URL || 'https://uoking.vercel.app'}/api/auth/link-discord/callback`,
      }),
    })
    
    if (!tokenResponse.ok) {
      console.error('Failed to get Discord access token:', await tokenResponse.text())
      return NextResponse.redirect('/account?error=token_exchange_failed')
    }
    
    const tokenData = await tokenResponse.json()
    
    // Get Discord user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })
    
    if (!userResponse.ok) {
      console.error('Failed to get Discord user info:', await userResponse.text())
      return NextResponse.redirect('/account?error=user_info_failed')
    }
    
    const discordUser = await userResponse.json()
    
    // Update user's Discord information in database
    await query(`
      UPDATE users 
      SET 
        discord_username = $1,
        discord_id = $2,
        updated_at = NOW()
      WHERE id = $3 AND email = $4
    `, [discordUser.username, discordUser.id, userId, userEmail])
    
    // Redirect back to account page with success message
    return NextResponse.redirect(`${callbackUrl}?success=discord_linked&username=${discordUser.username}`)
    
  } catch (error) {
    console.error('Error in Discord callback:', error)
    return NextResponse.redirect('/account?error=callback_failed')
  }
}
