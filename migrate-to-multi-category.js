const { query } = require('./lib/db.ts');

async function migrateToMultiCategory() {
  try {
    console.log('Starting multi-category migration...');
    
    // Check if product_categories table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_categories'
      ) as exists
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('Creating product_categories table...');
      await query(`
        CREATE TABLE product_categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
          sort_order INTEGER DEFAULT 0,
          is_primary BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(product_id, category_id)
        )
      `);
      
      // Create indexes for performance
      await query(`
        CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
        CREATE INDEX idx_product_categories_category_id ON product_categories(category_id);
        CREATE INDEX idx_product_categories_sort_order ON product_categories(sort_order);
      `);
    }
    
    // Get all products with their current category_id
    const products = await query(`
      SELECT id, name, category_id 
      FROM products 
      WHERE category_id IS NOT NULL
    `);
    
    console.log(`Found ${products.rows.length} products with categories to migrate`);
    
    // Migrate each product's category to the junction table
    for (const product of products.rows) {
      console.log(`Migrating product: ${product.name} (ID: ${product.id})`);
      
      // Insert into product_categories as primary category
      await query(`
        INSERT INTO product_categories (product_id, category_id, sort_order, is_primary)
        VALUES ($1, $2, 0, true)
        ON CONFLICT (product_id, category_id) DO NOTHING
      `, [product.id, product.category_id]);
    }
    
    console.log('Migration completed successfully!');
    
    // Verify migration
    const verification = await query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(pc.product_id) as products_with_categories
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
    `);
    
    console.log('Verification results:', verification.rows[0]);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

migrateToMultiCategory().then(() => {
  console.log('Migration script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
}); 