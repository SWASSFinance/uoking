import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
const EMAIL_TEMPLATES = {
  debug: {
    subject: (data: { subject: string }) => data.subject,
    html: (data: { html: string }) => data.html
  },
  registration: {
    subject: (data: { name: string; email: string; characterName: string; userId?: string }) => 
      data.userId ? `Welcome to UO King - Registration Successful! (User ID: ${data.userId})` : 'Welcome to UO King - Registration Successful!',
    html: (data: { name: string; email: string; characterName: string; userId?: string }) => `
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
                ${data.userId ? `<li><strong>User ID:</strong> ${data.userId}</li>` : ''}
              </ul>
              
              <p>You can now:</p>
              <ul>
                <li>Browse our extensive collection of UO items and services</li>
                <li>Earn points through reviews and referrals</li>
                <li>Access exclusive deals and promotions</li>
                <li>Join our community of UO players</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.uoking.com'}" class="button">Start Shopping</a>
              
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
    subject: (data: { 
      orderId: string; 
      customerName: string; 
      email: string; 
      total: number; 
      items: Array<{ name: string; quantity: number; price: number; custom_details?: any }>;
      deliveryCharacter?: string;
      shard?: string;
    }) => `Order Confirmation - UO King (Order #${data.orderId})`,
    html: (data: { 
      orderId: string; 
      customerName: string; 
      email: string; 
      total: number; 
      items: Array<{ name: string; quantity: number; price: number; custom_details?: any }>;
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
                <p><strong>Order ID:</strong> <span style="font-size: 18px; color: #28a745; font-weight: bold;">${data.orderId}</span></p>
                ${data.deliveryCharacter ? `<p><strong>Delivery Character:</strong> ${data.deliveryCharacter}</p>` : ''}
                ${data.shard ? `<p><strong>Shard:</strong> ${data.shard}</p>` : ''}
                
                <h4>Items Ordered:</h4>
                ${data.items.map(item => {
                  let itemHtml = `
                    <div class="item">
                      <span>${item.name} x${item.quantity}</span>
                      <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  `;
                  
                  // Add account builder details if present
                  if (item.custom_details && item.custom_details.shard && item.custom_details.characters) {
                    const details = item.custom_details;
                    itemHtml += `
                      <div style="margin-left: 20px; padding: 10px; background: #e3f2fd; border-left: 4px solid #2196f3; margin-top: 5px; font-size: 14px;">
                        <strong>Custom Account Details:</strong><br>
                        <strong>Shard:</strong> ${details.shard}<br>
                        <strong>Characters:</strong> ${details.numCharacters}<br>
                        ${details.options?.addHouse ? '<strong>House:</strong> Included<br>' : ''}
                        <br><strong>Character Configurations:</strong><br>
                        ${details.characters.map((char: any, index: number) => `
                          <div style="margin: 5px 0; padding: 5px; background: white; border-radius: 3px;">
                            <strong>#${index + 1}: ${char.name}</strong> (${char.race} ${char.gender})<br>
                            <em>Skills (${char.totalSkillPoints}/720):</em> ${Object.entries(char.skills).map(([skill, points]) => `${skill} ${points}`).join(', ')}<br>
                            ${char.suitTier !== 'none' || char.addMount || char.addBooks ? 
                              `<em>Extras:</em> ${[
                                char.suitTier !== 'none' ? `${char.suitTier} suit` : null,
                                char.addMount ? 'Mount' : null,
                                char.addBooks ? 'Books' : null
                              ].filter(Boolean).join(', ')}<br>` : ''
                            }
                          </div>
                        `).join('')}
                      </div>
                    `;
                  }
                  
                  return itemHtml;
                }).join('')}
                
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
    subject: (data: { 
      orderId: string; 
      customerName: string; 
      email: string; 
      deliveryCharacter?: string;
      shard?: string;
    }) => `Order Completed - Ready for Delivery - UO King (Order #${data.orderId})`,
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
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .highlight { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Completed!</h1>
              <p>Your UO King order is ready for delivery</p>
            </div>
            <div class="content">
              <h2>Hello ${data.customerName}!</h2>
              <p>Great news! Your order has been completed and is ready for delivery.</p>
              
              <div class="highlight">
                <h3>Order Details:</h3>
                <p><strong>Order Number:</strong> <span style="color: #28a745; font-weight: bold;">#${data.orderId}</span></p>
                ${data.deliveryCharacter ? `<p><strong>Delivery Character:</strong> ${data.deliveryCharacter}</p>` : ''}
                ${data.shard ? `<p><strong>Shard:</strong> ${data.shard}</p>` : ''}
              </div>
              
              <p>Our team will contact you shortly to arrange delivery of your items.</p>
              
              <p>If you have any questions about your order, please don't hesitate to contact our support team.</p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.uoking.com'}" class="button">Visit UO King</a>
              
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
  },
  passwordReset: {
    subject: (data: { name: string; email: string; resetUrl: string }) => 
      'Reset Your Password - UO King',
    html: (data: { name: string; email: string; resetUrl: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .reset-link { word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Reset Your Password</h1>
              <p>UO King Account Security</p>
            </div>
            <div class="content">
              <h2>Hello ${data.name}!</h2>
              <p>We received a request to reset your password for your UO King account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <a href="${data.resetUrl}" class="button">Reset Password</a>
              
              <div class="warning">
                <h3>⚠️ Important Security Information:</h3>
                <ul>
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>For security reasons, this link can only be used once</li>
                </ul>
              </div>
              
              <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
              <div class="reset-link">${data.resetUrl}</div>
              
              <p>If you have any questions or need assistance, please contact our support team.</p>
              
              <p>Stay safe and happy gaming!</p>
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
    subject?: string
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
    const subject = options.subject || (typeof emailTemplate.subject === 'function' ? emailTemplate.subject(data) : emailTemplate.subject)
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
  userId?: string
}) {
  return sendEmail(userData.email, 'registration', userData)
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(orderData: {
  orderId: string
  customerName: string
  email: string
  total: number
  items: Array<{ name: string; quantity: number; price: number; custom_details?: any }>
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
