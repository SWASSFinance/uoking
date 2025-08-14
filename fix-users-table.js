// Fix Users Table Script
// Run this to add missing columns to the users table

const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function fixUsersTable() {
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    console.log('🔧 Fixing users table...');
    
    // Read and execute the SQL
    const sql = fs.readFileSync('./fix-users-table.sql', 'utf8');
    await pool.query(sql);
    
    console.log('✅ Users table fixed successfully!');
    
    // Verify the columns exist
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Current users table columns:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.column_name} (${row.data_type})`);
    });
    
    // Check specifically for discord_username
    const discordCheck = result.rows.find(row => row.column_name === 'discord_username');
    if (discordCheck) {
      console.log('\n✅ discord_username column is now available!');
    } else {
      console.log('\n❌ discord_username column still missing');
    }
    
  } catch (error) {
    console.error('❌ Error fixing users table:', error);
  } finally {
    await pool.end();
  }
}

fixUsersTable(); 