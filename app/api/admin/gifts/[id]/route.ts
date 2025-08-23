import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(`
      SELECT id, name, description, price_threshold, is_active, sort_order, created_at, updated_at
      FROM gifts 
      WHERE id = $1
    `, [params.id])

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching gift:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gift' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, price_threshold, is_active, sort_order } = body

    // Validation
    if (!name || !price_threshold) {
      return NextResponse.json(
        { error: 'Name and price threshold are required' },
        { status: 400 }
      )
    }

    if (price_threshold <= 0) {
      return NextResponse.json(
        { error: 'Price threshold must be greater than 0' },
        { status: 400 }
      )
    }

    const result = await query(`
      UPDATE gifts 
      SET name = $1, description = $2, price_threshold = $3, is_active = $4, sort_order = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING id, name, description, price_threshold, is_active, sort_order, created_at, updated_at
    `, [name, description || '', price_threshold, is_active !== false, sort_order || 0, params.id])

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating gift:', error)
    return NextResponse.json(
      { error: 'Failed to update gift' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if gift is used in any orders
    const ordersResult = await query(`
      SELECT COUNT(*) as count FROM orders WHERE gift_id = $1
    `, [params.id])

    const orderCount = parseInt(ordersResult.rows[0].count)
    if (orderCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete gift. It is used in ${orderCount} order(s).` },
        { status: 400 }
      )
    }

    const result = await query(`
      DELETE FROM gifts WHERE id = $1
    `, [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gift:', error)
    return NextResponse.json(
      { error: 'Failed to delete gift' },
      { status: 500 }
    )
  }
}
