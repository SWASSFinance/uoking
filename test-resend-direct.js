require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testResendDirect() {
  console.log('🧪 Testing Resend API directly...\n');
  
  // Check if API key is loaded
  const apiKey = process.env.RESEND_API_KEY;
  console.log('1. Checking RESEND_API_KEY:');
  if (apiKey) {
    console.log(`   ✅ API Key found: ${apiKey.substring(0, 10)}...`);
  } else {
    console.log('   ❌ API Key not found');
    return;
  }
  
  // Initialize Resend
  const resend = new Resend(apiKey);
  
  try {
    console.log('\n2. Testing email send...');
    
    const result = await resend.emails.send({
      from: 'UO King <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Test Email from UO King',
      html: '<p>This is a test email from UO King to verify Resend is working!</p>',
    });
    
    console.log('   ✅ Email sent successfully!');
    console.log(`   Message ID: ${result.data?.id}`);
    console.log(`   Full response:`, JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('   ❌ Error sending email:');
    console.log(`   Error: ${error.message}`);
    if (error.statusCode) {
      console.log(`   Status Code: ${error.statusCode}`);
    }
    console.log(`   Full error:`, JSON.stringify(error, null, 2));
  }
}

testResendDirect().catch(console.error);
