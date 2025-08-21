const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function addEventItemsTable() {
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    console.log('🚀 Adding event_items table...');
    
    // Read and execute the SQL migration
    const sql = fs.readFileSync('./add-event-items-table.sql', 'utf8');
    await pool.query(sql);
    
    console.log('✅ Event items table created successfully!');
    
    // Verify table was created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'event_items';
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ event_items table verified in database');
    } else {
      console.log('❌ event_items table not found');
    }
    
  } catch (error) {
    console.error('❌ Error creating event_items table:', error);
  } finally {
    await pool.end();
  }
}

addEventItemsTable();
