const { Pool } = require('pg')

// Test script to verify review system functionality
async function testReviewSystem() {
  const pool = new Pool({ connectionString: process.env.POSTGRES_URL })
  
  try {
    console.log('🧪 Testing review system functionality...')
    
    // Test 1: Check database schema for review-related tables and columns
    console.log('\n1. Checking database schema...')
    
    const schemaChecks = [
      {
        name: 'product_reviews table',
        query: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'product_reviews' 
          ORDER BY ordinal_position
        `
      },
      {
        name: 'users table review columns',
        query: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name IN ('review_count', 'rating_count', 'total_points_earned')
          ORDER BY ordinal_position
        `
      },
      {
        name: 'user_profiles table',
        query: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'user_profiles' 
          ORDER BY ordinal_position
        `
      }
    ]
    
    for (const check of schemaChecks) {
      console.log(`\n📋 ${check.name}:`)
      const result = await pool.query(check.query)
      if (result.rows.length > 0) {
        result.rows.forEach(row => {
          console.log(`   ✅ ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
        })
      } else {
        console.log(`   ⚠️  No columns found`)
      }
    }
    
    // Test 2: Check for existing reviews and their data
    console.log('\n2. Checking existing reviews...')
    
    const reviewsQuery = `
      SELECT 
        pr.id,
        pr.rating,
        pr.title,
        pr.content,
        pr.status,
        pr.created_at,
        u.username,
        u.first_name,
        u.last_name,
        u.character_names,
        up.profile_image_url,
        p.name as product_name
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      JOIN products p ON pr.product_id = p.id
      ORDER BY pr.created_at DESC
      LIMIT 5
    `
    
    const reviewsResult = await pool.query(reviewsQuery)
    
    if (reviewsResult.rows.length > 0) {
      console.log(`✅ Found ${reviewsResult.rows.length} recent reviews:`)
      reviewsResult.rows.forEach((review, index) => {
        console.log(`   ${index + 1}. ${review.product_name} - ${review.username} (${review.status})`)
        console.log(`      Rating: ${review.rating}/5`)
        console.log(`      Character: ${review.character_names ? review.character_names[0] : 'None'}`)
        console.log(`      Profile Image: ${review.profile_image_url ? 'Yes' : 'No'}`)
        console.log(`      Title: ${review.title || 'None'}`)
        console.log(`      Content: ${review.content.substring(0, 50)}...`)
      })
    } else {
      console.log('⚠️  No reviews found in database')
    }
    
    // Test 3: Check user review counts
    console.log('\n3. Checking user review counts...')
    
    const userStatsQuery = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.review_count,
        u.rating_count,
        u.total_points_earned,
        COUNT(pr.id) as actual_review_count,
        COUNT(CASE WHEN pr.status = 'approved' THEN 1 END) as approved_reviews
      FROM users u
      LEFT JOIN product_reviews pr ON u.id = pr.user_id
      WHERE u.review_count > 0 OR pr.id IS NOT NULL
      GROUP BY u.id, u.username, u.email, u.review_count, u.rating_count, u.total_points_earned
      ORDER BY actual_review_count DESC
      LIMIT 5
    `
    
    const userStatsResult = await pool.query(userStatsQuery)
    
    if (userStatsResult.rows.length > 0) {
      console.log(`✅ Found ${userStatsResult.rows.length} users with reviews:`)
      userStatsResult.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email})`)
        console.log(`      Stored count: ${user.review_count || 0}`)
        console.log(`      Actual count: ${user.actual_review_count}`)
        console.log(`      Approved: ${user.approved_reviews}`)
        console.log(`      Total points: ${user.total_points_earned || 0}`)
        
        if (user.review_count !== user.actual_review_count) {
          console.log(`      ⚠️  COUNT MISMATCH: Stored vs Actual`)
        }
      })
    } else {
      console.log('⚠️  No users with reviews found')
    }
    
    // Test 4: Check for potential issues
    console.log('\n4. Checking for potential issues...')
    
    // Check for reviews without users
    const orphanedReviewsQuery = `
      SELECT COUNT(*) as count
      FROM product_reviews pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE u.id IS NULL
    `
    
    const orphanedResult = await pool.query(orphanedReviewsQuery)
    if (orphanedResult.rows[0].count > 0) {
      console.log(`❌ Found ${orphanedResult.rows[0].count} orphaned reviews (no user)`)
    } else {
      console.log('✅ No orphaned reviews found')
    }
    
    // Check for reviews without products
    const orphanedProductReviewsQuery = `
      SELECT COUNT(*) as count
      FROM product_reviews pr
      LEFT JOIN products p ON pr.product_id = p.id
      WHERE p.id IS NULL
    `
    
    const orphanedProductResult = await pool.query(orphanedProductReviewsQuery)
    if (orphanedProductResult.rows[0].count > 0) {
      console.log(`❌ Found ${orphanedProductResult.rows[0].count} reviews for non-existent products`)
    } else {
      console.log('✅ No reviews for non-existent products found')
    }
    
    // Check for pending reviews
    const pendingReviewsQuery = `
      SELECT COUNT(*) as count
      FROM product_reviews
      WHERE status = 'pending'
    `
    
    const pendingResult = await pool.query(pendingReviewsQuery)
    console.log(`📋 Found ${pendingResult.rows[0].count} pending reviews`)
    
    console.log('\n🎉 Review system test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await pool.end()
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testReviewSystem()
}

module.exports = { testReviewSystem } 