-- Add settings table for site configuration
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'boolean', 'number', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_email', 'admin@uoking.com', 'string', 'Primary contact email for the site', true),
('support_phone', '', 'string', 'Support phone number', true),
('contact_address', '', 'string', 'Business contact address', true),
('paypal_email', '', 'string', 'PayPal payment email', false),
('stripe_public_key', '', 'string', 'Stripe public key for payments', false),
('stripe_secret_key', '', 'string', 'Stripe secret key for payments', false),
('site_title', 'UOKing - Premium Ultima Online Items & Gold', 'string', 'Site title for SEO', true),
('site_description', 'Your trusted source for premium Ultima Online items, gold, and services. Fast delivery, competitive prices, and 24/7 support.', 'string', 'Site description for SEO', true),
('site_keywords', 'Ultima Online, UO, gold, items, equipment, scrolls, suits, gaming', 'string', 'Site keywords for SEO', true),
('facebook_url', '', 'string', 'Facebook page URL', true),
('twitter_url', '', 'string', 'Twitter page URL', true),
('discord_url', '', 'string', 'Discord server URL', true),
('business_name', 'UOKing', 'string', 'Business name', true),
('business_hours', '24/7', 'string', 'Business operating hours', true),
('timezone', 'UTC', 'string', 'Site timezone', true),
('enable_reviews', 'true', 'boolean', 'Enable product reviews feature', true),
('enable_newsletter', 'true', 'boolean', 'Enable newsletter subscription', true),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Create index for performance
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_site_settings_public ON site_settings(is_public); 