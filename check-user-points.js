import { query } from './lib/db.ts';

async function checkUserPoints() {
  try {
    console.log('🔍 Checking user points data...\n');

    // Get all users with their points data
    const result = await query(`
      SELECT 
        u.id,
        u.email,
        u.username,
        u.total_points_earned,
        up.current_points,
        up.lifetime_points,
        up.points_spent,
        u.review_count,
        u.rating_count
      FROM users u
      LEFT JOIN user_points up ON u.id = up.user_id
      WHERE u.total_points_earned > 0 OR up.current_points > 0
      ORDER BY u.total_points_earned DESC
    `);

    if (result.rows.length === 0) {
      console.log('❌ No users found with points data');
      return;
    }

    console.log(`✅ Found ${result.rows.length} users with points data:\n`);

    for (const user of result.rows) {
      console.log(`👤 ${user.email} (${user.username})`);
      console.log(`   - Users table total_points_earned: ${user.total_points_earned || 0}`);
      console.log(`   - User_points table current_points: ${user.current_points || 0}`);
      console.log(`   - User_points table lifetime_points: ${user.lifetime_points || 0}`);
      console.log(`   - User_points table points_spent: ${user.points_spent || 0}`);
      console.log(`   - Review count: ${user.review_count || 0}`);
      console.log(`   - Rating count: ${user.rating_count || 0}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking user points:', error);
  }
}

// Run the check
checkUserPoints()
  .then(() => {
    console.log('✅ User points check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 