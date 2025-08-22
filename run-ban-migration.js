const { Pool } = require('pg')
const fs = require('fs')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
})

async function runBanMigration() {
  const client = await pool.connect()
  
  try {
    console.log('🚀 Starting ban system migration...')
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('./add-ban-system.sql', 'utf8')
    
    // Execute the entire SQL file as one statement
    try {
      console.log('Executing ban system migration...')
      await client.query(sqlContent)
      console.log('✅ SQL migration executed successfully')
    } catch (error) {
      if (error.code === '42710') { // Object already exists
        console.log(`⚠️  Some objects already exist: ${error.message}`)
      } else {
        console.error(`❌ Migration error:`, error.message)
        throw error
      }
    }
    
    console.log('✅ Ban system migration completed successfully!')
    
    // Test the functions
    console.log('\n🧪 Testing ban system functions...')
    
    // Test email ban check function
    const emailTest = await client.query('SELECT is_email_banned($1)', ['test@example.com'])
    console.log('✅ Email ban check function working')
    
    // Test IP ban check function
    const ipTest = await client.query('SELECT is_ip_banned($1)', ['192.168.1.1'])
    console.log('✅ IP ban check function working')
    
    console.log('\n🎉 Ban system is ready to use!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

runBanMigration().catch(console.error)
