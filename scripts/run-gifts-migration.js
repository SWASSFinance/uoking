require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function runMigration() {
  const client = await pool.connect()
  
  try {
    console.log('Starting gifts migration...')
    
    // Create gifts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gifts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price_threshold DECIMAL(10,2) NOT NULL CHECK (price_threshold > 0),
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)
    console.log('✅ Gifts table created')

    // Add gift_id column to orders table
    await client.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_id UUID REFERENCES gifts(id) ON DELETE SET NULL
    `)
    console.log('✅ gift_id column added to orders table')

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_gifts_price_threshold ON gifts(price_threshold)
    `)
    console.log('✅ Price threshold index created')

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_gifts_active ON gifts(is_active) WHERE is_active = true
    `)
    console.log('✅ Active gifts index created')

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_gift_id ON orders(gift_id)
    `)
    console.log('✅ Orders gift_id index created')

    // Insert sample gifts
    const sampleGifts = [
      { name: 'Small Token', description: 'A small token of appreciation', price_threshold: 25.00, sort_order: 1 },
      { name: 'Medium Gift', description: 'A nice gift for loyal customers', price_threshold: 50.00, sort_order: 2 },
      { name: 'Premium Gift', description: 'A premium gift for big spenders', price_threshold: 100.00, sort_order: 3 },
      { name: 'VIP Gift', description: 'An exclusive VIP gift', price_threshold: 200.00, sort_order: 4 }
    ]

    for (const gift of sampleGifts) {
      await client.query(`
        INSERT INTO gifts (name, description, price_threshold, sort_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [gift.name, gift.description, gift.price_threshold, gift.sort_order])
    }
    console.log('✅ Sample gifts inserted')

    console.log('🎉 Gifts migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

runMigration().catch(console.error)
