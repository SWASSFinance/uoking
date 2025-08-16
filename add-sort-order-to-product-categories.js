const { query } = require('./lib/db.ts');

async function addSortOrderColumn() {
  try {
    console.log('Adding sort_order column to product_categories table...');
    
    // Add sort_order column if it doesn't exist
    await query(`
      ALTER TABLE product_categories 
      ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0
    `);
    
    console.log('sort_order column added successfully!');
    
    // Update existing records to have sort_order = 0
    await query(`
      UPDATE product_categories 
      SET sort_order = 0 
      WHERE sort_order IS NULL
    `);
    
    console.log('Updated existing records with sort_order = 0');
    
    // Verify the column was added
    const columnsResult = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'product_categories' AND column_name = 'sort_order'
    `);
    
    if (columnsResult.rows.length > 0) {
      console.log('sort_order column verified successfully');
    } else {
      console.log('ERROR: sort_order column was not added');
    }
    
  } catch (error) {
    console.error('Error adding sort_order column:', error);
    throw error;
  }
}

addSortOrderColumn().then(() => {
  console.log('Script completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
}); 