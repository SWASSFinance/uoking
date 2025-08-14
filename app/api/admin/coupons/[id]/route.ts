import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      code,
      description,
      discount_type,
      discount_value,
      is_unlimited,
      max_uses,
      is_active,
      valid_until
    } = body

    // Validate required fields
    if (!code || !description || !discount_type || discount_value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if coupon code already exists (excluding current coupon)
    const existingCoupon = await query(`
      SELECT id FROM coupons WHERE code = $1 AND id != $2
    `, [code.toUpperCase(), params.id])

    if (existingCoupon.rows && existingCoupon.rows.length > 0) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      )
    }

    // Update coupon - using existing table structure
    const result = await query(`
      UPDATE coupons SET 
        code = $1,
        name = $2,
        description = $3,
        type = $4,
        value = $5,
        discount_type = $6,
        discount_value = $7,
        is_unlimited = $8,
        max_uses = $9,
        is_active = $10,
        expires_at = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `, [
      code.toUpperCase(),
      description, // Use description as name
      description,
      discount_type, // Use discount_type as type
      discount_value,
      discount_type,
      discount_value,
      is_unlimited,
      max_uses,
      is_active,
      valid_until || null,
      params.id
    ])

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete coupon usage records first (due to foreign key constraint)
    await query(`
      DELETE FROM coupon_usage WHERE coupon_id = $1
    `, [params.id])

    // Delete the coupon
    const result = await query(`
      DELETE FROM coupons WHERE id = $1 RETURNING id
    `, [params.id])

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    )
  }
} 