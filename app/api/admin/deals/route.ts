import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        d.id,
        d.product_id,
        p.name as product_name,
        d.discount_percentage,
        d.start_date,
        d.end_date,
        d.is_active
      FROM deal_of_the_day d
      JOIN products p ON d.product_id = p.id
      ORDER BY d.start_date DESC
    `)

    return NextResponse.json({ deals: result.rows || [] })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Check if there's already a deal for this date
    const existingDeal = await query(`
      SELECT id FROM deal_of_the_day WHERE start_date = $1
    `, [start_date])

    if (existingDeal.rows && existingDeal.rows.length > 0) {
      return NextResponse.json(
        { error: 'A deal already exists for this date' },
        { status: 409 }
      )
    }

    // Create new deal
    const result = await query(`
      INSERT INTO deal_of_the_day (
        product_id, 
        discount_percentage, 
        start_date, 
        end_date, 
        is_active
      ) VALUES ($1, $2, $3, $4, true)
      RETURNING id
    `, [product_id, discount_percentage, start_date, end_date])

    return NextResponse.json({
      success: true,
      message: 'Deal created successfully',
      dealId: result.rows[0].id
    })

  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
} 