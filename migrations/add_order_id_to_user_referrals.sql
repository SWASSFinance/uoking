-- Add order_id column to user_referrals table for tracking cashback transactions
-- This column will store the order ID that generated the cashback reward

ALTER TABLE user_referrals 
ADD COLUMN order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

-- Add index for efficient querying by order ID
CREATE INDEX idx_user_referrals_order_id ON user_referrals(order_id);

-- Add comment to document the column purpose
COMMENT ON COLUMN user_referrals.order_id IS 'Order ID that generated this cashback/referral reward';
