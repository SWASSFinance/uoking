-- Add trading board table for WTS (Want To Sell) posts
-- Only users who own plots can create posts, but anyone can view them

CREATE TABLE IF NOT EXISTS trading_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  shard VARCHAR(100),
  character_name VARCHAR(100),
  contact_info TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'cancelled')),
  is_plot_owner_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trading_posts_user_id ON trading_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_posts_status ON trading_posts(status);
CREATE INDEX IF NOT EXISTS idx_trading_posts_created_at ON trading_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trading_posts_item_name ON trading_posts(item_name);
CREATE INDEX IF NOT EXISTS idx_trading_posts_shard ON trading_posts(shard);

-- Add comments to document the table
COMMENT ON TABLE trading_posts IS 'Trading board posts for WTS (Want To Sell) items. Only plot owners can create posts.';
COMMENT ON COLUMN trading_posts.is_plot_owner_verified IS 'Indicates if the user was verified as a plot owner when creating the post';
COMMENT ON COLUMN trading_posts.status IS 'Post status: active, sold, expired, or cancelled';
