const { query } = require('./lib/db.ts');

async function checkProductCategoriesStructure() {
  try {
    console.log('Checking product_categories table structure...');
    
    // Check table columns
    const columnsResult = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'product_categories' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nproduct_categories table columns:');
    columnsResult.rows.forEach(row => {
      console.log(`${row.column_name} - ${row.data_type}`);
    });
    
    // Check sample data
    const sampleResult = await query(`
      SELECT * FROM product_categories LIMIT 3
    `);
    
    console.log('\nSample product_categories data:');
    sampleResult.rows.forEach(row => {
      console.log(row);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkProductCategoriesStructure(); 