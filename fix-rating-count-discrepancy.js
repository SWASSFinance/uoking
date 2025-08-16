import { query } from './lib/db.ts';

async function checkAndFixRatingCounts() {
  try {
    console.log('🔍 Checking for rating count discrepancies...\n');

    // Get all users with their stored rating counts and actual rating counts
    const result = await query(`
      SELECT 
        u.id,
        u.email,
        u.username,
        u.rating_count as stored_rating_count,
        COUNT(pr.id) as actual_rating_count
      FROM users u
      LEFT JOIN product_reviews pr ON u.id = pr.user_id 
        AND pr.status = 'approved' 
        AND pr.rating IS NOT NULL
      GROUP BY u.id, u.email, u.username, u.rating_count
      HAVING u.rating_count != COUNT(pr.id)
      ORDER BY actual_rating_count DESC
    `);

    if (result.rows.length === 0) {
      console.log('✅ No rating count discrepancies found! All rating counts are accurate.');
      return;
    }

    console.log(`❌ Found ${result.rows.length} users with rating count discrepancies:\n`);

    for (const user of result.rows) {
      console.log(`👤 ${user.email} (${user.username})`);
      console.log(`   - Stored rating count: ${user.stored_rating_count || 0}`);
      console.log(`   - Actual rating count: ${user.actual_rating_count}`);
      console.log(`   - Difference: ${user.actual_rating_count - (user.stored_rating_count || 0)}`);
      console.log('');

      // Fix the discrepancy
      await query(`
        UPDATE users 
        SET rating_count = $1
        WHERE id = $2
      `, [user.actual_rating_count, user.id]);

      console.log(`   ✅ Fixed: Updated to ${user.actual_rating_count}`);
      console.log('');
    }

    console.log('🎉 All rating count discrepancies have been fixed!');

  } catch (error) {
    console.error('❌ Error checking/fixing rating counts:', error);
  }
}

// Run the check
checkAndFixRatingCounts()
  .then(() => {
    console.log('✅ Rating count check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 