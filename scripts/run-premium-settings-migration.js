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
    console.log('Starting premium settings migration...')
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_premium_settings_table.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Execute the migration
    await client.query(migrationSQL)
    
    console.log('✅ Premium settings migration completed successfully!')
    console.log('Created premium_settings and contest_winners tables')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    
    if (error.message.includes('already exists')) {
      console.log('ℹ️  The tables may already exist. Migration may have been run before.')
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
