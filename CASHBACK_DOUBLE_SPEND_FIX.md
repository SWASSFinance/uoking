# Cashback Double Spending Prevention Fix

## Problem Description

The cashback system had a critical vulnerability that allowed users to double-spend their cashback balance. Here's how the exploit worked:

1. User has $11 cashback balance
2. User creates an order using $11 cashback (order status: pending, cashback not yet deducted)
3. User creates another order using $11 cashback (same issue)
4. User can create multiple orders using the same $11 cashback
5. Only when payment is completed does the cashback get deducted from the balance

This allowed users to accumulate multiple discounted pending orders that all used the same cashback funds.

## Root Cause

The issue was in the cashback balance calculation. The system only returned the raw `referral_cash` value from the `user_points` table without accounting for cashback that had already been allocated to pending orders.

## Files Modified

### 1. `/app/api/user/cashback-balance/route.ts`
**Problem**: Only returned raw cashback balance without considering pending orders.

**Fix**: Modified to calculate available cashback by subtracting pending order cashback:
```sql
SELECT up.referral_cash,
       COALESCE(SUM(o.cashback_used), 0) as pending_cashback
FROM user_points up
LEFT JOIN orders o ON o.user_id = up.user_id 
  AND o.payment_status = 'pending' 
  AND o.cashback_used > 0
WHERE up.user_id = $1
GROUP BY up.referral_cash
```

**Result**: Returns `availableCashback = rawBalance - pendingCashback`

### 2. `/app/api/paypal/simple-checkout/route.ts`
**Problem**: No server-side validation of cashback amount against available balance.

**Fix**: Added server-side validation before creating orders:
- Queries user's available cashback (accounting for pending orders)
- Validates that requested cashback amount doesn't exceed available balance
- Returns error if insufficient funds

### 3. `/app/api/cart/sync/route.ts`
**Problem**: Same issue as checkout API - no consideration of pending orders.

**Fix**: Updated validation to use available cashback instead of raw balance.

### 4. `/app/api/user/use-cashback/route.ts`
**Problem**: Same issue - could use more cashback than actually available.

**Fix**: Updated to check available cashback (raw balance minus pending orders).

## How the Fix Works

1. **Available Balance Calculation**: 
   ```javascript
   const availableCashback = Math.max(0, rawCashbackBalance - pendingCashback)
   ```

2. **Pending Orders Query**:
   ```sql
   SELECT COALESCE(SUM(cashback_used), 0) as pending_cashback
   FROM orders 
   WHERE user_id = $1 
   AND payment_status = 'pending'
   AND cashback_used > 0
   ```

3. **Validation**: All APIs now validate against `availableCashback` instead of raw balance.

## Testing

A test script has been created at `test-cashback-double-spend.js` to verify the fix:

```bash
node test-cashback-double-spend.js
```

The test verifies:
- Cashback balance calculation includes pending orders
- Double spending attempts are properly rejected
- Available balance is correctly calculated

## Security Impact

**Before Fix**: Users could create unlimited pending orders using the same cashback balance.

**After Fix**: Users can only use cashback that is actually available (not already allocated to pending orders).

## Backward Compatibility

The fix is backward compatible:
- Existing completed orders are unaffected
- Pending orders continue to work as expected
- The API response format remains the same (with additional debug fields)

## Additional Fields

The cashback balance API now returns additional fields for debugging:
- `raw_balance`: The actual balance in the database
- `pending_orders_cashback`: Total cashback used in pending orders
- `referral_cash`: The available balance (raw - pending)

## Monitoring

To monitor for potential issues:
1. Check for users with high pending cashback amounts
2. Monitor failed checkout attempts due to insufficient cashback
3. Review order creation patterns for unusual activity

## Future Considerations

1. **Order Expiration**: Consider adding expiration to pending orders to free up allocated cashback
2. **Audit Logging**: Add logging for cashback allocation and usage
3. **Real-time Updates**: Consider real-time updates to cashback balance when orders are created/cancelled 