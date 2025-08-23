const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createIPNTable() {
  const client = await pool.connect();
  
  try {
    console.log('Creating PayPal IPN logs table...');
    
    // Create the paypal_ipn_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS paypal_ipn_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          
          -- IPN request data
          raw_body TEXT NOT NULL,
          headers JSONB,
          user_agent TEXT,
          ip_address INET,
          
          -- Parsed IPN data
          payment_status VARCHAR(50),
          txn_id VARCHAR(255),
          receiver_email VARCHAR(255),
          custom VARCHAR(255), -- Order ID
          mc_gross VARCHAR(50),
          mc_currency VARCHAR(10),
          
          -- Processing status
          verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'failed'
          processing_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'error'
          error_message TEXT,
          
          -- Order details (if found)
          order_id UUID REFERENCES orders(id),
          order_status VARCHAR(50),
          
          -- Timestamps
          received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          processed_at TIMESTAMP WITH TIME ZONE,
          
          -- Constraints
          CONSTRAINT paypal_ipn_logs_verification_status_check 
              CHECK (verification_status IN ('pending', 'verified', 'failed')),
          CONSTRAINT paypal_ipn_logs_processing_status_check 
              CHECK (processing_status IN ('pending', 'success', 'error'))
      )
    `);
    
    console.log('✓ Created paypal_ipn_logs table');
    
    // Create indexes for efficient querying
    await client.query(`CREATE INDEX IF NOT EXISTS idx_paypal_ipn_logs_txn_id ON paypal_ipn_logs(txn_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_paypal_ipn_logs_order_id ON paypal_ipn_logs(order_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_paypal_ipn_logs_received_at ON paypal_ipn_logs(received_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_paypal_ipn_logs_processing_status ON paypal_ipn_logs(processing_status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_paypal_ipn_logs_verification_status ON paypal_ipn_logs(verification_status)`);
    
    console.log('✓ Created indexes');
    console.log('✅ PayPal IPN logs table created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createIPNTable().catch(console.error);
