import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        price,
        image_url,
        status
      FROM products 
      WHERE status = 'active'
      ORDER BY name
    `)

    return NextResponse.json({ products: result.rows || [] })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 