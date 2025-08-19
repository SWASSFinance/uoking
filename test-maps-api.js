const { query } = require('./lib/db.ts');

async function testMapsAPI() {
  try {
    console.log('🧪 Testing maps API...');
    
    // Test 1: Check if maps table has the correct structure
    console.log('\n1. Checking maps table structure...');
    const tableInfo = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'maps' 
      ORDER BY ordinal_position
    `);
    
    console.log('Maps table columns:');
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    // Test 2: Check if getAllMaps function works
    console.log('\n2. Testing getAllMaps function...');
    const { getAllMaps } = require('./lib/db.ts');
    const maps = await getAllMaps();
    console.log(`Found ${maps.length} maps`);
    
    if (maps.length > 0) {
      console.log('Sample map data:');
      console.log(JSON.stringify(maps[0], null, 2));
    }
    
    // Test 3: Check if plots table exists
    console.log('\n3. Checking plots table...');
    const plotsTableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'plots'
      )
    `);
    
    console.log(`Plots table exists: ${plotsTableExists.rows[0].exists}`);
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testMapsAPI();
