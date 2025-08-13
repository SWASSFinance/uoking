// Simple database connection test
const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL,
    connectionTimeoutMillis: 5000, // 5 second timeout
    idleTimeoutMillis: 5000
  });
  
  try {
    console.log('📞 Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    console.log('🧪 Testing simple query...');
    const result = await client.query('SELECT NOW() as current_time');
    console.log('⏰ Current time:', result.rows[0].current_time);
    
    console.log('📋 Checking existing tables...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📊 Tables found:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    client.release();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await pool.end();
    console.log('🔚 Connection pool closed');
  }
}

testConnection().catch(console.error); 