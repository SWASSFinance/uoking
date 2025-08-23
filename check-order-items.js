const { query } = require('./lib/db.ts');

async function checkOrderItems() {
  try {
    console.log('Checking order_items table structure...');
    
    const result = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'order_items' 
      ORDER BY column_name
    `);
    
    console.log('order_items columns:');
    console.table(result.rows);
    
    // Also check if there are any order_items records
    const countResult = await query('SELECT COUNT(*) as count FROM order_items');
    console.log(`\nTotal order_items records: ${countResult.rows[0].count}`);
    
    if (countResult.rows[0].count > 0) {
      // Show a sample record
      const sampleResult = await query('SELECT * FROM order_items LIMIT 1');
      console.log('\nSample order_items record:');
      console.table(sampleResult.rows);
    }
    
  } catch (error) {
    console.error('Error checking order_items:', error);
  } finally {
    process.exit();
  }
}

checkOrderItems();
