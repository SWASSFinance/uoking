import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { code, cartTotal } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      )
    }

    // Get user ID
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

    // Find the coupon - using the existing table structure
    const couponResult = await query(`
      SELECT 
        id, code, name, description, type, value,
        discount_type, discount_value, is_unlimited, max_uses, used_count, is_active,
        starts_at, expires_at
      FROM coupons 
      WHERE code = $1
    `, [code.toUpperCase()])

    if (!couponResult.rows || couponResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 400 }
      )
    }

    const coupon = couponResult.rows[0]

    // Check if coupon is active
    if (!coupon.is_active) {
      return NextResponse.json(
        { error: 'This coupon is no longer active' },
        { status: 400 }
      )
    }

    // Check if coupon has started
    if (coupon.starts_at && new Date() < new Date(coupon.starts_at)) {
      return NextResponse.json(
        { error: 'This coupon is not yet active' },
        { status: 400 }
      )
    }

    // Check if coupon has expired
    if (coupon.expires_at && new Date() > new Date(coupon.expires_at)) {
      return NextResponse.json(
        { error: 'This coupon has expired' },
        { status: 400 }
      )
    }

    // Check if coupon has reached its usage limit
    if (!coupon.is_unlimited && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json(
        { error: 'This coupon has reached its usage limit' },
        { status: 400 }
      )
    }

    // Check if user has already used this coupon (for non-unlimited coupons)
    if (!coupon.is_unlimited) {
      const usageResult = await query(`
        SELECT id FROM coupon_usage 
        WHERE coupon_id = $1 AND user_id = $2
      `, [coupon.id, userId])

      if (usageResult.rows && usageResult.rows.length > 0) {
        return NextResponse.json(
          { error: 'You have already used this coupon' },
          { status: 400 }
        )
      }
    }

    // Calculate discount - use discount_value if available, otherwise fall back to value
    let discountAmount = 0
    const discountValue = coupon.discount_value || coupon.value
    const discountType = coupon.discount_type || coupon.type

    if (discountType === 'percentage') {
      discountAmount = (cartTotal * discountValue) / 100
    } else if (discountType === 'fixed') {
      discountAmount = discountValue
    } else {
      // Handle other types like free_shipping
      discountAmount = 0
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal)

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discount_type: discountType,
        discount_value: discountValue,
        discount_amount: discountAmount
      }
    })

  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    )
  }
} 