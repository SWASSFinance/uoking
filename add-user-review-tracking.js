const { query } = require('./lib/db.ts');

async function addUserReviewTracking() {
  try {
    console.log('Adding user review and rating count tracking...');
    
    // Read and execute the SQL migration
    const fs = require('fs');
    const sql = fs.readFileSync('./add-user-review-tracking.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
        console.log('Executed:', statement.substring(0, 50) + '...');
      }
    }
    
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
    
    // Check trigger
    const triggerResult = await query(`
      SELECT trigger_name 
      FROM information_schema.triggers 
      WHERE trigger_name = 'trigger_update_user_review_counts'
    `);
    
    if (triggerResult.rows.length > 0) {
      console.log('✅ Trigger created successfully');
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