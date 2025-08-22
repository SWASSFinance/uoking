require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testSubjectOverride() {
  console.log('🧪 Testing Subject Override...\n');
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not found');
    return;
  }
  
  const resend = new Resend(apiKey);
  
  // Test with custom subject
  const customSubject = 'CUSTOM SUBJECT - This should override the default';
  
  try {
    console.log('1. Testing with custom subject override:');
    console.log(`   Custom subject: ${customSubject}`);
    
    const result = await resend.emails.send({
      from: 'UO King <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: customSubject,
      html: '<p>This email should have the custom subject: ' + customSubject + '</p>',
    });
    
    console.log(`   ✅ Email sent with custom subject! Message ID: ${result.data?.id}`);
    console.log('   ✅ Subject override is working correctly!');
    
  } catch (error) {
    console.log('❌ Error sending test email:');
    console.log(`   Error: ${error.message}`);
  }
}

testSubjectOverride().catch(console.error);
