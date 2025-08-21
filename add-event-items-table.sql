-- Event Items table for storing Atlantic event rares and other event items
CREATE TABLE event_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic item information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    
    -- Event and season information
    season_number INTEGER,
    season_name VARCHAR(100),
    event_year INTEGER,
    event_type VARCHAR(100), -- 'Atlantic Event Rares', 'Holiday Event', etc.
    
    -- Shard information
    shard VARCHAR(50) NOT NULL DEFAULT 'Atlantic',
    
    -- Image information
    original_image_url VARCHAR(500), -- Original URL from wiki.stratics.com
    cloudinary_url VARCHAR(500), -- Uploaded to Cloudinary
    cloudinary_public_id VARCHAR(255), -- Cloudinary public ID for management
    
    -- Item details
    item_type VARCHAR(100), -- 'Mask', 'Plant', 'Bear', etc.
    hue_number INTEGER, -- If applicable
    graphic_number INTEGER, -- If applicable
    
    -- Status and metadata
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    rarity_level VARCHAR(20) DEFAULT 'rare', -- 'common', 'uncommon', 'rare', 'legendary'
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_event_items_season ON event_items(season_number);
CREATE INDEX idx_event_items_shard ON event_items(shard);
CREATE INDEX idx_event_items_status ON event_items(status);
CREATE INDEX idx_event_items_slug ON event_items(slug);
CREATE INDEX idx_event_items_year ON event_items(event_year);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_event_items_updated_at
    BEFORE UPDATE ON event_items
    FOR EACH ROW
    EXECUTE FUNCTION update_event_items_updated_at();
