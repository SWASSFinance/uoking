-- Add custom_details column to order_items table
-- This column will store JSON data for custom items like account builder details

ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS custom_details TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN order_items.custom_details IS 'JSON data for custom items like account builder configurations';




