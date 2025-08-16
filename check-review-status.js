import { query } from './lib/db.ts';

async function checkReviewStatus() {
  try {
    console.log('🔍 Checking review statuses...\n');

    // Get all reviews with their status
    const result = await query(`
      SELECT 
        pr.id,
        pr.user_id,
        pr.product_id,
        pr.rating,
        pr.status,
        pr.created_at,
        u.email,
        u.username,
        p.name as product_name
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.id
      JOIN products p ON pr.product_id = p.id
      ORDER BY pr.created_at DESC
    `);

    if (result.rows.length === 0) {
      console.log('❌ No reviews found');
      return;
    }

    console.log(`✅ Found ${result.rows.length} reviews:\n`);

    for (const review of result.rows) {
      console.log(`📝 Review ID: ${review.id}`);
      console.log(`   - User: ${review.email} (${review.username})`);
      console.log(`   - Product: ${review.product_name}`);
      console.log(`   - Rating: ${review.rating || 'No rating'}`);
      console.log(`   - Status: ${review.status}`);
      console.log(`   - Created: ${review.created_at}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking review status:', error);
  }
}

// Run the check
checkReviewStatus()
  .then(() => {
    console.log('✅ Review status check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 