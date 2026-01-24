const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false
})

async function applyMigration() {
  const client = await pool.connect()
  
  try {
    console.log('Starting payer_email migration...')
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'migrations', 'add_payer_email_to_orders.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Execute the migration
    await client.query('BEGIN')
    console.log('Executing migration SQL...')
    await client.query(sql)
    await client.query('COMMIT')
    
    console.log('Migration applied successfully!')
    
    // Verify the column was added
    const verifyResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'orders' AND column_name = 'payer_email'
    `)
    
    if (verifyResult.rows.length > 0) {
      console.log('✓ payer_email column verified:', verifyResult.rows[0])
    } else {
      console.error('✗ payer_email column not found after migration!')
      process.exit(1)
    }
    
    // Check how many orders have payer_email populated
    const countResult = await client.query(`
      SELECT COUNT(*) as total, COUNT(payer_email) as with_payer_email
      FROM orders
    `)
    
    console.log('Order statistics:')
    console.log(`  Total orders: ${countResult.rows[0].total}`)
    console.log(`  Orders with payer_email: ${countResult.rows[0].with_payer_email}`)
    
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

applyMigration()
