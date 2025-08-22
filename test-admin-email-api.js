require('dotenv').config({ path: '.env.local' });

async function testAdminEmailAPI() {
  console.log('🧪 Testing Admin Email API Route...\n');
  
  const baseUrl = 'http://localhost:3000';
  const testData = {
    email: 'delivered@resend.dev',
    template: 'registration',
    customSubject: 'Test from Admin API',
    customMessage: 'This is a test from the admin email API route'
  };
  
  try {
    console.log('1. Testing admin email API route...');
    console.log(`   URL: ${baseUrl}/api/admin/test-email`);
    console.log(`   Data:`, JSON.stringify(testData, null, 2));
    
    const response = await fetch(`${baseUrl}/api/admin/test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log(`\n2. Response Status: ${response.status}`);
    console.log('3. Response Body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Email API route is working!');
    } else {
      console.log('\n❌ Email API route failed');
    }
    
  } catch (error) {
    console.log('\n❌ Error testing API route:');
    console.log(`   Error: ${error.message}`);
  }
}

testAdminEmailAPI().catch(console.error);
