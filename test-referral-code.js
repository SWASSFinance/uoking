const { query } = require('./lib/db.ts');

async function testReferralCode() {
  try {
    console.log('Checking referral code X9KPFI...');
    
    const result = await query('SELECT * FROM user_referral_codes WHERE referral_code = $1', ['X9KPFI']);
    
    if (result.rows && result.rows.length > 0) {
      console.log('✅ Referral code X9KPFI found!');
      console.log('User ID:', result.rows[0].user_id);
      console.log('Is Active:', result.rows[0].is_active);
      console.log('Created:', result.rows[0].created_at);
    } else {
      console.log('❌ Referral code X9KPFI not found');
      
      // Check if any referral codes exist
      const allCodes = await query('SELECT COUNT(*) as count FROM user_referral_codes');
      console.log('Total referral codes in database:', allCodes.rows[0].count);
      
      if (allCodes.rows[0].count > 0) {
        const sampleCodes = await query('SELECT referral_code, user_id FROM user_referral_codes LIMIT 5');
        console.log('Sample referral codes:', sampleCodes.rows);
      }
    }
    
    // Check user_referrals table structure
    console.log('\nChecking user_referrals table...');
    const referrals = await query('SELECT COUNT(*) as count FROM user_referrals');
    console.log('Total referrals:', referrals.rows[0].count);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

testReferralCode(); 