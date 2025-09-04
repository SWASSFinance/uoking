const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('Running skills table migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_skills_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await pool.query(statement);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Test the tables were created
    const skillsCheck = await pool.query('SELECT COUNT(*) FROM skills');
    const rangesCheck = await pool.query('SELECT COUNT(*) FROM skill_training_ranges');
    
    console.log(`📊 Skills table: ${skillsCheck.rows[0].count} records`);
    console.log(`📊 Training ranges table: ${rangesCheck.rows[0].count} records`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
runMigration();