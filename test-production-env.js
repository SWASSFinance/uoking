// Test production-like environment
console.log('=== Production Environment Test ===');

// Don't load .env files (simulate production)
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET (' + process.env.RESEND_API_KEY.substring(0, 10) + '...)' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');

// Test email import without .env loading
try {
  console.log('\nTesting email module without .env loading...');
  const { sendEmail } = require('./lib/email.ts');
  console.log('✅ Email module imported successfully');
  
  // Test a simple email
  sendEmail('test@example.com', 'orderConfirmation', {
    orderId: 'TEST-PROD-123',
    customerName: 'Test Customer',
    email: 'test@example.com',
    total: 10.00,
    items: [{ name: 'Test Item', quantity: 1, price: 10.00 }],
    deliveryCharacter: 'TestChar',
    shard: 'Atlantic'
  }, {
    from: 'UO King <noreply@uoking.com>',
    replyTo: 'support@uoking.com',
    subject: 'Test Production Email'
  }).then(result => {
    console.log('✅ Production email test successful:', result);
  }).catch(error => {
    console.error('❌ Production email test failed:', error.message);
  });
  
} catch (error) {
  console.error('❌ Email module import failed:', error.message);
}
