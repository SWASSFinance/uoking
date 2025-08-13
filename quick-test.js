// Quick database test using existing environment variables
const { Pool } = require('pg');

async function quickTest() {
  console.log('🔍 Quick database connection test...');
  
  // Use the environment variable that's already set
  const connectionString = process.env.POSTGRES_URL;
  
  if (!connectionString) {
    console.log('❌ POSTGRES_URL not found in environment');
    return;
  }
  
  console.log('✅ Found POSTGRES_URL in environment');
  
  const pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 10000,
    max: 1 // Only use 1 connection
  });
  
  try {
    console.log('📞 Connecting...');
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('📊 Test result:', result.rows[0]);
    
    // Check if our tables exist
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('users', 'transactions')
    `);
    
    console.log('📋 Our tables:', tables.rows.map(r => r.table_name));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  await pool.end();
  console.log('🔚 Done');
  process.exit(0); // Force exit
}

quickTest(); 