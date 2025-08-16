const { query } = require('./lib/db.ts');

async function addUserReviewTracking() {
  try {
    console.log('Adding user review and rating count tracking...');
    
    // Add columns to users table
    console.log('Adding columns to users table...');
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_points_earned INTEGER DEFAULT 0
    `);
    
    // Create indexes
    console.log('Creating indexes...');
    await query(`CREATE INDEX IF NOT EXISTS idx_users_review_count ON users(review_count DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_users_rating_count ON users(rating_count DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points_earned DESC)`);
    
    // Update existing users with their current review/rating counts
    console.log('Updating existing users with review counts...');
    await query(`
      UPDATE users 
      SET 
        review_count = (
          SELECT COUNT(*) 
          FROM product_reviews 
          WHERE product_reviews.user_id = users.id 
          AND product_reviews.status = 'approved'
        ),
        rating_count = (
          SELECT COUNT(*) 
          FROM product_reviews 
          WHERE product_reviews.user_id = users.id 
          AND product_reviews.rating IS NOT NULL
          AND product_reviews.status = 'approved'
        )
    `);
    
    console.log('✅ User review tracking migration completed successfully!');
    
    // Verify the changes
    const verifyResult = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('review_count', 'rating_count', 'total_points_earned')
      ORDER BY column_name
    `);
    
    console.log('\nVerified columns added:');
    verifyResult.rows.forEach(row => {
      console.log(`• ${row.column_name} - ${row.data_type}`);
    });
    
    // Show sample data
    const sampleResult = await query(`
      SELECT id, email, review_count, rating_count, total_points_earned 
      FROM users 
      WHERE review_count > 0 OR rating_count > 0 
      LIMIT 5
    `);
    
    if (sampleResult.rows.length > 0) {
      console.log('\nSample users with reviews:');
      sampleResult.rows.forEach(row => {
        console.log(`• ${row.email}: ${row.review_count} reviews, ${row.rating_count} ratings, ${row.total_points_earned} points`);
      });
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
addUserReviewTracking()
  .then(() => {
    console.log('Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 