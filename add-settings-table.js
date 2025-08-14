// Add Settings Table Script
// Run this to add the settings table to your database

const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function addSettingsTable() {
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    console.log('🚀 Adding settings table to database...');
    
    // Read and execute the settings table SQL
    const settingsSQL = fs.readFileSync('./add-settings-table.sql', 'utf8');
    await pool.query(settingsSQL);
    
    console.log('✅ Settings table created successfully!');
    
    // Verify the table was created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'site_settings';
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ site_settings table verified!');
      
      // Check if default settings were inserted
      const settingsCount = await pool.query(`
        SELECT COUNT(*) as count FROM site_settings;
      `);
      
      console.log(`📋 ${settingsCount.rows[0].count} default settings inserted`);
    } else {
      console.log('❌ site_settings table not found');
    }
    
  } catch (error) {
    console.error('❌ Error adding settings table:', error);
  } finally {
    await pool.end();
  }
}

addSettingsTable(); 