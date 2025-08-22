-- Enhanced Database Schema for UO King - Optimized for Performance
-- Includes old system data migration and query optimization

-- Enable UUID extension for better primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - Core user data only (frequently accessed)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legacy_user_id INTEGER UNIQUE, -- For migration mapping
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Essential profile data
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    main_shard VARCHAR(50),
    character_names TEXT[],
    
    -- Account status (frequently queried)
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    email_verified BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    
    -- Performance-critical timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- User profiles - Extended user data (less frequently accessed)
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    -- Contact information
    phone VARCHAR(20),
    date_of_birth DATE,
    
    -- Address information
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'United States',
    
    -- Gaming preferences
    discord_username VARCHAR(50),
    timezone VARCHAR(50),
    preferred_delivery_method VARCHAR(50),
    
    -- Verification and security
    verification_key VARCHAR(100),
    last_ip_address INET,
    ip_whitelist INET[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User points system (optimized for leaderboards and frequent updates)
CREATE TABLE user_points (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    -- Points tracking
    current_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    points_spent INTEGER DEFAULT 0,
    
    -- Referral system
    referral_cash DECIMAL(10,2) DEFAULT 0,
    referred_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    referral_count INTEGER DEFAULT 0,
    
    -- Lottery/spin system
    last_spin_date DATE,
    spin_code VARCHAR(50),
    spin_number INTEGER DEFAULT 0,
    last_prize VARCHAR(255),
    
    -- Metadata for analytics
    first_purchase_date TIMESTAMP WITH TIME ZONE,
    total_spent DECIMAL(12,2) DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral tracking (separate table for better referral queries)
CREATE TABLE user_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) UNIQUE,
    
    -- Reward tracking
    reward_amount DECIMAL(10,2) DEFAULT 0,
    reward_type VARCHAR(20) DEFAULT 'cash' CHECK (reward_type IN ('cash', 'points', 'discount')),
    reward_status VARCHAR(20) DEFAULT 'pending' CHECK (reward_status IN ('pending', 'earned', 'paid')),
    
    -- Analytics
    first_purchase_amount DECIMAL(10,2),
    first_purchase_date TIMESTAMP WITH TIME ZONE,
    total_referred_value DECIMAL(12,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referrer_id, referred_id)
);

-- Categories (enhanced with analytics)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- SEO optimization
    meta_title VARCHAR(200),
    meta_description TEXT,
    
    -- Analytics fields
    product_count INTEGER DEFAULT 0,
    total_sales DECIMAL(12,2) DEFAULT 0,
    last_sale_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UO Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    primary_stats TEXT[],
    skills TEXT[],
    playstyle TEXT,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT true,
    
    -- Analytics
    product_count INTEGER DEFAULT 0,
    popularity_score INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facets and Maps
CREATE TABLE facets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    expansion VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE maps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facet_id UUID NOT NULL REFERENCES facets(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    coordinates_x INTEGER,
    coordinates_y INTEGER,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(facet_id, slug)
);

-- Products (enhanced with performance fields)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    sale_price DECIMAL(10,2) CHECK (sale_price >= 0),
    cost DECIMAL(10,2) CHECK (cost >= 0),
    
    -- Organization
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    
    -- Product type and availability
    type VARCHAR(50) DEFAULT 'item' CHECK (type IN ('item', 'service', 'account', 'gold', 'house')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'archived')),
    stock_quantity INTEGER DEFAULT 0,
    track_quantity BOOLEAN DEFAULT true,
    
    -- Game-specific data
    item_type VARCHAR(100),
    slot_type VARCHAR(50),
    available_shards TEXT[],
    spawn_location VARCHAR(200),
    drop_rate VARCHAR(50),
    requirements JSONB,
    stats JSONB,
    properties JSONB,
    
    -- Media
    image_url VARCHAR(500),
    gallery_images TEXT[],
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    
    -- Features and performance metrics
    featured BOOLEAN DEFAULT false,
    is_digital BOOLEAN DEFAULT true,
    requires_character_name BOOLEAN DEFAULT true,
    requires_shard BOOLEAN DEFAULT true,
    
    -- Analytics and performance (denormalized for speed)
    view_count INTEGER DEFAULT 0,
    sale_count INTEGER DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    last_sold_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product reviews
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    content TEXT,
    verified_purchase BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- Orders (enhanced with analytics)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Order status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed')),
    
    -- Financial data
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    points_used INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Payment information
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_provider_id VARCHAR(255),
    
    -- Game delivery information
    delivery_shard VARCHAR(50),
    delivery_character VARCHAR(100),
    delivery_location TEXT,
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'in_progress', 'delivered', 'failed')),
    delivered_at TIMESTAMP WITH TIME ZONE,
    delivered_by VARCHAR(100),
    
    -- Order notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Analytics
    acquisition_source VARCHAR(100),
    user_ip INET,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    
    -- Item details at time of purchase
    product_name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    
    -- Product snapshot
    product_snapshot JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Organization
    category VARCHAR(50),
    tags TEXT[],
    
    -- Status and visibility
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    
    -- Media
    featured_image_url VARCHAR(500),
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    
    -- Scheduling
    published_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping cart
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    
    -- Game-specific selections
    selected_shard VARCHAR(50),
    selected_character VARCHAR(100),
    custom_options JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Coupons
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Discount details
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
    value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
    
    -- Usage limits
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    usage_limit_per_user INTEGER,
    
    -- Conditions
    minimum_amount DECIMAL(10,2) DEFAULT 0,
    applicable_categories UUID[],
    applicable_products UUID[],
    
    -- Validity
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PERFORMANCE INDEXES --

