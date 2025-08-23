-- Add payment_transaction_id column to orders table for PayPal IPN processing
-- This column will store the PayPal transaction ID (txn_id) from IPN notifications

ALTER TABLE orders 
ADD COLUMN payment_transaction_id VARCHAR(255);

-- Add index for efficient querying by transaction ID
CREATE INDEX idx_orders_payment_transaction_id ON orders(payment_transaction_id);

-- Add comment to document the column purpose
COMMENT ON COLUMN orders.payment_transaction_id IS 'PayPal transaction ID (txn_id) from IPN notifications';
