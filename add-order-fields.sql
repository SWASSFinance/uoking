-- Add missing fields to orders table for cashback and coupon tracking

-- Add cashback_used field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'cashback_used'
    ) THEN
        ALTER TABLE orders ADD COLUMN cashback_used DECIMAL(10,2) DEFAULT 0 CHECK (cashback_used >= 0);
    END IF;
END $$;

-- Add coupon_code field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'coupon_code'
    ) THEN
        ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(50);
    END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_cashback_used ON orders(cashback_used) WHERE cashback_used > 0;
CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON orders(coupon_code) WHERE coupon_code IS NOT NULL;

-- Add comments to document the fields
COMMENT ON COLUMN orders.cashback_used IS 'Amount of cashback used on this order';
COMMENT ON COLUMN orders.coupon_code IS 'Coupon code applied to this order'; 