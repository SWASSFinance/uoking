const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting category reviews migration fix...');
    
    // Drop existing tables if they exist
    await client.query('DROP TABLE IF EXISTS category_reviews CASCADE');
    await client.query('DROP TABLE IF EXISTS product_image_submissions CASCADE');
    console.log('✓ Dropped existing tables');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'migrations', 'add_category_reviews_table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await client.query(sqlContent);
    
    console.log('✓ Created category_reviews table with UUID data types');
    console.log('✓ Created product_image_submissions table with UUID data types');
    console.log('✓ Created all indexes');
    console.log('✓ Created triggers for updated_at');
    
    console.log('Migration fix completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
