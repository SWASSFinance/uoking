const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

async function addOrderFields() {
  const client = await pool.connect();
  
  try {
    console.log('Adding missing fields to orders table...');
    
    // Add cashback_used field
    console.log('Adding cashback_used field...');
    await client.query(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'orders' AND column_name = 'cashback_used'
          ) THEN
              ALTER TABLE orders ADD COLUMN cashback_used DECIMAL(10,2) DEFAULT 0 CHECK (cashback_used >= 0);
          END IF;
      END $$;
    `);
    
    // Add coupon_code field
    console.log('Adding coupon_code field...');
    await client.query(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'orders' AND column_name = 'coupon_code'
          ) THEN
              ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(50);
          END IF;
      END $$;
    `);
    
    // Add indexes
    console.log('Adding indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_cashback_used ON orders(cashback_used) WHERE cashback_used > 0;
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON orders(coupon_code) WHERE coupon_code IS NOT NULL;
    `);
    
    console.log('✅ Order fields added successfully');
    
  } catch (error) {
    console.error('❌ Error adding order fields:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addOrderFields(); 