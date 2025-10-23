import { NextRequest, NextResponse } from 'next/server'
import { query, getUserReviewCount } from '@/lib/db'
import { validateSession, getAuthErrorResponse } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/user/profile API CALLED ===')
    
    // Validate session and get authenticated user
    const validatedUser = await validateSession()
    console.log('Validated user from session:', {
      id: validatedUser.id,
      email: validatedUser.email,
      username: validatedUser.username,
      isAdmin: validatedUser.isAdmin,
      status: validatedUser.status
    })

    // Get user profile from database using validated user ID
    // This ensures we only return data for the authenticated user
    const queryText = `
      SELECT 
        u.id, u.email, u.username, u.first_name, u.last_name, 
        u.discord_username, u.main_shard, u.character_names,
        u.status, u.email_verified, u.is_admin, u.created_at, u.last_login_at,
        u.review_count, u.rating_count, u.total_points_earned, u.account_rank,
        up.phone, up.address, up.city, up.state, up.zip_code, up.country, up.timezone,
        up.profile_image_url
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1
    `
    
    console.log('Executing query:', queryText)
    console.log('Query parameters:', [validatedUser.id])
    
    const result = await query(queryText, [validatedUser.id])
    
    console.log('Query result:', {
      rowCount: result.rows?.length || 0,
      userData: result.rows?.[0] ? {
        id: result.rows[0].id,
        email: result.rows[0].email,
        username: result.rows[0].username,
        first_name: result.rows[0].first_name,
        last_name: result.rows[0].last_name,
        discord_username: result.rows[0].discord_username,
        main_shard: result.rows[0].main_shard,
        character_names: result.rows[0].character_names,
        profile_image_url: result.rows[0].profile_image_url,
        phone: result.rows[0].phone,
        address: result.rows[0].address,
        city: result.rows[0].city,
        state: result.rows[0].state,
        zip_code: result.rows[0].zip_code,
        country: result.rows[0].country,
        timezone: result.rows[0].timezone,
        status: result.rows[0].status,
        email_verified: result.rows[0].email_verified,
        is_admin: result.rows[0].is_admin,
        created_at: result.rows[0].created_at,
        last_login_at: result.rows[0].last_login_at
      } : null
    })

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = result.rows[0]

    // Get actual review count from product_reviews table
    const actualReviewCount = await getUserReviewCount(user.id)

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      discord_username: user.discord_username,
      main_shard: user.main_shard,
      character_names: user.character_names || [],
      profile_image_url: user.profile_image_url,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zip_code: user.zip_code,
      country: user.country || 'United States',
      timezone: user.timezone,
      email_verified: user.email_verified,
      is_admin: user.is_admin,
      created_at: user.created_at,
      last_login_at: user.last_login_at,
      review_count: actualReviewCount,
      rating_count: user.rating_count || 0,
      total_points_earned: user.total_points_earned || 0,
      account_rank: user.account_rank || 0
    })

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