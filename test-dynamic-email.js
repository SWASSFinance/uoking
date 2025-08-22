require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testDynamicEmails() {
  console.log('🧪 Testing Dynamic Email Content...\n');
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not found');
    return;
  }
  
  const resend = new Resend(apiKey);
  
  // Test registration email with dynamic user ID
  const userId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const registrationSubject = `Test Welcome Email - UO King (User ID: ${userId})`;
  
  const registrationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to UO King</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎮 Welcome to UO King!</h1>
            <p>Your Ultima Online gaming journey begins now</p>
          </div>
          <div class="content">
            <h2>Hello Test User!</h2>
            <p>Thank you for registering with UO King! Your account has been successfully created.</p>
            
            <h3>Account Details:</h3>
            <ul>
              <li><strong>Email:</strong> test@example.com</li>
              <li><strong>Character Name:</strong> TestCharacter</li>
              <li><strong>Account Status:</strong> Active</li>
              <li><strong>User ID:</strong> ${userId}</li>
            </ul>
            
            <p>You can now:</p>
            <ul>
              <li>Browse our extensive collection of UO items and services</li>
              <li>Earn points through reviews and referrals</li>
              <li>Access exclusive deals and promotions</li>
              <li>Join our community of UO players</li>
            </ul>
            
            <a href="https://uoking.vercel.app" class="button">Start Shopping</a>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Happy gaming!</p>
            <p><strong>The UO King Team</strong></p>
          </div>
          <div class="footer">
            <p>This email was sent to test@example.com</p>
            <p>© 2024 UO King. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  // Test order confirmation email with dynamic order ID
  const orderId = `TEST-${Date.now().toString().slice(-6)}`;
  const orderSubject = `Test Order Confirmation - UO King (Order #${orderId})`;
  
  const orderHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
            <p>Order #${orderId}</p>
          </div>
          <div class="content">
            <h2>Thank you for your order, Test Customer!</h2>
            <p>Your order has been successfully placed and is being processed.</p>
            
            <div class="order-details">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> <span style="font-size: 18px; color: #28a745; font-weight: bold;">${orderId}</span></p>
              <p><strong>Delivery Character:</strong> TestCharacter</p>
              <p><strong>Shard:</strong> Atlantic</p>
              
              <h4>Items Ordered:</h4>
              <div class="item">
                <span>Test Item 1 x1</span>
                <span>$29.99</span>
              </div>
              <div class="item">
                <span>Test Item 2 x1</span>
                <span>$20.00</span>
              </div>
              
              <div class="total">
                <strong>Total: $49.99</strong>
              </div>
            </div>
            
            <p>We'll notify you once your order is ready for delivery in-game.</p>
            
            <a href="https://uoking.vercel.app/account/orders" class="button">View Order Status</a>
            
            <p>If you have any questions about your order, please contact our support team.</p>
            
            <p>Happy gaming!</p>
            <p><strong>The UO King Team</strong></p>
          </div>
          <div class="footer">
            <p>This email was sent to test@example.com</p>
            <p>© 2024 UO King. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  try {
    console.log('1. Testing Registration Email with Dynamic User ID:');
    console.log(`   Subject: ${registrationSubject}`);
    console.log(`   User ID: ${userId}`);
    
    const regResult = await resend.emails.send({
      from: 'UO King <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: registrationSubject,
      html: registrationHtml,
    });
    
    console.log(`   ✅ Registration email sent! Message ID: ${regResult.data?.id}`);
    
    console.log('\n2. Testing Order Confirmation Email with Dynamic Order ID:');
    console.log(`   Subject: ${orderSubject}`);
    console.log(`   Order ID: ${orderId}`);
    
    const orderResult = await resend.emails.send({
      from: 'UO King <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: orderSubject,
      html: orderHtml,
    });
    
    console.log(`   ✅ Order confirmation email sent! Message ID: ${orderResult.data?.id}`);
    
    console.log('\n✅ Dynamic email testing completed successfully!');
    console.log('\n📧 Test Results:');
    console.log(`   • Registration email with User ID: ${userId}`);
    console.log(`   • Order confirmation with Order ID: ${orderId}`);
    console.log('   • Both emails sent to delivered@resend.dev');
    
  } catch (error) {
    console.log('❌ Error sending test emails:');
    console.log(`   Error: ${error.message}`);
  }
}

testDynamicEmails().catch(console.error);
