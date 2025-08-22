import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    console.log('=== CHECKING ORDERS TABLE SCHEMA ===')
    
    // Check orders table schema
    const ordersSchema = await query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `)
    
    console.log('Orders table schema:', ordersSchema.rows)
    
    // Check users table schema for character-related fields
    const usersSchema = await query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND (column_name LIKE '%character%' OR column_name LIKE '%delivery%')
      ORDER BY ordinal_position
    `)
    
    console.log('Users table character/delivery fields:', usersSchema.rows)
    
    // Get a sample order to see what delivery fields are populated
    const sampleOrder = await query(`
      SELECT 
        id,
        delivery_character,
        delivery_location,
        delivery_shard,
        user_id
      FROM orders 
      LIMIT 1
    `)
    
    console.log('Sample order delivery fields:', sampleOrder.rows[0])
    
    // Check if users table has character_names field
    const userWithCharacters = await query(`
      SELECT 
        id,
        email,
        character_names
      FROM users 
      WHERE character_names IS NOT NULL 
      LIMIT 1
    `)
    
    console.log('User with character_names:', userWithCharacters.rows[0])
    
    return NextResponse.json({
      success: true,
      ordersSchema: ordersSchema.rows,
      usersCharacterFields: usersSchema.rows,
      sampleOrder: sampleOrder.rows[0],
      userWithCharacters: userWithCharacters.rows[0]
    })
    
  } catch (error) {
    console.error('Schema test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}
