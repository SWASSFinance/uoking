import { NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    console.log('Testing session...')
    
    const session = await auth()
    console.log('Session result:', session)
    
    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: 'No session found'
      })
    }
    
    if (!session.user) {
      return NextResponse.json({
        authenticated: false,
        message: 'Session exists but no user data'
      })
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
      },
      session: session
    })
    
  } catch (error) {
    console.error('Session test error:', error)
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
