#!/usr/bin/env node

/**
 * Script to apply military status fields migration to Neon DB
 * Adds is_veteran and is_serving fields to users table for military cashback program
 * Run with: node scripts/apply-military-status-migration.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  console.log('🔧 Applying military status fields migration to Neon DB...\n');

  // Get connection string from environment variable or command line argument
  let connectionString = process.env.POSTGRES_URL;
  
  // If not in env, check command line args
  if (!connectionString) {
    const args = process.argv.slice(2);
    if (args.length > 0) {
      connectionString = args[0];
    }
  }
  
  if (!connectionString) {
    console.error('❌ Error: POSTGRES_URL not provided');
    console.error('\nUsage:');
    console.error('  node scripts/apply-military-status-migration.js');
    console.error('  (with POSTGRES_URL in environment)');
    console.error('\nOR:');
    console.error('  node scripts/apply-military-status-migration.js "postgres://..."');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    const testResult = await pool.query('SELECT NOW() as time, current_database() as db');
    console.log(`✅ Connected to: ${testResult.rows[0].db}`);
    console.log(`⏰ Server time: ${testResult.rows[0].time}\n`);

    // Check if columns already exist
    console.log('🔍 Checking if migration already applied...');
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
        AND column_name IN ('is_veteran', 'is_serving')
    `);

    if (checkResult.rows.length === 2) {
      console.log('⚠️  Migration already applied! Columns is_veteran and is_serving already exist.');
      console.log('   Skipping migration. If you want to re-run, drop the columns first.\n');
      
      // Show current state
      const statsResult = await pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE is_veteran = true) as veteran_count,
          COUNT(*) FILTER (WHERE is_serving = true) as serving_count,
          COUNT(*) as total_users
        FROM users
      `);
      
      const stats = statsResult.rows[0];
      console.log('📊 Current statistics:');
      console.log(`   Total users: ${stats.total_users}`);
      console.log(`   Veterans: ${stats.veteran_count}`);
      console.log(`   Currently serving: ${stats.serving_count}\n`);
      
      await pool.end();
      return;
    }

    // Read the migration file
    const sqlFile = path.join(__dirname, '..', 'migrations', 'add_military_status_fields.sql');
    console.log('📖 Reading migration file...');
    
    if (!fs.existsSync(sqlFile)) {
      console.error(`❌ Migration file not found: ${sqlFile}`);
      process.exit(1);
    }
    
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the migration
    console.log('🚀 Applying migration...\n');
    console.log('This will:');
    console.log('  - Add is_veteran column (boolean, default false)');
    console.log('  - Add is_serving column (boolean, default false)');
    console.log('  - Create index for efficient veteran queries');
    console.log('  - Add column comments\n');

    // Execute ALTER TABLE statements first (these can be in transaction)
    console.log('📝 Adding columns...');
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_veteran BOOLEAN DEFAULT false NOT NULL;
    `);
    console.log('✅ Added is_veteran column');

    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_serving BOOLEAN DEFAULT false NOT NULL;
    `);
    console.log('✅ Added is_serving column');

    // Add comments
    console.log('\n📝 Adding column comments...');
    await pool.query(`
      COMMENT ON COLUMN users.is_veteran IS 'Indicates if user is a military veteran - eligible for military cashback program';
    `);
    await pool.query(`
      COMMENT ON COLUMN users.is_serving IS 'Indicates if user is currently serving in the military - eligible for military cashback program';
    `);
    console.log('✅ Added column comments');

    // Create index CONCURRENTLY (must be outside transaction)
    console.log('\n📝 Creating index (this may take a moment)...');
    const indexExists = await pool.query(`
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'idx_users_military_status'
    `);

    if (indexExists.rows.length === 0) {
      await pool.query(`
        CREATE INDEX CONCURRENTLY idx_users_military_status 
        ON users(id) 
        WHERE is_veteran = true OR is_serving = true;
      `);
      console.log('✅ Created index idx_users_military_status');
    } else {
      console.log('⚠️  Index idx_users_military_status already exists, skipping');
    }

    console.log('\n✅ Migration applied successfully!\n');

    // Verify the migration
    console.log('🔍 Verifying migration...');
    const verifyResult = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
        AND column_name IN ('is_veteran', 'is_serving')
      ORDER BY column_name
    `);

    if (verifyResult.rows.length === 2) {
      console.log('✅ Both columns created successfully:');
      verifyResult.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type} (default: ${row.column_default || 'none'})`);
      });
    } else {
      console.log('⚠️  Warning: Expected 2 columns but found:', verifyResult.rows.length);
    }

    // Check index
    const indexResult = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname = 'idx_users_military_status'
    `);

    if (indexResult.rows.length > 0) {
      console.log('\n✅ Index created successfully:');
      console.log(`   - ${indexResult.rows[0].indexname}`);
    } else {
      console.log('\n⚠️  Warning: Index idx_users_military_status not found');
    }

    // Show statistics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE is_veteran = true) as veteran_count,
        COUNT(*) FILTER (WHERE is_serving = true) as serving_count,
        COUNT(*) as total_users
      FROM users
    `);
    
    const stats = statsResult.rows[0];
    console.log('\n📊 Current statistics:');
    console.log(`   Total users: ${stats.total_users}`);
    console.log(`   Veterans: ${stats.veteran_count}`);
    console.log(`   Currently serving: ${stats.serving_count}\n`);

    console.log('✨ Migration complete!');
    console.log('\n📋 Next steps:');
    console.log('  1. Users can now check their veteran/serving status in their profile');
    console.log('  2. Military cashback will be distributed when orders complete');
    console.log('  3. 2% of each order total will be divided among all veteran users\n');

  } catch (error) {
    console.error('❌ Error applying migration:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
applyMigration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
