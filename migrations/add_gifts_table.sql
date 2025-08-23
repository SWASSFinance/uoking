-- Add gifts table
CREATE TABLE gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price_threshold DECIMAL(10,2) NOT NULL CHECK (price_threshold > 0),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add gift_id column to orders table
ALTER TABLE orders ADD COLUMN gift_id UUID REFERENCES gifts(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX idx_gifts_price_threshold ON gifts(price_threshold);
CREATE INDEX idx_gifts_active ON gifts(is_active) WHERE is_active = true;
CREATE INDEX idx_orders_gift_id ON orders(gift_id);

-- Insert some sample gifts
INSERT INTO gifts (name, description, price_threshold, sort_order) VALUES
('Small Token', 'A small token of appreciation', 25.00, 1),
('Medium Gift', 'A nice gift for loyal customers', 50.00, 2),
('Premium Gift', 'A premium gift for big spenders', 100.00, 3),
('VIP Gift', 'An exclusive VIP gift', 200.00, 4);
