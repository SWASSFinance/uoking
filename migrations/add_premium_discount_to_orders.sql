-- Add premium_discount column to orders table
ALTER TABLE orders 
ADD COLUMN premium_discount DECIMAL(10,2) DEFAULT 0.00;

-- Add comment to explain the field
COMMENT ON COLUMN orders.premium_discount IS 'Discount amount applied for premium users';
