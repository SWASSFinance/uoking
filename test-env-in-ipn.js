require('dotenv').config();

console.log('Environment check:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET (' + process.env.RESEND_API_KEY.substring(0, 10) + '...)' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');

// Test the email module directly
try {
  console.log('\nTesting email module import...');
  const { sendEmail } = require('./lib/email.ts');
  console.log('✅ Email module imported successfully');
  
  // Test a simple email send
  console.log('\nTesting email send...');
  sendEmail('test@example.com', 'orderConfirmation', {
    orderId: 'TEST-123',
    customerName: 'Test User',
    email: 'test@example.com',
    total: 10.00,
    items: [{ name: 'Test Item', quantity: 1, price: 10.00 }],
    deliveryCharacter: 'TestChar',
    shard: 'Atlantic'
  }, {
    from: 'UO King <noreply@uoking.com>',
    replyTo: 'support@uoking.com',
    subject: 'Test Email'
  }).then(result => {
    console.log('✅ Email sent successfully:', result);
  }).catch(error => {
    console.error('❌ Email send failed:', error.message);
  });
  
} catch (error) {
  console.error('❌ Email module import failed:', error.message);
}
