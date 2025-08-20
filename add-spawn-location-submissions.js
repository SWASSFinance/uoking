const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function addSpawnLocationSubmissions() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Adding spawn location submissions table...');
    
    await client.query('BEGIN');
    
    // Create spawn location submissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS spawn_location_submissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        -- Submission details
        spawn_location VARCHAR(500) NOT NULL,
        description TEXT,
        coordinates VARCHAR(100), -- Optional: "123,456" format
        shard VARCHAR(50),
        
        -- Status and approval
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
        reviewed_at TIMESTAMP WITH TIME ZONE,
        review_notes TEXT,
        
        -- Points awarded
        points_awarded INTEGER DEFAULT 0,
        points_awarded_at TIMESTAMP WITH TIME ZONE,
        
        -- Metadata
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Ensure one submission per user per product
        UNIQUE(product_id, user_id)
      );
    `);
    
    // Add indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_spawn_submissions_product_id ON spawn_location_submissions(product_id);
      CREATE INDEX IF NOT EXISTS idx_spawn_submissions_user_id ON spawn_location_submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_spawn_submissions_status ON spawn_location_submissions(status);
      CREATE INDEX IF NOT EXISTS idx_spawn_submissions_created_at ON spawn_location_submissions(created_at DESC);
    `);
    
    await client.query('COMMIT');
    console.log('✅ Spawn location submissions table created successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating spawn location submissions table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
addSpawnLocationSubmissions()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
