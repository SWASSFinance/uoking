const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration...');
    
    // Create the spawn_location_submissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS spawn_location_submissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        spawn_location VARCHAR(500) NOT NULL,
        description TEXT,
        coordinates VARCHAR(100),
        shard VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        review_notes TEXT,
        points_awarded INTEGER DEFAULT 0,
        reviewed_by UUID REFERENCES users(id),
        reviewed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(product_id, user_id)
      )
    `);
    
    console.log('✓ Created spawn_location_submissions table');
    
    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_spawn_location_submissions_product_id ON spawn_location_submissions(product_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_spawn_location_submissions_user_id ON spawn_location_submissions(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_spawn_location_submissions_status ON spawn_location_submissions(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_spawn_location_submissions_created_at ON spawn_location_submissions(created_at)`);
    
    console.log('✓ Created indexes');
    
    // Create trigger for updated_at
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_spawn_location_submissions_updated_at ON spawn_location_submissions
    `);
    
    await client.query(`
      CREATE TRIGGER update_spawn_location_submissions_updated_at 
      BEFORE UPDATE ON spawn_location_submissions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    console.log('✓ Created trigger for updated_at');
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
