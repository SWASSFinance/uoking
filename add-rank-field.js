const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

async function addRankField() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Adding rank field to products table...');
    
    // Add rank column
    await client.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS rank INTEGER DEFAULT 0;
    `);
    
    console.log('✅ Rank column added');
    
    // Create index for efficient sorting
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_rank ON products(rank ASC, name ASC) WHERE status = 'active';
    `);
    
    console.log('✅ Index created');
    
    // Update existing products to have default rank values
    await client.query(`
      UPDATE products SET rank = 0 WHERE rank IS NULL;
    `);
    
    console.log('✅ Existing products updated with default rank values');
    
    // Add comment
    await client.query(`
      COMMENT ON COLUMN products.rank IS 'Custom ordering rank for products. Lower numbers appear first. Falls back to alphabetical by name if ranks are equal.';
    `);
    
    console.log('✅ Comment added');
    
    console.log('\n🎉 Rank field migration completed successfully!');
    console.log('📋 Products will now be sorted by:');
    console.log('   1. Rank (ascending - lower numbers first)');
    console.log('   2. Name (alphabetical)');
    console.log('   3. Featured status');
    console.log('   4. Creation date');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addRankField().catch(console.error); 