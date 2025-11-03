#!/usr/bin/env node

/**
 * Script to check database performance metrics
 * Run with: node scripts/check-db-performance.js
 */

const { Pool } = require('pg');

async function checkPerformance() {
  console.log('🔍 Checking database performance metrics...\n');

  const connectionString = process.env.POSTGRES_URL;
  
  if (!connectionString) {
    console.error('❌ Error: POSTGRES_URL environment variable not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Check active connections
    console.log('📊 Active Connections:');
    const connResult = await pool.query(`
      SELECT 
        count(*) as total,
        count(*) FILTER (WHERE state = 'active') as active,
        count(*) FILTER (WHERE state = 'idle') as idle
      FROM pg_stat_activity
      WHERE datname = current_database()
    `);
    console.log('  Total:', connResult.rows[0].total);
    console.log('  Active:', connResult.rows[0].active);
    console.log('  Idle:', connResult.rows[0].idle);
    console.log('');

    // Check table sizes
    console.log('💾 Table Sizes:');
    const sizeResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
        pg_total_relation_size(schemaname||'.'||tablename) as bytes
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      LIMIT 10
    `);
    sizeResult.rows.forEach(row => {
      console.log(`  ${row.tablename}: ${row.size}`);
    });
    console.log('');

    // Check missing indexes on foreign keys
    console.log('⚠️  Missing Indexes on Foreign Keys:');
    const missingIndexResult = await pool.query(`
      SELECT 
        c.conrelid::regclass AS table_name,
        string_agg(a.attname, ', ') AS columns,
        'Missing index on FK' as issue
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
      WHERE c.contype = 'f'
        AND NOT EXISTS (
          SELECT 1 FROM pg_index i
          WHERE i.indrelid = c.conrelid
            AND c.conkey[1] = ANY(i.indkey)
        )
      GROUP BY c.conrelid
      ORDER BY c.conrelid::regclass::text
    `);
    
    if (missingIndexResult.rows.length > 0) {
      missingIndexResult.rows.forEach(row => {
        console.log(`  ⚠️  ${row.table_name} (${row.columns})`);
      });
    } else {
      console.log('  ✅ No missing indexes on foreign keys!');
    }
    console.log('');

    // Check slow queries (if pg_stat_statements is enabled)
    console.log('🐌 Checking for slow query tracking...');
    try {
      const slowQueryCheck = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
        ) as enabled
      `);
      
      if (slowQueryCheck.rows[0].enabled) {
        const slowQueries = await pool.query(`
          SELECT 
            substring(query, 1, 60) as query_start,
            calls,
            round(mean_exec_time::numeric, 2) as avg_time_ms,
            round(total_exec_time::numeric, 2) as total_time_ms
          FROM pg_stat_statements
          WHERE mean_exec_time > 100
          ORDER BY mean_exec_time DESC
          LIMIT 5
        `);
        
        if (slowQueries.rows.length > 0) {
          console.log('  ⚠️  Queries with avg execution time > 100ms:');
          slowQueries.rows.forEach(row => {
            console.log(`    ${row.query_start}...`);
            console.log(`      Calls: ${row.calls}, Avg: ${row.avg_time_ms}ms, Total: ${row.total_time_ms}ms`);
          });
        } else {
          console.log('  ✅ No slow queries detected!');
        }
      } else {
        console.log('  ℹ️  pg_stat_statements extension not enabled');
      }
    } catch (e) {
      console.log('  ℹ️  Could not check slow queries (extension may not be available)');
    }
    console.log('');

    // Check table bloat
    console.log('🔧 Table Statistics (last analyzed):');
    const statsResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        last_analyze,
        last_autoanalyze
      FROM pg_stat_user_tables
      WHERE schemaname = 'public'
      ORDER BY 
        GREATEST(last_analyze, last_autoanalyze) DESC NULLS LAST
      LIMIT 10
    `);
    statsResult.rows.forEach(row => {
      const lastAnalyzed = row.last_analyze || row.last_autoanalyze || 'Never';
      console.log(`  ${row.tablename}: ${lastAnalyzed}`);
    });
    console.log('');

    console.log('✨ Performance check complete!\n');
    console.log('📝 Recommendations:');
    console.log('  - Keep active connections under 10 for Neon');
    console.log('  - Ensure all foreign keys have indexes');
    console.log('  - Run ANALYZE periodically on large tables');
    console.log('  - Monitor for queries > 100ms average execution time\n');

  } catch (error) {
    console.error('❌ Error checking performance:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
checkPerformance().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

