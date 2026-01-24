-- Add payer_email column to orders table to store PayPal payer email
-- This is the email address of the person who actually paid, which may differ from their account email

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payer_email VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_orders_payer_email ON orders(payer_email) WHERE payer_email IS NOT NULL;

COMMENT ON COLUMN orders.payer_email IS 'Email address of the PayPal payer (from IPN payer_email field). May differ from user account email if they paid with a different PayPal account.';
