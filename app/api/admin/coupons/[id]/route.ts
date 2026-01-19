import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { createNoCacheResponse } from '@/lib/api-utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: couponId } = await params
    const session = await auth()
    
    if (!session?.user?.isAdmin) {
      return createNoCacheResponse(
        { error: 'Unauthorized' },
        401
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
      return createNoCacheResponse(
        { error: 'Missing required fields' },
        400
      )
    }

    // Check if coupon code already exists (excluding current coupon)
    const existingCoupon = await query(`
      SELECT id FROM coupons WHERE code = $1 AND id != $2
    `, [code.toUpperCase(), couponId])

    if (existingCoupon.rows && existingCoupon.rows.length > 0) {
      return createNoCacheResponse(
        { error: 'Coupon code already exists' },
        400
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
      couponId
    ])

    if (!result.rows || result.rows.length === 0) {
      return createNoCacheResponse(
        { error: 'Coupon not found' },
        404
      )
    }

    return createNoCacheResponse(result.rows[0])
  } catch (error) {
    console.error('Error updating coupon:', error)
    return createNoCacheResponse(
      { error: 'Failed to update coupon' },
      500
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: couponId } = await params
    const session = await auth()
    
    if (!session?.user?.isAdmin) {
      return createNoCacheResponse(
        { error: 'Unauthorized' },
        401
      )
    }

    // Delete coupon usage records first (due to foreign key constraint)
    await query(`
      DELETE FROM coupon_usage WHERE coupon_id = $1
    `, [couponId])

    // Delete the coupon
    const result = await query(`
      DELETE FROM coupons WHERE id = $1 RETURNING id
    `, [couponId])

    if (!result.rows || result.rows.length === 0) {
      return createNoCacheResponse(
        { error: 'Coupon not found' },
        404
      )
    }

    return createNoCacheResponse({ success: true })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return createNoCacheResponse(
      { error: 'Failed to delete coupon' },
      500
    )
  }
} 