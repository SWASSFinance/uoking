import { NextRequest, NextResponse } from 'next/server'
import { auth, signOut } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    console.log('=== FORCE SESSION REFRESH ===')
    
    // Get current session
    const session = await auth()
    console.log('Current session before refresh:', {
      email: session?.user?.email,
      id: session?.user?.id,
      username: session?.user?.username
    })

    // Force sign out to clear the session
    await signOut({ redirect: false })
    
    console.log('Session cleared, user should re-authenticate')
    
    return NextResponse.json({
      success: true,
      message: 'Session cleared. Please log in again.',
      redirectTo: '/login'
    })

  } catch (error) {
    console.error('Force session refresh error:', error)
    return NextResponse.json({
      error: 'Failed to refresh session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
