#!/usr/bin/env node

/**
 * Check recent orders in the database
 * Bypasses all caching to show raw database data
 */

const { Pool } = require('pg');

async function checkRecentOrders() {
  console.log('🔍 Checking recent orders directly from database...\n');

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
    console.error('  node scripts/check-recent-orders.js');
    console.error('  (with POSTGRES_URL in environment)');
    console.error('\nOR:');
    console.error('  node scripts/check-recent-orders.js "postgres://..."');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Get last 10 orders
    console.log('📦 Last 10 Orders:');
    const ordersResult = await pool.query(`
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.payment_status,
        o.total_amount,
        o.created_at,
        u.email as user_email,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.order_number, o.status, o.payment_status, o.total_amount, o.created_at, u.email
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    if (ordersResult.rows.length === 0) {
      console.log('  ⚠️  No orders found in database!');
    } else {
      ordersResult.rows.forEach((order, i) => {
        console.log(`\n  ${i + 1}. Order #${order.order_number || order.id.substring(0, 8)}`);
        console.log(`     ID: ${order.id}`);
        console.log(`     Status: ${order.status} / Payment: ${order.payment_status}`);
        console.log(`     Total: $${order.total_amount}`);
        console.log(`     Items: ${order.item_count}`);
        console.log(`     User: ${order.user_email}`);
        console.log(`     Created: ${order.created_at}`);
      });
    }

    // Check orders with no items (potential issue)
    console.log('\n\n⚠️  Orders with NO items:');
    const emptyOrdersResult = await pool.query(`
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.created_at
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.id IS NULL
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    if (emptyOrdersResult.rows.length === 0) {
      console.log('  ✅ All orders have items!');
    } else {
      emptyOrdersResult.rows.forEach((order, i) => {
        console.log(`  ${i + 1}. Order ${order.order_number} (${order.id.substring(0, 8)}) - Created: ${order.created_at}`);
      });
    }

    // Check total counts
    console.log('\n\n📊 Database Totals:');
    const totalsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM order_items) as total_items,
        (SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '1 hour') as orders_last_hour,
        (SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '24 hours') as orders_last_24h
    `);

    const totals = totalsResult.rows[0];
    console.log(`  Total Orders: ${totals.total_orders}`);
    console.log(`  Total Order Items: ${totals.total_items}`);
    console.log(`  Orders (last hour): ${totals.orders_last_hour}`);
    console.log(`  Orders (last 24h): ${totals.orders_last_24h}`);

    console.log('\n✨ Check complete!\n');

  } catch (error) {
    console.error('❌ Error checking orders:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
checkRecentOrders().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

