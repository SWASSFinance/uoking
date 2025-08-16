# Simple PayPal Setup (Personal Account)

This guide shows you how to set up PayPal payments using a personal PayPal account (no business account needed).

## What You Need

✅ **Personal PayPal Account** - Any regular PayPal account  
✅ **PayPal Email** - The email address you use for PayPal  
❌ **No API Keys Required** - This uses PayPal's simple form submission  

## Setup Steps

### 1. Set Your PayPal Email

1. Go to **Admin → Settings** in your website
2. Find the **"PayPal Email"** field
3. Enter your PayPal email address (the one you use to receive money)
4. Click **"Save Settings"**

That's it! No other setup needed.

## How It Works

1. **Customer clicks "Checkout"** → Creates order in your database
2. **Form submits to PayPal** → Customer pays on PayPal's website
3. **PayPal sends money** → Money goes to your PayPal account
4. **Customer returns** → Shows success/cancel page
5. **Order updates** → PayPal notifies your website about payment status

## What Customers See

1. **Cart Page** → Click "Proceed to Checkout"
2. **PayPal Page** → Pay with PayPal, credit card, etc.
3. **Success Page** → "Payment Successful!" message
4. **Order Confirmation** → Order appears in their account

## What You See

1. **PayPal Account** → Money appears in your PayPal balance
2. **Admin Orders** → Order status updates to "paid"
3. **Email Notifications** → PayPal sends you payment confirmations

## Benefits

✅ **No Business Account Needed** - Works with personal PayPal  
✅ **No API Keys** - Simple form submission  
✅ **Instant Payments** - Money goes directly to your PayPal  
✅ **Secure** - PayPal handles all payment security  
✅ **Multiple Payment Methods** - Credit cards, PayPal balance, etc.  

## Testing

1. **Test Order** → Create a small test order
2. **Pay with PayPal** → Use your own PayPal account to test
3. **Check Results** → Verify money appears in your PayPal account
4. **Check Order Status** → Verify order shows as "paid" in admin

## Troubleshooting

### Money Not Received
- Check PayPal email is correct in admin settings
- Check PayPal account for pending payments
- Look for PayPal emails about payments

### Order Not Updating
- Check server logs for IPN errors
- Verify PayPal email matches exactly
- Check order amount matches payment amount

### Customer Can't Pay
- Make sure PayPal email is set in admin
- Check PayPal account is active
- Verify website is accessible to PayPal

## Support

- **PayPal Help**: [paypal.com/help](https://paypal.com/help)
- **Check PayPal Account**: Log into your PayPal account
- **Server Logs**: Check for error messages in your hosting logs

## Next Steps

Once this is working, you can:
- Add more payment methods
- Customize success/cancel pages
- Set up email notifications
- Add order tracking 