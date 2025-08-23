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

async function runPaymentTransactionMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting payment_transaction_id migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_payment_transaction_id_to_orders.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executing migration SQL...');
    await client.query(migrationSQL);
    
    console.log('✓ Added payment_transaction_id column to orders table');
    console.log('✓ Created index on payment_transaction_id');
    console.log('✓ Added column comment');
    
    // Verify the column was added
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'payment_transaction_id'
    `);
    
    if (result.rows.length > 0) {
      console.log('✓ Verification successful: payment_transaction_id column exists');
      console.log('Column details:', result.rows[0]);
    } else {
      console.error('✗ Verification failed: payment_transaction_id column not found');
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    
    // Check if column already exists
    if (error.message.includes('already exists')) {
      console.log('Column already exists - migration may have been run before');
    } else {
      throw error;
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runPaymentTransactionMigration().catch(console.error);
