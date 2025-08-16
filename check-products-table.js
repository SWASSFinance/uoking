const { query } = require('./lib/db.ts');

async function checkProductsTable() {
  try {
    console.log('Checking products table structure...');
    
    // Check table columns
    const columnsResult = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nProducts table columns:');
    columnsResult.rows.forEach(row => {
      console.log(`${row.column_name} - ${row.data_type}`);
    });
    
    // Check if product_categories table exists
    const junctionResult = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_categories'
      ) as exists
    `);
    
    console.log(`\nproduct_categories table exists: ${junctionResult.rows[0].exists}`);
    
    // Check sample products
    const productsResult = await query(`
      SELECT id, name, category_id, status 
      FROM products 
      LIMIT 5
    `);
    
    console.log('\nSample products:');
    productsResult.rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Category ID: ${row.category_id}, Status: ${row.status}`);
    });
    
    // Check categories
    const categoriesResult = await query(`
      SELECT id, name, slug 
      FROM categories 
      LIMIT 5
    `);
    
    console.log('\nSample categories:');
    categoriesResult.rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Slug: ${row.slug}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkProductsTable(); 