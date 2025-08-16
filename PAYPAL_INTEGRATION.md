# PayPal Integration Guide

This document explains how the PayPal integration works in the UOKing e-commerce platform.

## Overview

The PayPal integration consists of three main components:

1. **PayPal Checkout** - Creates PayPal orders and redirects users to PayPal
2. **PayPal Capture** - Captures payments when users return from PayPal
3. **PayPal IPN** - Handles Instant Payment Notifications from PayPal

## Setup Instructions

### 1. PayPal Developer Account

1. Create a PayPal Developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create a new app to get your Client ID and Client Secret
3. Choose between Sandbox (testing) and Live (production) environments

### 2. Environment Variables

Add the following variables to your `.env.local` file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
# For production, use: https://api-m.paypal.com
```

### 3. Admin Settings

1. Go to Admin → Settings
2. Set your PayPal email address in the "PayPal Email" field
3. This email will be used as the payee for all transactions

### 4. IPN Configuration

1. In your PayPal Developer Dashboard, go to Webhooks
2. Add a new webhook with the URL: `https://yourdomain.com/api/paypal/ipn`
3. Select the following events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.PENDING`
   - `PAYMENT.CAPTURE.REFUNDED`

## How It Works

### 1. Checkout Process

1. User clicks "Proceed to Checkout" in cart
2. System creates order in database with status "pending"
3. System creates PayPal order using admin PayPal email
4. User is redirected to PayPal for payment
5. PayPal processes payment and redirects back to `/paypal/return`

### 2. Payment Capture

1. User returns from PayPal with payment token
2. System captures payment using PayPal API
3. Order status is updated to "paid" if successful
4. Cashback is processed (if applicable)
5. User sees success/error page

### 3. IPN Processing

1. PayPal sends webhook notification to `/api/paypal/ipn`
2. System verifies IPN signature with PayPal
3. Order status is updated based on payment status
4. Cashback and referral bonuses are processed
5. Transaction is logged

## API Endpoints

### POST /api/paypal/checkout

Creates a PayPal order and returns approval URL.

**Request Body:**
```json
{
  "cartItems": [...],
  "cashbackToUse": 10.00,
  "selectedShard": "atlantic",
  "couponCode": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "uuid",
  "paypalOrderId": "paypal-order-id",
  "approvalUrl": "https://paypal.com/checkout/..."
}
```

### POST /api/paypal/capture

Captures payment when user returns from PayPal.

**Request Body:**
```json
{
  "paypalOrderId": "paypal-order-id"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "uuid",
  "status": "paid"
}
```

### POST /api/paypal/ipn

Handles PayPal webhook notifications (called by PayPal).

## Security Features

1. **IPN Verification** - All IPN requests are verified with PayPal
2. **Email Verification** - Receiver email must match admin settings
3. **Amount Verification** - Payment amount must match order total
4. **Order Ownership** - Users can only capture their own orders
5. **Session Validation** - All endpoints require valid user session

## Error Handling

The system handles various error scenarios:

- **Invalid PayPal credentials** - Returns 500 error
- **Order not found** - Returns 404 error
- **Amount mismatch** - Returns 400 error
- **Payment failed** - Updates order status to "cancelled"
- **Network errors** - Retries with exponential backoff

## Testing

### Sandbox Testing

1. Use PayPal Sandbox environment
2. Create sandbox buyer and seller accounts
3. Test complete payment flow
4. Verify IPN notifications

### Test Cards

Use these sandbox test cards:
- **Visa**: 4032039999999999
- **Mastercard**: 5424000000000015
- **American Express**: 378282246310005

## Production Deployment

1. Switch to PayPal Live environment
2. Update `PAYPAL_API_URL` to production URL
3. Configure production webhook URL
4. Test with small amounts first
5. Monitor IPN logs for errors

## Troubleshooting

### Common Issues

1. **IPN not received** - Check webhook URL and firewall settings
2. **Payment capture fails** - Verify PayPal credentials and order status
3. **Amount mismatch** - Check currency and decimal precision
4. **Order not found** - Verify order ID format and database connection

### Logs

Check server logs for detailed error messages:
- PayPal API errors
- IPN verification failures
- Database transaction errors
- Cashback processing issues

## Support

For PayPal-specific issues:
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Support](https://www.paypal.com/support/)

For UOKing integration issues:
- Check server logs
- Verify environment variables
- Test with sandbox environment first 