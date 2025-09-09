const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function runMigration() {
  const client = await pool.connect()
  
  try {
    console.log('Starting account rank migration...')
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_account_rank_to_users.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Execute the migration
    await client.query(migrationSQL)
    
    console.log('✅ Account rank migration completed successfully!')
    console.log('Added account_rank field to users table with default value 0')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    
    if (error.message.includes('already exists')) {
      console.log('ℹ️  The account_rank column already exists. Migration may have been run before.')
    } else {
      throw error
    }
  } finally {
    client.release()
    await pool.end()
  }
}

// Run the migration
runMigration().catch(console.error)
