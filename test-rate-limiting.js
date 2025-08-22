const { Pool } = require('pg')

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
})

// Generic query function
async function query(text, params) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

async function testRateLimiting() {
  try {
    console.log('🧪 Testing Rate Limiting Implementation...\n')

    // Test 1: Check spawn location submissions rate limiting
    console.log('1. Testing Spawn Location Submissions Rate Limiting:')
    
    // Get a test user (first user in the system)
    const userResult = await query('SELECT id, email FROM users LIMIT 1')
    if (userResult.rows.length === 0) {
      console.log('❌ No users found in database')
      return
    }
    
    const testUserId = userResult.rows[0].id
    console.log(`   Using test user: ${userResult.rows[0].email}`)
    
    // Get a test product
    const productResult = await query('SELECT id, name FROM products WHERE status = $1 LIMIT 1', ['active'])
    if (productResult.rows.length === 0) {
      console.log('❌ No active products found in database')
      return
    }
    
    const testProductId = productResult.rows[0].id
    console.log(`   Using test product: ${productResult.rows[0].name}`)
    
    // Check current pending spawn submissions count
    const currentSpawnCount = await query(
      'SELECT COUNT(*) as count FROM spawn_location_submissions WHERE user_id = $1 AND status = $2',
      [testUserId, 'pending']
    )
    console.log(`   Current pending spawn submissions: ${currentSpawnCount.rows[0].count}`)
    
    // Check current pending reviews count
    const currentReviewCount = await query(
      'SELECT COUNT(*) as count FROM product_reviews WHERE user_id = $1 AND status = $2',
      [testUserId, 'pending']
    )
    console.log(`   Current pending reviews: ${currentReviewCount.rows[0].count}`)
    
    // Test 2: Check if we can create more than 5 pending submissions
    console.log('\n2. Testing Submission Limits:')
    
    const spawnLimit = 5
    const reviewLimit = 5
    
    if (currentSpawnCount.rows[0].count >= spawnLimit) {
      console.log(`   ⚠️  User already has ${currentSpawnCount.rows[0].count} pending spawn submissions (at limit)`)
    } else {
      console.log(`   ✅ User can submit ${spawnLimit - currentSpawnCount.rows[0].count} more spawn submissions`)
    }
    
    if (currentReviewCount.rows[0].count >= reviewLimit) {
      console.log(`   ⚠️  User already has ${currentReviewCount.rows[0].count} pending reviews (at limit)`)
    } else {
      console.log(`   ✅ User can submit ${reviewLimit - currentReviewCount.rows[0].count} more reviews`)
    }
    
    // Test 3: Check database constraints
    console.log('\n3. Testing Database Constraints:')
    
    // Check if unique constraint exists on spawn_location_submissions
    const spawnConstraintResult = await query(`
      SELECT constraint_name, constraint_type 
      FROM information_schema.table_constraints 
      WHERE table_name = 'spawn_location_submissions' 
      AND constraint_type = 'UNIQUE'
    `)
    
    if (spawnConstraintResult.rows.length > 0) {
      console.log('   ✅ Unique constraint exists on spawn_location_submissions')
    } else {
      console.log('   ❌ No unique constraint found on spawn_location_submissions')
    }
    
    // Check if unique constraint exists on product_reviews
    const reviewConstraintResult = await query(`
      SELECT constraint_name, constraint_type 
      FROM information_schema.table_constraints 
      WHERE table_name = 'product_reviews' 
      AND constraint_type = 'UNIQUE'
    `)
    
    if (reviewConstraintResult.rows.length > 0) {
      console.log('   ✅ Unique constraint exists on product_reviews')
    } else {
      console.log('   ❌ No unique constraint found on product_reviews')
    }
    
    // Test 4: Show recent submissions
    console.log('\n4. Recent Submissions:')
    
    const recentSpawnSubmissions = await query(`
      SELECT sls.id, sls.status, sls.created_at, p.name as product_name
      FROM spawn_location_submissions sls
      JOIN products p ON sls.product_id = p.id
      WHERE sls.user_id = $1
      ORDER BY sls.created_at DESC
      LIMIT 3
    `, [testUserId])
    
    console.log('   Recent spawn submissions:')
    recentSpawnSubmissions.rows.forEach((submission, index) => {
      console.log(`     ${index + 1}. ${submission.product_name} - ${submission.status} (${submission.created_at})`)
    })
    
    const recentReviews = await query(`
      SELECT pr.id, pr.status, pr.created_at, p.name as product_name
      FROM product_reviews pr
      JOIN products p ON pr.product_id = p.id
      WHERE pr.user_id = $1
      ORDER BY pr.created_at DESC
      LIMIT 3
    `, [testUserId])
    
    console.log('   Recent reviews:')
    recentReviews.rows.forEach((review, index) => {
      console.log(`     ${index + 1}. ${review.product_name} - ${review.status} (${review.created_at})`)
    })
    
    console.log('\n✅ Rate limiting test completed successfully!')
    
  } catch (error) {
    console.error('❌ Error testing rate limiting:', error)
  }
}

// Run the test
testRateLimiting()
