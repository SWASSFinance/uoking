import { NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function GET() {
  try {
    console.log('Testing admin status...')
    
    const session = await auth()
    console.log('Session:', session ? 'Found' : 'Not found')
    
    if (!session?.user?.email) {
      return NextResponse.json({
        authenticated: false,
        isAdmin: false,
        message: 'No session or email found'
      })
    }
    
    console.log('Checking admin status for user:', session.user.email)
    
    // Check if user is admin
    const userResult = await query(`
      SELECT id, email, is_admin, username FROM users WHERE email = $1
    `, [session.user.email])

    console.log('User query result:', userResult.rows?.length || 0, 'rows')

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({
        authenticated: true,
        isAdmin: false,
        message: 'User not found in database'
      })
    }

    const user = userResult.rows[0]
    
    return NextResponse.json({
      authenticated: true,
      isAdmin: user.is_admin,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.is_admin
      },
      message: user.is_admin ? 'User is admin' : 'User is not admin'
    })
    
  } catch (error) {
    console.error('Admin test error:', error)
    return NextResponse.json({
      authenticated: false,
      isAdmin: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
