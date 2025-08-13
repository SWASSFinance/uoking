// API route to test database connection
import { NextResponse } from 'next/server';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 5,
  connectionTimeoutMillis: 5000,
});

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    const client = await pool.connect();
    
    // Test basic connection
    const timeResult = await client.query('SELECT NOW() as current_time');
    
    // Check our tables
    const tablesResult = await client.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'transactions', 'transaction_categories')
      ORDER BY table_name
    `);
    
    // Count existing data
    const userCountResult = await client.query('SELECT COUNT(*) as count FROM users');
    const transactionCountResult = await client.query('SELECT COUNT(*) as count FROM transactions');
    
    client.release();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      timestamp: timeResult.rows[0].current_time,
      tables: tablesResult.rows,
      data: {
        users: parseInt(userCountResult.rows[0].count),
        transactions: parseInt(transactionCountResult.rows[0].count)
      }
    });
    
  } catch (error: any) {
    console.error('❌ Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Database connection failed',
      error: error.code || 'UNKNOWN_ERROR'
    }, { status: 500 });
  }
} 