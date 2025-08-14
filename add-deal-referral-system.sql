-- Add Deal of the Day, Referral, and Cashback System Tables

-- Deal of the Day table
CREATE TABLE IF NOT EXISTS deal_of_the_day (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(start_date) -- Only one deal per day
);

-- User referral codes
CREATE TABLE IF NOT EXISTS user_referral_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    total_referrals INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User cashback balances
CREATE TABLE IF NOT EXISTS user_cashback_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0 CHECK (balance >= 0),
    total_earned DECIMAL(10,2) DEFAULT 0,
    total_used DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Cashback transactions
CREATE TABLE IF NOT EXISTS cashback_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earned', 'used', 'expired', 'referral_bonus')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    referral_code_used VARCHAR(20), -- If this was earned through a referral
    expires_at TIMESTAMP WITH TIME ZONE, -- Cashback expires after 1 year
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral relationships (who referred whom)
CREATE TABLE IF NOT EXISTS user_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) NOT NULL,
    first_order_completed BOOLEAN DEFAULT false,
    first_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    referrer_bonus_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referred_id) -- Each user can only be referred once
);

-- Add settings for deal of the day and referral system
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('enable_deal_of_the_day', 'true', 'boolean', 'Enable deal of the day feature', true),
('deal_of_the_day_discount', '15', 'number', 'Default discount percentage for deal of the day', false),
('enable_referral_system', 'true', 'boolean', 'Enable referral system', true),
('customer_cashback_percentage', '5', 'number', 'Cashback percentage for customer orders', false),
('referrer_bonus_percentage', '2.5', 'number', 'Bonus percentage for referrers', false),
('cashback_expiry_days', '365', 'number', 'Days until cashback expires', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes for performance (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_deal_of_the_day_date') THEN
        CREATE INDEX idx_deal_of_the_day_date ON deal_of_the_day(start_date, end_date);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_deal_of_the_day_active') THEN
        CREATE INDEX idx_deal_of_the_day_active ON deal_of_the_day(is_active);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_referral_codes_user_id') THEN
        CREATE INDEX idx_user_referral_codes_user_id ON user_referral_codes(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_referral_codes_code') THEN
        CREATE INDEX idx_user_referral_codes_code ON user_referral_codes(referral_code);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_cashback_balances_user_id') THEN
        CREATE INDEX idx_user_cashback_balances_user_id ON user_cashback_balances(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_cashback_transactions_user_id') THEN
        CREATE INDEX idx_cashback_transactions_user_id ON cashback_transactions(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_cashback_transactions_order_id') THEN
        CREATE INDEX idx_cashback_transactions_order_id ON cashback_transactions(order_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_cashback_transactions_expires_at') THEN
        CREATE INDEX idx_cashback_transactions_expires_at ON cashback_transactions(expires_at);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_referrals_referrer_id') THEN
        CREATE INDEX idx_user_referrals_referrer_id ON user_referrals(referrer_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_referrals_referred_id') THEN
        CREATE INDEX idx_user_referrals_referred_id ON user_referrals(referred_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_referrals_code') THEN
        CREATE INDEX idx_user_referrals_code ON user_referrals(referral_code);
    END IF;
END $$;

-- Create triggers for updated_at (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_deal_of_the_day_updated_at') THEN
        CREATE TRIGGER update_deal_of_the_day_updated_at BEFORE UPDATE ON deal_of_the_day
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_referral_codes_updated_at') THEN
        CREATE TRIGGER update_user_referral_codes_updated_at BEFORE UPDATE ON user_referral_codes
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_cashback_balances_updated_at') THEN
        CREATE TRIGGER update_user_cashback_balances_updated_at BEFORE UPDATE ON user_cashback_balances
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$; 