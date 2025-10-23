import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG SESSION ENDPOINT ===')
    
    const session = await auth()
    console.log('Raw session data:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      return NextResponse.json({
        error: 'No session found',
        session: session
      })
    }

    // Check what users exist with this email
    const allUsersWithEmail = await query(`
      SELECT 
        id, email, username, first_name, last_name, 
        created_at, status, is_admin, last_login_at,
        discord_username, main_shard, character_names
      FROM users 
      WHERE email = $1
      ORDER BY created_at DESC
    `, [session.user.email])

    console.log(`Found ${allUsersWithEmail.rows.length} users with email: ${session.user.email}`)
    console.log('All users:', allUsersWithEmail.rows)

    // Check what the session callback would return
    const sessionCallbackResult = await query(`
      SELECT 
        u.id, u.username, u.first_name, u.last_name, u.is_admin, u.status,
        u.discord_username, u.discord_id,
        up.profile_image_url
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.email = $1 AND u.status = 'active'
      ORDER BY u.created_at DESC
      LIMIT 1
    `, [session.user.email])

    console.log('Session callback would return:', sessionCallbackResult.rows[0])

    // Check what validateSession would return
    const validateSessionResult = await query(`
      SELECT id, email, username, is_admin, status
      FROM users 
      WHERE email = $1
      ORDER BY created_at DESC
      LIMIT 1
    `, [session.user.email])

    console.log('ValidateSession would return:', validateSessionResult.rows[0])

    return NextResponse.json({
      session: {
        email: session.user.email,
        id: session.user.id,
        username: session.user.username,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        isAdmin: session.user.isAdmin,
        status: session.user.status
      },
      allUsersWithEmail: allUsersWithEmail.rows,
      sessionCallbackResult: sessionCallbackResult.rows[0],
      validateSessionResult: validateSessionResult.rows[0],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Debug session error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
