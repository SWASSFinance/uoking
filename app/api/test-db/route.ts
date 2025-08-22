import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const connectionTest = await query('SELECT NOW() as timestamp')
    console.log('Connection test result:', connectionTest.rows[0])
    
    // Test if orders table exists and has data
    const ordersTest = await query('SELECT COUNT(*) as count FROM orders')
    console.log('Orders table count:', ordersTest.rows[0].count)
    
    // Test if the specific order exists
    const specificOrder = await query(`
      SELECT id, status, created_at 
      FROM orders 
      WHERE id = '14f80fa9-519c-49b5-9378-3bb44501e8ac'
    `)
    console.log('Specific order test:', specificOrder.rows.length, 'rows found')
    
    // Test order_items table
    const orderItemsTest = await query('SELECT COUNT(*) as count FROM order_items')
    console.log('Order items table count:', orderItemsTest.rows[0].count)
    
    // Test products table
    const productsTest = await query('SELECT COUNT(*) as count FROM products')
    console.log('Products table count:', productsTest.rows[0].count)
    
    // Test categories table
    const categoriesTest = await query('SELECT COUNT(*) as count FROM categories')
    console.log('Categories table count:', categoriesTest.rows[0].count)
    
    // Test product_categories table
    const productCategoriesTest = await query('SELECT COUNT(*) as count FROM product_categories')
    console.log('Product categories table count:', productCategoriesTest.rows[0].count)
    
    return NextResponse.json({
      success: true,
      connection: connectionTest.rows[0],
      tables: {
        orders: ordersTest.rows[0].count,
        order_items: orderItemsTest.rows[0].count,
        products: productsTest.rows[0].count,
        categories: categoriesTest.rows[0].count,
        product_categories: productCategoriesTest.rows[0].count
      },
      specificOrder: specificOrder.rows.length > 0 ? specificOrder.rows[0] : null
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
} 