# Email System Setup Guide

## Overview
This system uses **Resend** for sending emails and **Mailchimp** for marketing list management. Both services are modern, reliable, and have excellent deliverability rates.

## 🔧 Setup Steps

### 1. Resend Email Service Setup

**Why Resend?**
- Modern API with excellent deliverability
- 3,000 free emails/month
- Simple setup and great documentation
- Built-in analytics and tracking

**Setup Steps:**
1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add your domain for sending emails (recommended) or use their sandbox domain for testing

**Environment Variable:**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Mailchimp Setup

**Why Mailchimp?**
- Industry standard for email marketing
- Excellent segmentation and automation
- Free tier includes 2,000 contacts
- Great analytics and reporting

**Setup Steps:**
1. Go to [https://mailchimp.com](https://mailchimp.com)
2. Create a free account
3. Create a new audience/list
4. Get your API key from Account → Extras → API Keys
5. Note your server prefix (e.g., 'us1', 'us2') from the API key URL
6. Get your List/Audience ID from Audience → Settings → Audience name and defaults

**Environment Variables:**
```bash

```

### 3. Environment Variables

Add these to your `.env.local` file:

```bash
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Mailchimp Integration
MAILCHIMP_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxx-us1
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=xxxxxxxxxx

# Site URL (for email links)
NEXT_PUBLIC_SITE_URL=https://uoking.vercel.app
```

### 4. Install Dependencies

```bash
npm install resend
```

## 📧 Email Types & Triggers

### 1. Registration Confirmation
- **Trigger**: New user registration
- **Template**: Welcome email with account details
- **Mailchimp**: Adds user to marketing list with 'new-registration' tag

### 2. Order Confirmation
- **Trigger**: PayPal IPN payment completion
- **Template**: Order details with items and delivery info
- **Mailchimp**: Updates user with 'has-ordered' tag and order details

### 3. Order Completed
- **Trigger**: Admin marks order as completed
- **Template**: Delivery ready notification
- **Mailchimp**: Updates user with completion status

## 🛡️ Security Features

### Rate Limiting
- **5 emails per minute** per email address
- Prevents spam and abuse
- Configurable limits

### Validation
- Email format validation
- Required field checks
- Error handling that doesn't break core functionality

### Error Handling
- Email failures don't break user registration or order processing
- Comprehensive logging for debugging
- Graceful degradation

## 📊 Mailchimp Integration Features

### Automatic Tagging
- `customer` - All registered users
- `new-registration` - New signups
- `has-ordered` - Users who have placed orders
- `order-{orderId}` - Specific order tracking
- `spent-{amount}` - Spending tier tracking
- `source:registration` - Registration source
- `source:order-completion` - Order completion source

### Merge Fields
- `FNAME` - First name
- `LNAME` - Last name
- `CHARACTER` - Character name
- `SHARD` - Main shard

## 🧪 Testing

Run the test script to verify everything is working:

```bash
node test-email-system.js
```

This will check:
- Environment variables
- Database connectivity
- Email template generation
- Rate limiting logic
- Mailchimp configuration

## 📈 Monitoring & Analytics

### Email Statistics
- Track sent emails
- Rate limiting status
- Error rates

### Mailchimp Analytics
- List growth
- Engagement rates
- Segmentation data

## 🔄 Workflow

### User Registration Flow:
1. User registers → Account created
2. Welcome email sent via Resend
3. User added to Mailchimp list
4. Tagged as 'new-registration'

### Order Completion Flow:
1. PayPal payment completed → IPN received
2. Order confirmation email sent
3. User updated in Mailchimp with order data
4. Tagged as 'has-ordered' + order details

### Order Delivery Flow:
1. Admin marks order as completed
2. Order completed email sent
3. User notified of delivery readiness

## 🚀 Production Deployment

### Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all the environment variables listed above
4. Redeploy your application

### Domain Verification (Resend)
1. Add your domain in Resend dashboard
2. Add the required DNS records
3. Wait for verification (usually 5-10 minutes)
4. Update your sending domain in the email service

## 📞 Support

### Common Issues:
- **Emails not sending**: Check Resend API key and domain verification
- **Mailchimp errors**: Verify API key, server prefix, and list ID
- **Rate limiting**: Check if you're hitting the 5 emails/minute limit
- **Template issues**: Verify email template syntax

### Debugging:
- Check server logs for email errors
- Use the test script to verify configuration
- Monitor Resend and Mailchimp dashboards for delivery status

## 💰 Costs

### Resend:
- **Free tier**: 3,000 emails/month
- **Paid**: $20/month for 50,000 emails

### Mailchimp:
- **Free tier**: 2,000 contacts, 10,000 emails/month
- **Paid**: $10/month for 500 contacts

## 🎯 Best Practices

1. **Always test emails** before going live
2. **Monitor delivery rates** and bounce rates
3. **Use segmentation** in Mailchimp for targeted campaigns
4. **Keep email templates** mobile-friendly
5. **Include unsubscribe links** (handled by Mailchimp)
6. **Monitor rate limits** to avoid hitting API limits
7. **Backup email data** regularly

## 🔐 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor for unusual email sending patterns
- Implement proper error handling to prevent data leaks
