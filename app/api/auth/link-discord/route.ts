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
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://uoking.vercel.app'}/api/auth/link-discord/callback`
    
    // Create state parameter with user info and callback URL
    const state = Buffer.from(JSON.stringify({
      userId: session.user.id,
      userEmail: session.user.email,
      callbackUrl: callbackUrl
    })).toString('base64')
    
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify&state=${state}`
    
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
