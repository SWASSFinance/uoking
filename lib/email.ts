import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
const EMAIL_TEMPLATES = {
  registration: {
    subject: 'Welcome to UO King - Registration Successful!',
    html: (data: { name: string; email: string; characterName: string }) => `
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
              <h2>Hello ${data.name || data.characterName}!</h2>
              <p>Thank you for registering with UO King! Your account has been successfully created.</p>
              
              <h3>Account Details:</h3>
              <ul>
                <li><strong>Email:</strong> ${data.email}</li>
                <li><strong>Character Name:</strong> ${data.characterName}</li>
                <li><strong>Account Status:</strong> Active</li>
              </ul>
              
              <p>You can now:</p>
              <ul>
                <li>Browse our extensive collection of UO items and services</li>
                <li>Earn points through reviews and referrals</li>
                <li>Access exclusive deals and promotions</li>
                <li>Join our community of UO players</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://uoking.vercel.app'}" class="button">Start Shopping</a>
              
              <p>If you have any questions, feel free to contact our support team.</p>
              
              <p>Happy gaming!</p>
              <p><strong>The UO King Team</strong></p>
            </div>
            <div class="footer">
              <p>This email was sent to ${data.email}</p>
              <p>© 2024 UO King. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  },
  orderConfirmation: {
    subject: 'Order Confirmation - UO King',
    html: (data: { 
      orderId: string; 
      customerName: string; 
      email: string; 
      total: number; 
      items: Array<{ name: string; quantity: number; price: number }>;
      deliveryCharacter?: string;
      shard?: string;
    }) => `
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
              <p>Order #${data.orderId}</p>
            </div>
            <div class="content">
              <h2>Thank you for your order, ${data.customerName}!</h2>
              <p>Your order has been successfully placed and is being processed.</p>
              
              <div class="order-details">
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                ${data.deliveryCharacter ? `<p><strong>Delivery Character:</strong> ${data.deliveryCharacter}</p>` : ''}
                ${data.shard ? `<p><strong>Shard:</strong> ${data.shard}</p>` : ''}
                
                <h4>Items Ordered:</h4>
                ${data.items.map(item => `
                  <div class="item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
                
                <div class="total">
                  <strong>Total: $${data.total.toFixed(2)}</strong>
                </div>
              </div>
              
              <p>We'll notify you once your order is ready for delivery in-game.</p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://uoking.vercel.app'}/account/orders" class="button">View Order Status</a>
              
              <p>If you have any questions about your order, please contact our support team.</p>
              
              <p>Happy gaming!</p>
              <p><strong>The UO King Team</strong></p>
            </div>
            <div class="footer">
              <p>This email was sent to ${data.email}</p>
              <p>© 2024 UO King. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  },
  orderCompleted: {
    subject: 'Order Completed - Ready for Delivery - UO King',
    html: (data: { 
      orderId: string; 
      customerName: string; 
      email: string; 
      deliveryCharacter?: string;
      shard?: string;
    }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Completed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #17a2b8; }
            .button { display: inline-block; background: #17a2b8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Completed!</h1>
              <p>Ready for in-game delivery</p>
            </div>
            <div class="content">
              <h2>Great news, ${data.customerName}!</h2>
              <p>Your order has been completed and is ready for delivery in-game.</p>
              
              <div class="highlight">
                <h3>Delivery Information:</h3>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                ${data.deliveryCharacter ? `<p><strong>Delivery Character:</strong> ${data.deliveryCharacter}</p>` : ''}
                ${data.shard ? `<p><strong>Shard:</strong> ${data.shard}</p>` : ''}
                <p><strong>Status:</strong> Ready for delivery</p>
              </div>
              
              <p>Our delivery team will contact you in-game shortly to arrange the delivery of your items.</p>
              
              <p><strong>Please ensure your delivery character is online and ready to receive the items.</strong></p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://uoking.vercel.app'}/account/orders" class="button">View Order Details</a>
              
              <p>Thank you for choosing UO King!</p>
              <p><strong>The UO King Team</strong></p>
            </div>
            <div class="footer">
              <p>This email was sent to ${data.email}</p>
              <p>© 2024 UO King. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

// Rate limiting for email sending
const emailRateLimits = new Map<string, { count: number; resetTime: number }>()

// Check rate limit for email sending
function checkEmailRateLimit(email: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now()
  const key = `email:${email}`
  const record = emailRateLimits.get(key)
  
  if (!record || now > record.resetTime) {
    emailRateLimits.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

// Send email with rate limiting and validation
export async function sendEmail(
  to: string,
  template: keyof typeof EMAIL_TEMPLATES,
  data: any,
  options: {
    from?: string
    replyTo?: string
    rateLimit?: number
    rateLimitWindow?: number
  } = {}
) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      throw new Error('Invalid email address')
    }

    // Check rate limiting
    const rateLimit = options.rateLimit || 5
    const rateLimitWindow = options.rateLimitWindow || 60000 // 1 minute
    
    if (!checkEmailRateLimit(to, rateLimit, rateLimitWindow)) {
      throw new Error(`Email rate limit exceeded. Maximum ${rateLimit} emails per ${rateLimitWindow / 1000} seconds.`)
    }

    // Get template
    const emailTemplate = EMAIL_TEMPLATES[template]
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`)
    }

    // Generate email content
    const subject = emailTemplate.subject
    const html = emailTemplate.html(data)

    // Send email via Resend
    const result = await resend.emails.send({
      from: options.from || 'UO King <noreply@uoking.com>',
      to: [to],
      subject,
      html,
      replyTo: options.replyTo || 'support@uoking.com'
    })

    // Log successful email send
    console.log(`Email sent successfully to ${to}:`, result)

    return {
      success: true,
      messageId: result.data?.id,
      to,
      template
    }

  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Send registration confirmation email
export async function sendRegistrationEmail(userData: {
  email: string
  name?: string
  characterName: string
}) {
  return sendEmail(userData.email, 'registration', userData)
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(orderData: {
  orderId: string
  customerName: string
  email: string
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
  deliveryCharacter?: string
  shard?: string
}) {
  return sendEmail(orderData.email, 'orderConfirmation', orderData)
}

// Send order completed email
export async function sendOrderCompletedEmail(orderData: {
  orderId: string
  customerName: string
  email: string
  deliveryCharacter?: string
  shard?: string
}) {
  return sendEmail(orderData.email, 'orderCompleted', orderData)
}

// Get email sending statistics
export function getEmailStats() {
  const stats = {
    totalEmails: 0,
    rateLimitedEmails: 0,
    activeRateLimits: 0
  }

  for (const [key, record] of emailRateLimits.entries()) {
    if (key.startsWith('email:')) {
      stats.totalEmails += record.count
      if (Date.now() < record.resetTime) {
        stats.activeRateLimits++
      }
    }
  }

  return stats
}
