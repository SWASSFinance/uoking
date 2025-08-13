// Database Setup Script
// Run this first to create your new schema on Neon

const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    console.log('🚀 Setting up new database schema...');
    
    // Read and execute the schema SQL
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully!');
    console.log('\nYour new tables:');
    console.log('- users (with proper authentication)');
    console.log('- transactions (normalized with categories)');
    console.log('- transaction_categories (gold, items, services, refunds)');
    console.log('- user_sessions (for login tracking)');
    console.log('- password_reset_tokens (for password resets)');
    console.log('- audit_logs (for change tracking)');
    
    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables created:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 