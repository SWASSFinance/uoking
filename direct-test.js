// Direct database test with hardcoded connection string
const { Pool } = require('pg');

async function directTest() {
  console.log('🔍 Direct database connection test...');
  
  // Using your connection string directly
  const connectionString = 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';
  
  const pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 10000,
    max: 1,
    ssl: { rejectUnauthorized: false } // For Neon compatibility
  });
  
  try {
    console.log('📞 Connecting to Neon...');
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    console.log('✅ Database connection successful!');
    console.log('📊 Current time:', result.rows[0].current_time);
    console.log('🗄️  Database version:', result.rows[0].db_version.split(' ')[0]);
    
    // Check if our tables exist
    console.log('📋 Checking for migration tables...');
    const tables = await pool.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'transactions', 'transaction_categories')
      ORDER BY table_name
    `);
    
    if (tables.rows.length > 0) {
      console.log('📊 Migration tables found:');
      tables.rows.forEach(row => {
        console.log(`  ✅ ${row.table_name} (${row.column_count} columns)`);
      });
    } else {
      console.log('❌ No migration tables found - need to run setup-database.js first');
    }
    
  } catch (error) {
    console.log('❌ Database error:', error.message);
    if (error.code) {
      console.log('   Error code:', error.code);
    }
  }
  
  await pool.end();
  console.log('🔚 Test completed');
  
  // Force exit to prevent hanging
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

directTest().catch(err => {
  console.error('💥 Unexpected error:', err.message);
  process.exit(1);
}); 