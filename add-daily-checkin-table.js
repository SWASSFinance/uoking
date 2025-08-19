const { query } = require('./lib/db.ts');

async function addDailyCheckinTable() {
  try {
    console.log('Starting daily check-in table migration...');
    
    // Check if table already exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_daily_checkins'
      ) as exists
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('Creating user_daily_checkins table...');
      
      await query(`
        CREATE TABLE user_daily_checkins (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          checkin_date DATE NOT NULL,
          points_earned INTEGER NOT NULL DEFAULT 10,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, checkin_date)
        )
      `);
      
      // Create indexes for performance
      await query(`
        CREATE INDEX idx_user_daily_checkins_user_id ON user_daily_checkins(user_id)
      `);
      
      await query(`
        CREATE INDEX idx_user_daily_checkins_date ON user_daily_checkins(checkin_date)
      `);
      
      await query(`
        CREATE INDEX idx_user_daily_checkins_user_date ON user_daily_checkins(user_id, checkin_date)
      `);
      
      console.log('✅ Daily check-in table created successfully!');
    } else {
      console.log('✅ Daily check-in table already exists');
    }
    
    // Verify table structure
    const tableInfo = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'user_daily_checkins'
      ORDER BY ordinal_position
    `);
    
    console.log('Table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });
    
    console.log('🎉 Daily check-in system migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
addDailyCheckinTable()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
