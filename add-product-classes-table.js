const { query } = require('./lib/db.ts');

async function addProductClassesTable() {
  try {
    console.log('Starting product classes table migration...');
    
    // Check if product_classes table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_classes'
      ) as exists
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('Creating product_classes table...');
      await query(`
        CREATE TABLE product_classes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
          sort_order INTEGER DEFAULT 0,
          is_primary BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(product_id, class_id)
        )
      `);
      
      // Create indexes for performance
      await query(`
        CREATE INDEX idx_product_classes_product_id ON product_classes(product_id);
        CREATE INDEX idx_product_classes_class_id ON product_classes(class_id);
        CREATE INDEX idx_product_classes_sort_order ON product_classes(sort_order);
      `);
    }
    
    // Get all products with their current class_id
    const products = await query(`
      SELECT id, name, class_id 
      FROM products 
      WHERE class_id IS NOT NULL
    `);
    
    console.log(`Found ${products.rows.length} products with classes to migrate`);
    
    // Migrate each product's class to the junction table
    for (const product of products.rows) {
      console.log(`Migrating product: ${product.name} (ID: ${product.id})`);
      
      // Insert into product_classes as primary class
      await query(`
        INSERT INTO product_classes (product_id, class_id, sort_order, is_primary)
        VALUES ($1, $2, 0, true)
        ON CONFLICT (product_id, class_id) DO NOTHING
      `, [product.id, product.class_id]);
    }
    
    console.log('Migration completed successfully!');
    
    // Verify migration
    const verification = await query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(pc.product_id) as products_with_classes
      FROM products p
      LEFT JOIN product_classes pc ON p.id = pc.product_id
    `);
    
    console.log('Verification results:', verification.rows[0]);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

addProductClassesTable().then(() => {
  console.log('Migration script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
