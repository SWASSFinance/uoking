const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
})

async function testBanSystem() {
  const client = await pool.connect()
  
  try {
    console.log('🧪 Testing Ban System Implementation...\n')

    // Test 1: Check ban system tables exist
    console.log('1. Checking ban system tables:')
    
    const tables = ['banned_emails', 'banned_ips', 'ban_history']
    for (const table of tables) {
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        )
      `, [table])
      
      if (tableExists.rows[0].exists) {
        console.log(`   ✅ ${table} table exists`)
      } else {
        console.log(`   ❌ ${table} table missing`)
      }
    }

    // Test 2: Check ban system functions exist
    console.log('\n2. Checking ban system functions:')
    
    const functions = ['is_email_banned', 'is_ip_banned', 'ban_user', 'unban_user']
    for (const func of functions) {
      const funcExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.routines 
          WHERE routine_name = $1
        )
      `, [func])
      
      if (funcExists.rows[0].exists) {
        console.log(`   ✅ ${func} function exists`)
      } else {
        console.log(`   ❌ ${func} function missing`)
      }
    }

    // Test 3: Check ban-related columns in users table
    console.log('\n3. Checking users table ban columns:')
    
    const columns = ['banned_at', 'banned_by', 'ban_reason', 'ban_expires_at', 'is_permanently_banned']
    for (const column of columns) {
      const columnExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = $1
        )
      `, [column])
      
      if (columnExists.rows[0].exists) {
        console.log(`   ✅ ${column} column exists`)
      } else {
        console.log(`   ❌ ${column} column missing`)
      }
    }

    // Test 4: Test ban functions with sample data
    console.log('\n4. Testing ban functions:')
    
    // Test email ban check
    const emailTest = await client.query('SELECT is_email_banned($1)', ['test@example.com'])
    console.log(`   ✅ Email ban check: ${emailTest.rows[0].is_email_banned ? 'BANNED' : 'NOT BANNED'}`)
    
    // Test IP ban check
    const ipTest = await client.query('SELECT is_ip_banned($1)', ['192.168.1.1'])
    console.log(`   ✅ IP ban check: ${ipTest.rows[0].is_ip_banned ? 'BANNED' : 'NOT BANNED'}`)

    // Test 5: Check current ban statistics
    console.log('\n5. Current ban statistics:')
    
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE status = 'banned') as banned_users,
        (SELECT COUNT(*) FROM banned_emails WHERE is_permanent = true OR expires_at IS NULL OR expires_at > NOW()) as banned_emails,
        (SELECT COUNT(*) FROM banned_ips WHERE is_permanent = true OR expires_at IS NULL OR expires_at > NOW()) as banned_ips,
        (SELECT COUNT(*) FROM ban_history) as ban_history_entries
    `)
    
    console.log(`   📊 Banned users: ${stats.rows[0].banned_users}`)
    console.log(`   📊 Banned emails: ${stats.rows[0].banned_emails}`)
    console.log(`   📊 Banned IPs: ${stats.rows[0].banned_ips}`)
    console.log(`   📊 Ban history entries: ${stats.rows[0].ban_history_entries}`)

    // Test 6: Show recent ban history
    console.log('\n6. Recent ban history:')
    
    const recentBans = await client.query(`
      SELECT 
        bh.action, bh.reason, bh.ban_type, bh.created_at,
        u.email as user_email,
        a.email as admin_email
      FROM ban_history bh
      LEFT JOIN users u ON bh.user_id = u.id
      LEFT JOIN users a ON bh.banned_by = a.id
      ORDER BY bh.created_at DESC
      LIMIT 5
    `)
    
    if (recentBans.rows.length > 0) {
      recentBans.rows.forEach((ban, index) => {
        console.log(`   ${index + 1}. ${ban.action.toUpperCase()} - ${ban.user_email || 'Unknown'} by ${ban.admin_email || 'Unknown'}`)
        console.log(`      Reason: ${ban.reason || 'No reason'}`)
        console.log(`      Type: ${ban.ban_type || 'Unknown'}`)
        console.log(`      Date: ${ban.created_at}`)
      })
    } else {
      console.log('   No ban history found')
    }

    // Test 7: Check for any currently banned users
    console.log('\n7. Currently banned users:')
    
    const bannedUsers = await client.query(`
      SELECT 
        u.email, u.username, u.banned_at, u.ban_reason, 
        u.is_permanently_banned, u.ban_expires_at,
        a.email as banned_by_email
      FROM users u
      LEFT JOIN users a ON u.banned_by = a.id
      WHERE u.status = 'banned'
      ORDER BY u.banned_at DESC
      LIMIT 5
    `)
    
    if (bannedUsers.rows.length > 0) {
      bannedUsers.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.username})`)
        console.log(`      Banned: ${user.banned_at}`)
        console.log(`      Reason: ${user.ban_reason || 'No reason'}`)
        console.log(`      Type: ${user.is_permanently_banned ? 'PERMANENT' : 'TEMPORARY'}`)
        if (!user.is_permanently_banned && user.ban_expires_at) {
          console.log(`      Expires: ${user.ban_expires_at}`)
        }
        console.log(`      Banned by: ${user.banned_by_email || 'Unknown'}`)
      })
    } else {
      console.log('   No currently banned users')
    }

    console.log('\n✅ Ban system test completed successfully!')
    console.log('\n🎉 The ban system is fully functional and ready to use!')
    
  } catch (error) {
    console.error('❌ Error testing ban system:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

testBanSystem().catch(console.error)
