// Simulate the IPN context
require('dotenv').config();

console.log('=== IPN Context Test ===');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET (' + process.env.RESEND_API_KEY.substring(0, 10) + '...)' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');

// Test the exact same email call that the IPN makes
async function testIpnEmail() {
  try {
    console.log('\n=== Testing IPN Email Call ===');
    
    // Import the email module the same way the IPN does
    const { sendEmail } = await import('./lib/email.ts');
    console.log('✅ Email module imported successfully');
    
    // Test with the exact same data structure as IPN
    const testData = {
      orderId: 'TEST-IPN-123',
      customerName: 'Test Customer',
      email: 'test@example.com',
      total: 49.99,
      items: [
        { name: 'Test Item 1', quantity: 1, price: 29.99 },
        { name: 'Test Item 2', quantity: 1, price: 20.00 }
      ],
      deliveryCharacter: 'TestCharacter',
      shard: 'Atlantic'
    };
    
    console.log('Sending test email with IPN data structure...');
    
    const result = await sendEmail('test@example.com', 'orderConfirmation', testData, {
      from: 'UO King <noreply@uoking.com>',
      replyTo: 'support@uoking.com',
      subject: `Order Confirmation - UO King (Order #${testData.orderId})`
    });
    
    console.log('✅ IPN email test successful:', result);
    
  } catch (error) {
    console.error('❌ IPN email test failed:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
  }
}

testIpnEmail();
