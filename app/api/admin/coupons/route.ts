import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'
import { createNoCacheResponse } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.isAdmin) {
      return createNoCacheResponse(
        { error: 'Unauthorized' },
        401
      )
    }

    const result = await query(`
      SELECT 
        id, code, name, description, type, value,
        discount_type, discount_value, is_unlimited, max_uses, used_count, is_active,
        starts_at, expires_at, created_at, updated_at
      FROM coupons 
      ORDER BY created_at DESC
    `)

    return createNoCacheResponse(result.rows || [])
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return createNoCacheResponse(
      { error: 'Failed to fetch coupons' },
      500
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check if coupon code already exists
    const existingCoupon = await query(`
      SELECT id FROM coupons WHERE code = $1
    `, [code.toUpperCase()])

    if (existingCoupon.rows && existingCoupon.rows.length > 0) {
      return createNoCacheResponse(
        { error: 'Coupon code already exists' },
        400
      )
    }

    // Insert new coupon - using existing table structure
    const result = await query(`
      INSERT INTO coupons (
        code, name, description, type, value,
        discount_type, discount_value, is_unlimited, max_uses, is_active, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
      valid_until || null
    ])

    return createNoCacheResponse(result.rows[0])
  } catch (error) {
    console.error('Error creating coupon:', error)
    return createNoCacheResponse(
      { error: 'Failed to create coupon' },
      500
    )
  }
} 