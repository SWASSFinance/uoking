import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Use the exact same Discord OAuth URL that NextAuth uses
    const clientId = process.env.DISCORD_CLIENT_ID
    const baseUrl = process.env.NEXTAUTH_URL || 'https://uoking.vercel.app'
    const redirectUri = `${baseUrl}/api/auth/callback/discord`
    const callbackUrl = new URL('/account', request.url).toString()
    
    // Create the exact same Discord OAuth URL that NextAuth creates
    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize')
    discordAuthUrl.searchParams.set('client_id', clientId!)
    discordAuthUrl.searchParams.set('redirect_uri', redirectUri)
    discordAuthUrl.searchParams.set('response_type', 'code')
    discordAuthUrl.searchParams.set('scope', 'identify email')
    discordAuthUrl.searchParams.set('state', encodeURIComponent(callbackUrl))
    
    return NextResponse.redirect(discordAuthUrl)
  } catch (error) {
    console.error('Error in Discord linking:', error)
    return NextResponse.redirect(new URL('/account', request.url))
  }
}
