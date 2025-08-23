const { query } = require('./lib/db.ts');

async function checkIpnLogs() {
  try {
    console.log('Checking latest IPN logs...');
    
    const result = await query(`
      SELECT 
        id, 
        payment_status, 
        processing_status, 
        email_sent, 
        email_error, 
        received_at
      FROM paypal_ipn_logs 
      ORDER BY received_at DESC 
      LIMIT 5
    `);
    
    console.log('Latest IPN logs:');
    console.table(result.rows);
    
    // Check if any emails failed
    const failedEmails = result.rows.filter(row => row.email_sent === false);
    if (failedEmails.length > 0) {
      console.log('\n❌ Failed emails:');
      failedEmails.forEach(row => {
        console.log(`- IPN ID: ${row.id}, Error: ${row.email_error || 'Unknown error'}`);
      });
    }
    
    // Check successful emails
    const successfulEmails = result.rows.filter(row => row.email_sent === true);
    if (successfulEmails.length > 0) {
      console.log('\n✅ Successful emails:');
      successfulEmails.forEach(row => {
        console.log(`- IPN ID: ${row.id}, Message ID: ${row.email_message_id}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking IPN logs:', error);
  } finally {
    process.exit();
  }
}

checkIpnLogs();
