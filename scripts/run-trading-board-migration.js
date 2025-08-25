require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')
const fs = require('fs');
const path = require('path');

// Read the migration file
const migrationPath = path.join(__dirname, '..', 'migrations', 'add_trading_board.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function runMigration() {
  const client = await pool.connect()
  
  try {
    console.log('Running trading board migration...');
    
    // Execute the entire migration as one statement to maintain order
    console.log('Executing trading board migration...');
    await client.query(migrationSQL);
    
    console.log('✅ Trading board migration completed successfully!');
    console.log('📋 Created trading_posts table with indexes');
    console.log('🔒 Only plot owners can create posts');
    console.log('🌐 Public viewing available');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
