import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query, getUserReviewCount } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile from database
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
    `, [session.user.email])

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
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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

    // Get user ID from email
    const userResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userResult.rows[0].id

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
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
} 