const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrateNewsTable() {
  try {
    console.log('Starting news table migration...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'add-news-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the migration
    await pool.query(sql);
    
    console.log('✅ News table migration completed successfully!');
    
    // Verify the table was created
    const result = await pool.query(`
      SELECT COUNT(*) as count FROM news;
    `);
    
    console.log(`📊 News table contains ${result.rows[0].count} records`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  migrateNewsTable()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateNewsTable };
