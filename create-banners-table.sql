-- Create banners table for homepage and other banner management
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  video_url TEXT,
  image_url TEXT,
  button_text VARCHAR(100),
  button_url VARCHAR(255),
  position VARCHAR(50) DEFAULT 'homepage',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_banners_sort_order ON banners(sort_order ASC, created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE banners IS 'Banner management for homepage and other promotional content';
COMMENT ON COLUMN banners.position IS 'Where the banner should be displayed: homepage, category, product, etc.';
COMMENT ON COLUMN banners.video_url IS 'URL to video file (Cloudinary or external)';
COMMENT ON COLUMN banners.image_url IS 'Fallback image URL if video fails to load';
COMMENT ON COLUMN banners.sort_order IS 'Display order - lower numbers appear first'; 