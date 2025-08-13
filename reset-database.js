const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function resetDatabase() {
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    console.log('🔄 Resetting database...');
    
    // Drop all existing tables
    console.log('🗑️ Dropping all existing tables...');
    await pool.query(`
      DROP TABLE IF EXISTS 
        cart_items, order_items, orders, product_reviews, products, 
        news, maps, facets, classes, categories, user_referrals, 
        user_sessions, password_reset_tokens, users, 
        transactions, transaction_categories, audit_logs, coupons
      CASCADE;
    `);
    
    // Drop any functions that might exist
    await pool.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;');
    
    console.log('✅ All tables dropped');
    
    // Create new schema
    console.log('🚀 Creating new database schema...');
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    await pool.query(schema);
    console.log('✅ Database schema created successfully!');
    
    console.log('✅ Database reset completed! Now run: node seed-database.js');
    
    console.log('🎉 Database reset and seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await pool.end();
  }
}

resetDatabase().catch(console.error); 