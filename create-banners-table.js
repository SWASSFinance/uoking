const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Database configuration
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

async function createBannersTable() {
  try {
    console.log('Creating banners table...')
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-banners-table.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Execute the SQL
    await pool.query(sqlContent)
    
    console.log('✅ Banners table created successfully!')
    
    // Verify the table was created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'banners'
    `)
    
    if (result.rows.length > 0) {
      console.log('✅ Table verification successful - banners table exists')
    } else {
      console.log('❌ Table verification failed - banners table not found')
    }
    
  } catch (error) {
    console.error('❌ Error creating banners table:', error.message)
    if (error.code === '42P07') {
      console.log('ℹ️  Table already exists, continuing...')
    } else {
      throw error
    }
  } finally {
    await pool.end()
  }
}

// Run the migration
createBannersTable()
  .then(() => {
    console.log('Migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  }) 