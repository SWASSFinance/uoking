const { query, uploadMap } = require('./lib/db.ts');

async function testMapUpload() {
  try {
    console.log('🧪 Testing map upload to database...');
    
    // Test data
    const testData = {
      name: 'Test Map',
      description: 'Test map description',
      mapFileUrl: 'https://res.cloudinary.com/dngclyzkj/image/upload/v1234567890/test-map.jpg',
      mapFileSize: 1024000, // 1MB
      userId: 'test-user-id'
    };
    
    console.log('Test data:', testData);
    
    // First, let's check if the maps table has the correct structure
    console.log('\n📋 Checking maps table structure...');
    const tableInfo = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'maps' 
      ORDER BY ordinal_position
    `);
    
    console.log('Maps table columns:');
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });
    
    // Check if we have any users in the database
    console.log('\n👥 Checking for users...');
    const users = await query('SELECT id, email, username FROM users LIMIT 5');
    console.log('Available users:', users.rows);
    
    if (users.rows.length === 0) {
      console.log('❌ No users found in database. Cannot test with valid user ID.');
      return;
    }
    
    // Use the first user as test user
    const testUserId = users.rows[0].id;
    console.log(`Using test user ID: ${testUserId}`);
    
    // Try to upload a test map
    console.log('\n📤 Attempting to upload test map...');
    const result = await uploadMap(
      testData.name,
      testData.description,
      testData.mapFileUrl,
      testData.mapFileSize,
      testUserId
    );
    
    console.log('✅ Map uploaded successfully!');
    console.log('Result:', result);
    
    // Verify the map was saved
    console.log('\n🔍 Verifying saved map...');
    const savedMap = await query('SELECT * FROM maps WHERE id = $1', [result.id]);
    console.log('Saved map:', savedMap.rows[0]);
    
  } catch (error) {
    console.error('❌ Error testing map upload:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
  }
}

testMapUpload();
