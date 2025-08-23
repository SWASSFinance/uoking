const { sendEmail } = require('./lib/email.ts');

async function testIpnEmail() {
  try {
    console.log('Testing IPN email functionality...');
    
    const testData = {
      orderId: 'TEST-ORDER-123',
      customerName: 'Test Customer',
      email: 'test@example.com', // Replace with your email for testing
      total: 49.99,
      items: [
        { name: 'Test Item 1', quantity: 1, price: 29.99 },
        { name: 'Test Item 2', quantity: 1, price: 20.00 }
      ],
      deliveryCharacter: 'TestCharacter',
      shard: 'Atlantic'
    };
    
    console.log('Sending test email with data:', testData);
    
    const result = await sendEmail(testData.email, 'orderConfirmation', testData, {
      from: 'UO King <noreply@uoking.com>',
      replyTo: 'support@uoking.com',
      subject: `Test Order Confirmation - UO King (Order #${testData.orderId})`
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
  } finally {
    process.exit();
  }
}

testIpnEmail();
