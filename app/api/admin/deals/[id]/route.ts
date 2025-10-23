import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { addNoCacheHeaders, createNoCacheResponse } from '@/lib/api-utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { product_id, discount_percentage, start_date, end_date } = body

    // Validate required fields
    if (!product_id || !discount_percentage || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const productResult = await query(`
      SELECT id FROM products WHERE id = $1
    `, [product_id])

    if (!productResult.rows || productResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if there's already a deal for this date (excluding current deal)
    const existingDeal = await query(`
      SELECT id FROM deal_of_the_day WHERE start_date = $1 AND id != $2
    `, [start_date, params.id])

    if (existingDeal.rows && existingDeal.rows.length > 0) {
      return NextResponse.json(
        { error: 'A deal already exists for this date' },
        { status: 409 }
      )
    }

    // Update deal
    await query(`
      UPDATE deal_of_the_day 
      SET 
        product_id = $1,
        discount_percentage = $2,
        start_date = $3,
        end_date = $4,
        updated_at = NOW()
      WHERE id = $5
    `, [product_id, discount_percentage, start_date, end_date, params.id])

    return createNoCacheResponse({
      success: true,
      message: 'Deal updated successfully'
    })

  } catch (error) {
    console.error('Error updating deal:', error)
    return createNoCacheResponse(
      { error: 'Failed to update deal' },
      500
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete deal
    await query(`
      DELETE FROM deal_of_the_day WHERE id = $1
    `, [params.id])

    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
} 