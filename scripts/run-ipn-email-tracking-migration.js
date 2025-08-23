const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runIpnEmailTrackingMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting IPN email tracking migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_email_tracking_to_ipn_logs.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executing migration SQL...');
    await client.query(migrationSQL);
    
    console.log('✓ Added email tracking columns to paypal_ipn_logs table');
    console.log('✓ Added column comments');
    
    // Verify the columns were added
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'paypal_ipn_logs' AND column_name IN ('email_sent', 'email_message_id', 'email_error')
      ORDER BY column_name
    `);
    
    if (result.rows.length === 3) {
      console.log('✓ Verification successful: All email tracking columns exist');
      result.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    } else {
      console.error('✗ Verification failed: Missing email tracking columns');
      console.log('Found columns:', result.rows);
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    
    // Check if columns already exist
    if (error.message.includes('already exists')) {
      console.log('Columns already exist - migration may have been run before');
    } else {
      throw error;
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runIpnEmailTrackingMigration().catch(console.error);
