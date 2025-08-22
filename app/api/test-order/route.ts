import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    console.log('Testing specific order...')
    
    const orderId = '14f80fa9-519c-49b5-9378-3bb44501e8ac'
    
    // Test 1: Check if order exists
    console.log('Test 1: Checking if order exists...')
    const orderExists = await query(`
      SELECT id, status, created_at, user_id 
      FROM orders 
      WHERE id = $1
    `, [orderId])
    
    console.log('Order exists result:', orderExists.rows?.length || 0, 'rows')
    
    if (orderExists.rows?.length > 0) {
      console.log('Order found:', orderExists.rows[0])
    }
    
    // Test 2: Check order_items for this order
    console.log('Test 2: Checking order items...')
    const orderItems = await query(`
      SELECT id, order_id, product_id, quantity, unit_price, total_price
      FROM order_items 
      WHERE order_id = $1
    `, [orderId])
    
    console.log('Order items result:', orderItems.rows?.length || 0, 'rows')
    
    // Test 3: Check if products exist for these items
    if (orderItems.rows?.length > 0) {
      const productIds = orderItems.rows.map(item => item.product_id)
      console.log('Product IDs:', productIds)
      
      const products = await query(`
        SELECT id, name, slug FROM products WHERE id = ANY($1)
      `, [productIds])
      
      console.log('Products found:', products.rows?.length || 0, 'rows')
    }
    
    // Test 4: Check database schema
    console.log('Test 4: Checking database schema...')
    const schemaCheck = await query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `)
    
    console.log('Orders table schema:', schemaCheck.rows)
    
    // Test 5: Check order_items schema
    const itemsSchemaCheck = await query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'order_items' 
      ORDER BY ordinal_position
    `)
    
    console.log('Order_items table schema:', itemsSchemaCheck.rows)
    
    return NextResponse.json({
      success: true,
      orderExists: orderExists.rows?.length > 0,
      orderData: orderExists.rows?.[0] || null,
      orderItemsCount: orderItems.rows?.length || 0,
      orderItems: orderItems.rows || [],
      ordersSchema: schemaCheck.rows,
      orderItemsSchema: itemsSchemaCheck.rows
    })
    
  } catch (error) {
    console.error('Order test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}
