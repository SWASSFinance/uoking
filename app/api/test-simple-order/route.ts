import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    console.log('=== SIMPLE ORDER TEST ===')
    
    const orderId = '14f80fa9-519c-49b5-9378-3bb44501e8ac'
    
    // Test 1: Basic order query
    console.log('Test 1: Basic order query...')
    try {
      const basicOrder = await query(`
        SELECT id, status, created_at FROM orders WHERE id = $1
      `, [orderId])
      console.log('✅ Basic order query successful:', basicOrder.rows?.length || 0, 'rows')
    } catch (error) {
      console.error('❌ Basic order query failed:', error)
      return NextResponse.json({ error: 'Basic order query failed', details: error }, { status: 500 })
    }
    
    // Test 2: Order with user join
    console.log('Test 2: Order with user join...')
    try {
      const orderWithUser = await query(`
        SELECT o.id, o.status, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = $1
      `, [orderId])
      console.log('✅ Order with user join successful:', orderWithUser.rows?.length || 0, 'rows')
    } catch (error) {
      console.error('❌ Order with user join failed:', error)
      return NextResponse.json({ error: 'Order with user join failed', details: error }, { status: 500 })
    }
    
    // Test 3: Order items query
    console.log('Test 3: Order items query...')
    try {
      const orderItems = await query(`
        SELECT id, order_id, product_id, quantity
        FROM order_items 
        WHERE order_id = $1
      `, [orderId])
      console.log('✅ Order items query successful:', orderItems.rows?.length || 0, 'rows')
    } catch (error) {
      console.error('❌ Order items query failed:', error)
      return NextResponse.json({ error: 'Order items query failed', details: error }, { status: 500 })
    }
    
    // Test 4: Complex order items with joins
    console.log('Test 4: Complex order items with joins...')
    try {
      const complexItems = await query(`
        SELECT 
          oi.id,
          oi.order_id,
          p.name as product_name,
          p.image_url as product_image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `, [orderId])
      console.log('✅ Complex order items query successful:', complexItems.rows?.length || 0, 'rows')
    } catch (error) {
      console.error('❌ Complex order items query failed:', error)
      return NextResponse.json({ error: 'Complex order items query failed', details: error }, { status: 500 })
    }
    
    // Test 5: Full complex query with STRING_AGG
    console.log('Test 5: Full complex query with STRING_AGG...')
    try {
      const fullQuery = await query(`
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
      console.log('✅ Full complex query successful:', fullQuery.rows?.length || 0, 'rows')
    } catch (error) {
      console.error('❌ Full complex query failed:', error)
      return NextResponse.json({ error: 'Full complex query failed', details: error }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, message: 'All tests passed' })
    
  } catch (error) {
    console.error('=== CRITICAL ERROR ===')
    console.error('Error:', error)
    return NextResponse.json({ error: 'Critical error', details: error }, { status: 500 })
  }
}
