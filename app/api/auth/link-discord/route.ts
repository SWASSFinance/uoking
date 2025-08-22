import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to Discord OAuth with specific parameters for account linking
    const callbackUrl = new URL('/account', request.url).toString()
    const discordAuthUrl = new URL('/api/auth/signin', request.url)
    discordAuthUrl.searchParams.set('provider', 'discord')
    discordAuthUrl.searchParams.set('callbackUrl', callbackUrl)
    discordAuthUrl.searchParams.set('prompt', 'consent')
    
    return NextResponse.redirect(discordAuthUrl)
  } catch (error) {
    console.error('Error in Discord linking:', error)
    return NextResponse.redirect(new URL('/account', request.url))
  }
}
