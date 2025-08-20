const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function addPlotOwnership() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Adding plot ownership fields...');
    
    await client.query('BEGIN');
    
    // Add ownership fields to plots table
    await client.query(`
      ALTER TABLE plots 
      ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS purchase_transaction_id UUID DEFAULT uuid_generate_v4()
    `);
    
    // Add indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_plots_owner_id ON plots(owner_id);
      CREATE INDEX IF NOT EXISTS idx_plots_available ON plots(is_available) WHERE is_available = true;
      CREATE INDEX IF NOT EXISTS idx_plots_purchased_at ON plots(purchased_at DESC);
    `);
    
    await client.query('COMMIT');
    console.log('✅ Plot ownership fields added successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error adding plot ownership fields:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
addPlotOwnership()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
