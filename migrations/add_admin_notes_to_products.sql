-- Add admin_notes field to products table
-- This field allows admins to add internal notes about products for search and management purposes

ALTER TABLE products 
ADD COLUMN admin_notes TEXT;

-- Add index for better search performance on admin_notes
CREATE INDEX idx_products_admin_notes ON products USING gin(to_tsvector('english', admin_notes));

-- Add comment to document the field
COMMENT ON COLUMN products.admin_notes IS 'Internal admin notes for product management and search instructions';
