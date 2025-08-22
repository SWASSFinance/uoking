import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    console.log('=== BASIC DATABASE TEST ===')
    
    // Test 1: Simple connection test
    console.log('Test 1: Simple connection...')
    const connectionTest = await query('SELECT NOW() as timestamp')
    console.log('✅ Connection test successful:', connectionTest.rows[0])
    
    // Test 2: Simple orders count
    console.log('Test 2: Orders count...')
    const ordersCount = await query('SELECT COUNT(*) as count FROM orders')
    console.log('✅ Orders count successful:', ordersCount.rows[0].count)
    
    // Test 3: Simple order_items count
    console.log('Test 3: Order items count...')
    const itemsCount = await query('SELECT COUNT(*) as count FROM order_items')
    console.log('✅ Order items count successful:', itemsCount.rows[0].count)
    
    // Test 4: Simple products count
    console.log('Test 4: Products count...')
    const productsCount = await query('SELECT COUNT(*) as count FROM products')
    console.log('✅ Products count successful:', productsCount.rows[0].count)
    
    // Test 5: Simple categories count
    console.log('Test 5: Categories count...')
    const categoriesCount = await query('SELECT COUNT(*) as count FROM categories')
    console.log('✅ Categories count successful:', categoriesCount.rows[0].count)
    
    return NextResponse.json({
      success: true,
      connection: connectionTest.rows[0],
      counts: {
        orders: ordersCount.rows[0].count,
        orderItems: itemsCount.rows[0].count,
        products: productsCount.rows[0].count,
        categories: categoriesCount.rows[0].count
      }
    })
    
  } catch (error) {
    console.error('=== BASIC TEST ERROR ===')
    console.error('Error type:', typeof error)
    console.error('Error message:', error instanceof Error ? error.message : 'No message')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}
