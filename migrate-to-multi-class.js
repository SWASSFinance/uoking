const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrateToMultiClass() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration to support multiple classes per product...');
    
    // Check if product_classes table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_classes'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('product_classes table already exists. Skipping creation.');
    } else {
      console.log('Creating product_classes table...');
      
      await client.query(`
        CREATE TABLE product_classes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
          sort_order INTEGER DEFAULT 0,
          is_primary BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(product_id, class_id)
        );
      `);
      
      // Create indexes
      await client.query(`
        CREATE INDEX idx_product_classes_product_id ON product_classes(product_id);
        CREATE INDEX idx_product_classes_class_id ON product_classes(class_id);
        CREATE INDEX idx_product_classes_sort_order ON product_classes(sort_order);
        CREATE INDEX idx_product_classes_primary ON product_classes(product_id, is_primary) WHERE is_primary = true;
      `);
      
      console.log('✅ product_classes table created with indexes');
    }
    
    // Migrate existing class_id data to product_classes table
    console.log('\nMigrating existing class_id data...');
    
    const productsWithClass = await client.query(`
      SELECT id, class_id FROM products 
      WHERE class_id IS NOT NULL AND class_id != ''
    `);
    
    console.log(`Found ${productsWithClass.rows.length} products with class_id to migrate`);
    
    for (const product of productsWithClass.rows) {
      try {
        await client.query(`
          INSERT INTO product_classes (product_id, class_id, sort_order, is_primary)
          VALUES ($1, $2, 0, true)
          ON CONFLICT (product_id, class_id) DO NOTHING
        `, [product.id, product.class_id]);
      } catch (error) {
        console.error(`Error migrating product ${product.id}:`, error.message);
      }
    }
    
    console.log('✅ Migration completed successfully');
    
    // Verify migration
    const verification = await client.query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN class_id IS NOT NULL THEN 1 END) as products_with_class_id,
        (SELECT COUNT(*) FROM product_classes) as product_classes_entries
      FROM products
    `);
    
    console.log('\nMigration verification:');
    console.log(`- Total products: ${verification.rows[0].total_products}`);
    console.log(`- Products with class_id: ${verification.rows[0].products_with_class_id}`);
    console.log(`- Product_classes entries: ${verification.rows[0].product_classes_entries}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateToMultiClass().catch(console.error);
