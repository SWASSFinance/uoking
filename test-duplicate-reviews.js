const { Pool } = require('pg')

// Test script to verify duplicate review prevention
async function testDuplicateReviews() {
  const pool = new Pool({ connectionString: process.env.POSTGRES_URL })
  
  try {
    console.log('🧪 Testing duplicate review prevention...')
    
    // Test 1: Check database constraint
    console.log('\n1. Checking database constraint...')
    
    const constraintQuery = `
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'product_reviews' 
        AND tc.constraint_type = 'UNIQUE'
    `
    
    const constraintResult = await pool.query(constraintQuery)
    
    if (constraintResult.rows.length > 0) {
      console.log('✅ Found unique constraint on product_reviews:')
      constraintResult.rows.forEach(row => {
        console.log(`   - ${row.constraint_name}: ${row.column_name}`)
      })
    } else {
      console.log('❌ No unique constraint found on product_reviews')
    }
    
    // Test 2: Check existing reviews for duplicates
    console.log('\n2. Checking for existing duplicate reviews...')
    
    const duplicateQuery = `
      SELECT 
        product_id,
        user_id,
        COUNT(*) as review_count
      FROM product_reviews
      GROUP BY product_id, user_id
      HAVING COUNT(*) > 1
    `
    
    const duplicateResult = await pool.query(duplicateQuery)
    
    if (duplicateResult.rows.length > 0) {
      console.log(`❌ Found ${duplicateResult.rows.length} duplicate review combinations:`)
      duplicateResult.rows.forEach(row => {
        console.log(`   - Product: ${row.product_id}, User: ${row.user_id}, Count: ${row.review_count}`)
      })
    } else {
      console.log('✅ No duplicate reviews found in database')
    }
    
    // Test 3: Check review creation logic
    console.log('\n3. Testing review creation logic...')
    
    // Get a sample user and product
    const sampleDataQuery = `
      SELECT 
        u.id as user_id,
        u.username,
        p.id as product_id,
        p.name as product_name
      FROM users u
      CROSS JOIN products p
      WHERE u.username != 'admin'
      LIMIT 1
    `
    
    const sampleResult = await pool.query(sampleDataQuery)
    
    if (sampleResult.rows.length > 0) {
      const sample = sampleResult.rows[0]
      console.log(`✅ Using sample data: User ${sample.username} and Product ${sample.product_name}`)
      
      // Check if user has already reviewed this product
      const existingReviewQuery = `
        SELECT id, status, rating, title, content
        FROM product_reviews
        WHERE user_id = $1 AND product_id = $2
      `
      
      const existingResult = await pool.query(existingReviewQuery, [sample.user_id, sample.product_id])
      
      if (existingResult.rows.length > 0) {
        console.log(`✅ User has already reviewed this product:`)
        const review = existingResult.rows[0]
        console.log(`   - Rating: ${review.rating}/5`)
        console.log(`   - Status: ${review.status}`)
        console.log(`   - Title: ${review.title || 'None'}`)
        console.log(`   - Content: ${review.content.substring(0, 50)}...`)
        
        // Test the prevention logic
        console.log('\n🔍 Testing duplicate prevention...')
        try {
          // This should fail due to the constraint
          await pool.query(`
            INSERT INTO product_reviews (product_id, user_id, rating, title, content, status)
            VALUES ($1, $2, 5, 'Test Duplicate', 'This should fail', 'pending')
          `, [sample.product_id, sample.user_id])
          
          console.log('❌ Duplicate review was created (this should not happen)')
        } catch (error) {
          if (error.code === '23505') { // Unique violation
            console.log('✅ Duplicate review correctly prevented by database constraint')
          } else {
            console.log('❌ Unexpected error:', error.message)
          }
        }
      } else {
        console.log('✅ User has not reviewed this product yet')
      }
    } else {
      console.log('⚠️  No sample data available for testing')
    }
    
    // Test 4: Check review statistics
    console.log('\n4. Checking review statistics...')
    
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT product_id) as unique_products,
        COUNT(DISTINCT (user_id, product_id)) as unique_user_product_combinations
      FROM product_reviews
    `
    
    const statsResult = await pool.query(statsQuery)
    const stats = statsResult.rows[0]
    
    console.log('📊 Review Statistics:')
    console.log(`   - Total reviews: ${stats.total_reviews}`)
    console.log(`   - Unique users: ${stats.unique_users}`)
    console.log(`   - Unique products: ${stats.unique_products}`)
    console.log(`   - Unique user-product combinations: ${stats.unique_user_product_combinations}`)
    
    if (stats.total_reviews === stats.unique_user_product_combinations) {
      console.log('✅ All reviews are unique (no duplicates)')
    } else {
      console.log(`❌ Found ${stats.total_reviews - stats.unique_user_product_combinations} duplicate reviews`)
    }
    
    // Test 5: Check review status distribution
    console.log('\n5. Checking review status distribution...')
    
    const statusQuery = `
      SELECT 
        status,
        COUNT(*) as count
      FROM product_reviews
      GROUP BY status
      ORDER BY count DESC
    `
    
    const statusResult = await pool.query(statusQuery)
    
    console.log('📋 Review Status Distribution:')
    statusResult.rows.forEach(row => {
      console.log(`   - ${row.status}: ${row.count} reviews`)
    })
    
    console.log('\n🎉 Duplicate review prevention test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await pool.end()
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDuplicateReviews()
}

module.exports = { testDuplicateReviews } 