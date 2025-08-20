-- Migration: Add spawn_location_submissions table
-- Date: 2024-01-XX

-- Spawn location submissions table
CREATE TABLE IF NOT EXISTS spawn_location_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    spawn_location VARCHAR(500) NOT NULL,
    description TEXT,
    coordinates VARCHAR(100),
    shard VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    review_notes TEXT,
    points_awarded INTEGER DEFAULT 0,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- Create indexes for spawn location submissions
CREATE INDEX IF NOT EXISTS idx_spawn_location_submissions_product_id ON spawn_location_submissions(product_id);
CREATE INDEX IF NOT EXISTS idx_spawn_location_submissions_user_id ON spawn_location_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_spawn_location_submissions_status ON spawn_location_submissions(status);
CREATE INDEX IF NOT EXISTS idx_spawn_location_submissions_created_at ON spawn_location_submissions(created_at);

-- Create trigger for spawn location submissions updated_at
CREATE TRIGGER update_spawn_location_submissions_updated_at 
    BEFORE UPDATE ON spawn_location_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
