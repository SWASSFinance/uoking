const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

async function addDiscordIdField() {
  const client = await pool.connect();
  
  try {
    console.log('Adding Discord ID field to users table...');
    
    // Check if column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'discord_id'
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('Discord ID field already exists');
      return;
    }
    
    // Add the column
    await client.query(`
      ALTER TABLE users ADD COLUMN discord_id VARCHAR(50)
    `);
    
    // Add index
    await client.query(`
      CREATE INDEX idx_users_discord_id ON users(discord_id) WHERE discord_id IS NOT NULL
    `);
    
    console.log('✅ Discord ID field added successfully');
    
  } catch (error) {
    console.error('❌ Error adding Discord ID field:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addDiscordIdField(); 