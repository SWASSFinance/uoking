import { NextRequest, NextResponse } from 'next/server'
import { query, getUserReviewCount } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // OPTIMIZED: Single query to get user profile with all data
    const result = await query(`
      SELECT 
        u.id, u.email, u.username, u.first_name, u.last_name, 
        u.discord_username, u.main_shard, u.character_names,
        u.status, u.email_verified, u.is_admin, u.created_at, u.last_login_at,
        u.review_count, u.rating_count, u.total_points_earned, u.account_rank,
        up.phone, up.address, up.city, up.state, up.zip_code, up.country, up.timezone,
        up.profile_image_url
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.email = $1
      ORDER BY u.created_at DESC
      LIMIT 1
    `, [session.user.email])

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const profileUser = result.rows[0]

    // Get actual review count from product_reviews table
    const actualReviewCount = await getUserReviewCount(profileUser.id)

    // FORCE NO CACHING - Add cache-busting headers
    const response = NextResponse.json({
      id: profileUser.id,
      email: profileUser.email,
      username: profileUser.username,
      first_name: profileUser.first_name,
      last_name: profileUser.last_name,
      discord_username: profileUser.discord_username,
      main_shard: profileUser.main_shard,
      character_names: profileUser.character_names || [],
      profile_image_url: profileUser.profile_image_url,
      phone: profileUser.phone,
      address: profileUser.address,
      city: profileUser.city,
      state: profileUser.state,
      zip_code: profileUser.zip_code,
      country: profileUser.country || 'United States',
      timezone: profileUser.timezone,
      email_verified: profileUser.email_verified,
      is_admin: profileUser.is_admin,
      created_at: profileUser.created_at,
      last_login_at: profileUser.last_login_at,
      review_count: actualReviewCount,
      rating_count: profileUser.rating_count || 0,
      total_points_earned: profileUser.total_points_earned || 0,
      account_rank: profileUser.account_rank || 0
    })

    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response

  } catch (error) {
    console.error('Error fetching user profile:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Validate session and get authenticated user
    const validatedUser = await validateSession()

    const body = await request.json()
    const {
      first_name,
      last_name,
      discord_username,
      main_shard,
      character_names,
      phone,
      address,
      city,
      state,
      zip_code,
      country,
      timezone,
      profile_image_url
    } = body

    // Use validated user ID - ensures we only update the authenticated user's profile
    const userId = validatedUser.id

    // Update user table
    await query(`
      UPDATE users 
      SET 
        first_name = $1,
        last_name = $2,
        discord_username = $3,
        main_shard = $4,
        character_names = $5,
        updated_at = NOW()
      WHERE id = $6
    `, [first_name, last_name, discord_username, main_shard, character_names, userId])

    // Update or insert user profile
    await query(`
      INSERT INTO user_profiles (
        user_id, phone, address, city, state, zip_code, country, timezone, profile_image_url, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        zip_code = EXCLUDED.zip_code,
        country = EXCLUDED.country,
        timezone = EXCLUDED.timezone,
        profile_image_url = EXCLUDED.profile_image_url,
        updated_at = NOW()
    `, [userId, phone, address, city, state, zip_code, country, timezone, profile_image_url])

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Error updating user profile:', error)
    
    if (error instanceof Error) {
      const { message, statusCode } = getAuthErrorResponse(error)
      return NextResponse.json({ error: message }, { status: statusCode })
    }
    
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
} 