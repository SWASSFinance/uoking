// Add Deal of the Day, Referral, and Cashback System
// Run this to add the new tables and settings

const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function addDealReferralSystem() {
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    console.log('🚀 Adding Deal of the Day, Referral, and Cashback System...');
    
    // Read and execute the SQL
    const sql = fs.readFileSync('./add-deal-referral-system.sql', 'utf8');
    await pool.query(sql);
    
    console.log('✅ Deal of the Day, Referral, and Cashback System created successfully!');
    
    // Verify the tables were created
    const tables = [
      'deal_of_the_day',
      'user_referral_codes', 
      'user_cashback_balances',
      'cashback_transactions',
      'user_referrals'
    ];
    
    for (const table of tables) {
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = $1;
      `, [table]);
      
      if (result.rows.length > 0) {
        console.log(`✅ ${table} table verified!`);
      } else {
        console.log(`❌ ${table} table not found`);
      }
    }
    
    // Check if new settings were added
    const settingsCount = await pool.query(`
      SELECT COUNT(*) as count FROM site_settings 
      WHERE setting_key IN ('enable_deal_of_the_day', 'enable_referral_system', 'customer_cashback_percentage');
    `);
    
    console.log(`📋 ${settingsCount.rows[0].count} new settings added`);
    
  } catch (error) {
    console.error('❌ Error adding system:', error);
  } finally {
    await pool.end();
  }
}

addDealReferralSystem(); 