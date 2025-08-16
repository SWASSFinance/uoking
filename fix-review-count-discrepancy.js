import { query } from './lib/db.ts';

async function checkAndFixReviewCounts() {
  try {
    console.log('🔍 Checking for review count discrepancies...\n');

    // Get all users with their stored review counts and actual review counts
    const result = await query(`
      SELECT 
        u.id,
        u.email,
        u.username,
        u.review_count as stored_review_count,
        COUNT(pr.id) as actual_review_count
      FROM users u
      LEFT JOIN product_reviews pr ON u.id = pr.user_id AND pr.status = 'approved'
      GROUP BY u.id, u.email, u.username, u.review_count
      HAVING u.review_count != COUNT(pr.id)
      ORDER BY actual_review_count DESC
    `);

    if (result.rows.length === 0) {
      console.log('✅ No discrepancies found! All review counts are accurate.');
      return;
    }

    console.log(`❌ Found ${result.rows.length} users with review count discrepancies:\n`);

    for (const user of result.rows) {
      console.log(`👤 ${user.email} (${user.username})`);
      console.log(`   - Stored count: ${user.stored_review_count || 0}`);
      console.log(`   - Actual count: ${user.actual_review_count}`);
      console.log(`   - Difference: ${user.actual_review_count - (user.stored_review_count || 0)}`);
      console.log('');

      // Fix the discrepancy
      await query(`
        UPDATE users 
        SET review_count = $1
        WHERE id = $2
      `, [user.actual_review_count, user.id]);

      console.log(`   ✅ Fixed: Updated to ${user.actual_review_count}`);
      console.log('');
    }

    console.log('🎉 All review count discrepancies have been fixed!');

  } catch (error) {
    console.error('❌ Error checking/fixing review counts:', error);
  }
}

// Run the check
checkAndFixReviewCounts()
  .then(() => {
    console.log('✅ Review count check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 