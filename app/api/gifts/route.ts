import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartTotal = parseFloat(searchParams.get('cartTotal') || '0')

    // Get all active gifts that the cart total qualifies for
    const result = await query(`
      SELECT id, name, description, price_threshold, sort_order
      FROM gifts 
      WHERE is_active = true AND price_threshold <= $1
      ORDER BY sort_order ASC, price_threshold ASC
    `, [cartTotal])
    
    return NextResponse.json(result.rows || [])
  } catch (error) {
    console.error('Error fetching gifts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gifts' },
      { status: 500 }
    )
  }
}
