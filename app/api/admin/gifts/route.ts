import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      SELECT id, name, description, price_threshold, is_active, sort_order, created_at, updated_at
      FROM gifts 
      ORDER BY sort_order ASC, price_threshold ASC
    `)
    
    return NextResponse.json(result.rows || [])
  } catch (error) {
    console.error('Error fetching gifts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gifts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
      INSERT INTO gifts (name, description, price_threshold, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, price_threshold, is_active, sort_order, created_at, updated_at
    `, [name, description || '', price_threshold, is_active !== false, sort_order || 0])

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating gift:', error)
    return NextResponse.json(
      { error: 'Failed to create gift' },
      { status: 500 }
    )
  }
}
