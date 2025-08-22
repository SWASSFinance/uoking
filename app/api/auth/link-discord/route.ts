import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Simply redirect to Discord OAuth - let NextAuth handle the linking
  const callbackUrl = new URL('/account', request.url).toString()
  const discordAuthUrl = new URL('/api/auth/signin', request.url)
  discordAuthUrl.searchParams.set('provider', 'discord')
  discordAuthUrl.searchParams.set('callbackUrl', callbackUrl)
  
  return NextResponse.redirect(discordAuthUrl)
}
