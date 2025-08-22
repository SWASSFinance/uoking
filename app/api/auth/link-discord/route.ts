import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Use NextAuth's signin but with a special parameter to bypass the redirect
  const callbackUrl = new URL('/account', request.url).toString()
  const discordAuthUrl = new URL('/api/auth/signin', request.url)
  discordAuthUrl.searchParams.set('provider', 'discord')
  discordAuthUrl.searchParams.set('callbackUrl', callbackUrl)
  discordAuthUrl.searchParams.set('prompt', 'consent')
  discordAuthUrl.searchParams.set('force', 'true')
  
  return NextResponse.redirect(discordAuthUrl)
}
