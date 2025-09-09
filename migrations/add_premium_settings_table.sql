-- Create premium settings table
CREATE TABLE premium_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default premium settings
INSERT INTO premium_settings (setting_key, setting_value, description) VALUES
('premium_discount_percentage', '10', 'Default discount percentage for premium users on all orders'),
('deal_of_day_regular_discount', '15', 'Discount percentage for regular users on deal of the day'),
('deal_of_day_premium_discount', '25', 'Discount percentage for premium users on deal of the day'),
('contest_prize_amount', '50', 'Cashback prize amount for contest winners'),
('contest_winners_count', '2', 'Number of premium users to select as winners each contest'),
('contest_enabled', 'true', 'Whether the bi-weekly contest is enabled');

-- Create contest winners table
CREATE TABLE contest_winners (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contest_period VARCHAR(20) NOT NULL, -- Format: YYYY-WW (e.g., 2024-01)
  prize_amount DECIMAL(10,2) NOT NULL,
  awarded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for contest period lookups
CREATE INDEX idx_contest_winners_period ON contest_winners(contest_period);
CREATE INDEX idx_contest_winners_user_id ON contest_winners(user_id);

-- Add comment to explain the tables
COMMENT ON TABLE premium_settings IS 'Configuration settings for premium user features';
COMMENT ON TABLE contest_winners IS 'History of bi-weekly contest winners';
