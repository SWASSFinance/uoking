import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Direct Discord OAuth URL - bypasses NextAuth signin page
  const clientId = process.env.DISCORD_CLIENT_ID
  const redirectUri = new URL('/api/auth/callback/discord', request.url).toString()
  const callbackUrl = new URL('/account', request.url).toString()
  
  // Create Discord OAuth URL directly
  const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize')
  discordAuthUrl.searchParams.set('client_id', clientId!)
  discordAuthUrl.searchParams.set('redirect_uri', redirectUri)
  discordAuthUrl.searchParams.set('response_type', 'code')
  discordAuthUrl.searchParams.set('scope', 'identify email')
  discordAuthUrl.searchParams.set('state', encodeURIComponent(callbackUrl))
  
  return NextResponse.redirect(discordAuthUrl)
}