-- Users table - High frequency queries
CREATE INDEX idx_users_email_verified ON users(email_verified) WHERE email_verified = true;
CREATE INDEX idx_users_status_active ON users(status) WHERE status = 'active';
CREATE INDEX idx_users_created_at_desc ON users(created_at DESC);
CREATE INDEX idx_users_last_login ON users(last_login_at DESC) WHERE last_login_at IS NOT NULL;
CREATE INDEX idx_users_legacy_id ON users(legacy_user_id) WHERE legacy_user_id IS NOT NULL;

-- User profiles - Contact and location queries
CREATE INDEX idx_user_profiles_discord ON user_profiles(discord_username) WHERE discord_username IS NOT NULL;
CREATE INDEX idx_user_profiles_country ON user_profiles(country);
CREATE INDEX idx_user_profiles_state ON user_profiles(state) WHERE state IS NOT NULL;

-- User points - Leaderboards and referral queries
CREATE INDEX idx_user_points_current_desc ON user_points(current_points DESC);
CREATE INDEX idx_user_points_lifetime_desc ON user_points(lifetime_points DESC);
CREATE INDEX idx_user_points_referrer ON user_points(referred_by_user_id) WHERE referred_by_user_id IS NOT NULL;
CREATE INDEX idx_user_points_last_spin ON user_points(last_spin_date DESC) WHERE last_spin_date IS NOT NULL;

-- Referrals - Analytics queries
CREATE INDEX idx_user_referrals_referrer_status ON user_referrals(referrer_id, reward_status);
CREATE INDEX idx_user_referrals_code ON user_referrals(referral_code) WHERE referral_code IS NOT NULL;
CREATE INDEX idx_user_referrals_earned ON user_referrals(reward_status, first_purchase_date) WHERE reward_status = 'earned';

-- Products - E-commerce queries
CREATE INDEX idx_products_active_featured ON products(featured DESC, created_at DESC) WHERE status = 'active';
CREATE INDEX idx_products_category_active ON products(category_id, status, featured DESC);
CREATE INDEX idx_products_class_active ON products(class_id, status, featured DESC);
CREATE INDEX idx_products_price_range ON products(price) WHERE status = 'active';
CREATE INDEX idx_products_type_status ON products(type, status);
CREATE INDEX idx_products_revenue_desc ON products(revenue DESC) WHERE status = 'active';
CREATE INDEX idx_products_popularity ON products(sale_count DESC, avg_rating DESC) WHERE status = 'active';
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Orders - Financial and analytics queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);
CREATE INDEX idx_orders_payment_status ON orders(payment_status, created_at DESC);
CREATE INDEX idx_orders_completed ON orders(created_at DESC) WHERE status = 'completed';
CREATE INDEX idx_orders_total_amount ON orders(total_amount DESC) WHERE status = 'completed';

-- Reviews - Product and user queries
CREATE INDEX idx_product_reviews_product_approved ON product_reviews(product_id, status, created_at DESC);
CREATE INDEX idx_product_reviews_user_recent ON product_reviews(user_id, created_at DESC);
CREATE INDEX idx_product_reviews_rating_approved ON product_reviews(rating, created_at DESC) WHERE status = 'approved';

-- News - Publishing queries
CREATE INDEX idx_news_published ON news(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_news_featured_published ON news(featured DESC, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_news_category_published ON news(category, published_at DESC) WHERE status = 'published';

-- Sessions - Security queries  
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_user_active ON user_sessions(user_id, expires_at);

-- FUNCTIONS AND TRIGGERS --

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update product analytics function
CREATE OR REPLACE FUNCTION update_product_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update review count and average rating
    UPDATE products 
    SET 
        review_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id AND status = 'approved'),
        avg_rating = (SELECT COALESCE(AVG(rating::decimal), 0) FROM product_reviews WHERE product_id = NEW.product_id AND status = 'approved')
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update category analytics function
CREATE OR REPLACE FUNCTION update_category_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product count using product_categories junction table
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE categories 
        SET product_count = (SELECT COUNT(*) FROM product_categories WHERE category_id = NEW.category_id)
        WHERE id = NEW.category_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        UPDATE categories 
        SET product_count = (SELECT COUNT(*) FROM product_categories WHERE category_id = OLD.category_id)
        WHERE id = OLD.category_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_referrals_updated_at BEFORE UPDATE ON user_referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Analytics triggers
CREATE TRIGGER product_review_analytics AFTER INSERT OR UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_analytics();

CREATE TRIGGER product_category_analytics AFTER INSERT OR UPDATE OR DELETE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_category_analytics(); 