import { NextResponse } from 'next/server'
import { getAllOrders } from '@/lib/db'

// Disable caching for admin orders
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const orders = await getAllOrders()
    
    // Create response with no-cache headers
    const response = NextResponse.json(orders)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
} 