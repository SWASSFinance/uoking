import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    console.log('=== TESTING ORDER QUERY WITHOUT AUTH ===')
    
    const orderId = '14f80fa9-519c-49b5-9378-3bb44501e8ac'
    
    // Test the exact same queries from the orders API
    console.log('Step 1: Testing order query...')
    const orderResult = await query(`
      SELECT 
        o.*,
        u.email as user_email,
        u.username,
        u.first_name,
        u.last_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [orderId])

    console.log('Order query result:', orderResult.rows?.length || 0, 'rows')
    
    if (orderResult.rows?.length > 0) {
      console.log('Order found:', orderResult.rows[0])
    }

    // Test the order items query
    console.log('Step 2: Testing order items query...')
    const itemsResult = await query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image,
        STRING_AGG(DISTINCT c.name, ', ') as category
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE oi.order_id = $1
      GROUP BY oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price, oi.total_price, oi.created_at, oi.updated_at, p.name, p.image_url
      ORDER BY oi.created_at
    `, [orderId])

    console.log('Order items query result:', itemsResult.rows?.length || 0, 'rows')
    
    if (itemsResult.rows?.length > 0) {
      console.log('First order item:', itemsResult.rows[0])
    }

    return NextResponse.json({
      success: true,
      order: orderResult.rows?.[0] || null,
      items: itemsResult.rows || [],
      orderCount: orderResult.rows?.length || 0,
      itemsCount: itemsResult.rows?.length || 0
    })
    
  } catch (error) {
    console.error('=== ERROR IN ORDER QUERY TEST ===')
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : 'No message')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}
