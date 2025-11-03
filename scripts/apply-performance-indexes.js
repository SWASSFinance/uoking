#!/usr/bin/env node

/**
 * Script to apply critical performance indexes to Neon DB
 * Run with: node scripts/apply-performance-indexes.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyIndexes() {
  console.log('🔧 Applying critical performance indexes to Neon DB...\n');

  const connectionString = process.env.POSTGRES_URL;
  
  if (!connectionString) {
    console.error('❌ Error: POSTGRES_URL environment variable not set');
    console.error('Please set it in your .env.local file or export it:\n');
    console.error('export POSTGRES_URL="postgres://..."');
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

    // Read the migration file
    const sqlFile = path.join(__dirname, '..', 'migrations', 'CRITICAL_apply_performance_indexes.sql');
    console.log('📖 Reading migration file...');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the migration
    console.log('🚀 Applying indexes... This may take a few minutes.\n');
    console.log('Note: Using CREATE INDEX CONCURRENTLY to avoid table locks.\n');

    await pool.query(sql);

    console.log('✅ All indexes applied successfully!\n');

    // Verify indexes
    console.log('🔍 Verifying indexes...');
    const indexResult = await pool.query(`
      SELECT 
        tablename,
        indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname
    `);

    console.log(`\n✅ Found ${indexResult.rows.length} indexes:`);
    
    const indexesByTable = {};
    indexResult.rows.forEach(row => {
      if (!indexesByTable[row.tablename]) {
        indexesByTable[row.tablename] = [];
      }
      indexesByTable[row.tablename].push(row.indexname);
    });

    for (const [table, indexes] of Object.entries(indexesByTable)) {
      console.log(`\n  ${table}:`);
      indexes.forEach(idx => console.log(`    - ${idx}`));
    }

    console.log('\n✨ Performance optimization complete!');
    console.log('\n📊 Next steps:');
    console.log('  1. Monitor your Neon dashboard for CPU usage reduction');
    console.log('  2. Check query performance in your application');
    console.log('  3. Review DATABASE_PERFORMANCE_AUDIT.md for additional optimizations\n');

  } catch (error) {
    console.error('❌ Error applying indexes:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('\n⚠️  Some indexes already exist - this is normal!');
      console.log('The migration uses IF NOT EXISTS to safely skip existing indexes.\n');
    } else {
      console.error('\nFull error:', error);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

// Run the script
applyIndexes().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

