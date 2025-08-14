-- Add rank field to products table for custom ordering
ALTER TABLE products ADD COLUMN rank INTEGER DEFAULT 0;

-- Create index for efficient sorting by rank
CREATE INDEX idx_products_rank ON products(rank ASC, name ASC) WHERE status = 'active';

-- Update existing products to have default rank values
UPDATE products SET rank = 0 WHERE rank IS NULL;

-- Add comment to document the field
COMMENT ON COLUMN products.rank IS 'Custom ordering rank for products. Lower numbers appear first. Falls back to alphabetical by name if ranks are equal.'; 