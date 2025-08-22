import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    // Check if user is already authenticated
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get the callback URL from query params
    const { searchParams } = new URL(request.url)
    const callbackUrl = searchParams.get('callbackUrl') || '/account'
    
    // Create Discord OAuth URL with state parameter to identify the user
    const discordClientId = process.env.DISCORD_CLIENT_ID
    
    if (!discordClientId) {
      console.error('DISCORD_CLIENT_ID environment variable is not set')
      return NextResponse.json(
        { error: 'Discord OAuth is not configured' },
        { status: 500 }
      )
    }
    
    // Use NextAuth's signin URL with Discord provider and custom callback
    const discordAuthUrl = `/api/auth/signin/discord?callbackUrl=${encodeURIComponent(callbackUrl)}`
    
    console.log('Discord OAuth URL created:', {
      clientId: discordClientId,
      authUrl: discordAuthUrl
    })
    
    return NextResponse.json({ 
      success: true,
      authUrl: discordAuthUrl 
    })
    
  } catch (error) {
    console.error('Error creating Discord auth URL:', error)
    return NextResponse.json(
      { error: 'Failed to create Discord auth URL' },
      { status: 500 }
    )
  }
}
