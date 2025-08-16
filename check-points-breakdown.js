import { query } from './lib/db.ts';

async function checkPointsBreakdown() {
  try {
    console.log('🔍 Checking detailed points breakdown...\n');

    // Get user details
    const userResult = await query(`
      SELECT 
        u.id,
        u.email,
        u.username,
        u.total_points_earned,
        u.review_count,
        u.rating_count
      FROM users u
      WHERE u.email = 'willatrethink@gmail.com'
    `);

    if (userResult.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = userResult.rows[0];
    console.log(`👤 User: ${user.email} (${user.username})`);
    console.log(`💰 Total Points Earned: ${user.total_points_earned}`);
    console.log(`📝 Review Count: ${user.review_count}`);
    console.log(`⭐ Rating Count: ${user.rating_count}`);
    console.log('');

    // Get all reviews with details
    const reviewsResult = await query(`
      SELECT 
        pr.id,
        pr.rating,
        pr.title,
        pr.content,
        pr.status,
        pr.created_at,
        p.name as product_name,
        LENGTH(pr.content) as content_length
      FROM product_reviews pr
      JOIN products p ON pr.product_id = p.id
      WHERE pr.user_id = $1
      ORDER BY pr.created_at DESC
    `, [user.id]);

    console.log('📝 Review Details:');
    for (const review of reviewsResult.rows) {
      console.log(`   - Product: ${review.product_name}`);
      console.log(`   - Rating: ${review.rating || 'No rating'}`);
      console.log(`   - Content Length: ${review.content_length} characters`);
      console.log(`   - Status: ${review.status}`);
      console.log(`   - Created: ${review.created_at}`);
      
      // Calculate points for this review
      let reviewPoints = 0;
      if (review.status === 'approved') {
        reviewPoints += 10; // Base review points
        if (review.rating) reviewPoints += 5; // Rating points
        if (review.content_length >= 50) reviewPoints += 5; // Detailed review points
      }
      console.log(`   - Points from this review: ${reviewPoints}`);
      console.log('');
    }

    // Check if there are any other point-earning activities
    console.log('🔍 Checking for other point sources...');
    
    // Check user_points table for any additional info
    const pointsResult = await query(`
      SELECT 
        up.*,
        up.referral_cash
      FROM user_points up
      WHERE up.user_id = $1
    `, [user.id]);

    if (pointsResult.rows.length > 0) {
      const points = pointsResult.rows[0];
      console.log(`   - Current Points: ${points.current_points}`);
      console.log(`   - Lifetime Points: ${points.lifetime_points}`);
      console.log(`   - Points Spent: ${points.points_spent}`);
      console.log(`   - Referral Cash: $${points.referral_cash || 0}`);
    }

    // Check if there are any other point-earning tables or activities
    console.log('\n🔍 Checking for other point-earning activities...');
    
    // You might have other point-earning activities like:
    // - Sign-up bonus
    // - First purchase bonus
    // - Referral bonuses
    // - Special promotions
    
    console.log('   - Check if you received any sign-up bonuses');
    console.log('   - Check if you received any first-purchase bonuses');
    console.log('   - Check if you received any referral bonuses');
    console.log('   - Check if there were any special promotions');

  } catch (error) {
    console.error('❌ Error checking points breakdown:', error);
  }
}

// Run the check
checkPointsBreakdown()
  .then(() => {
    console.log('✅ Points breakdown check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 