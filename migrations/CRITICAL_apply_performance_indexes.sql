-- CRITICAL DATABASE PERFORMANCE INDEXES
-- Apply these indexes IMMEDIATELY to reduce compute usage
-- These will create indexes WITHOUT locking your tables (CONCURRENTLY)

-- NOTE: Run this on your Neon DB to dramatically improve performance!

-- ========================================
-- MOST CRITICAL INDEXES (Apply First)
-- ========================================

-- Users table - heavily queried by email
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status ON users(status);

-- Order items - queried in every order operation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Orders - user lookups and payment status checks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Product reviews - aggregated on every product page
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_reviews_product_status ON product_reviews(product_id, status) WHERE status = 'approved';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);

-- Product categories junction table - used in product filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_categories_category_id ON product_categories(category_id);

-- Product classes junction table - used in product filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_classes_product_id ON product_classes(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_classes_class_id ON product_classes(class_id);

-- ========================================
-- IMPORTANT INDEXES
-- ========================================

-- Products table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_slug ON products(slug) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_status_rank ON products(status, rank) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured ON products(featured) WHERE status = 'active' AND featured = true;

-- Categories
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_slug ON categories(slug) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- User points - frequently accessed
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);

-- User profiles - joined with users
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- ========================================
-- PERFORMANCE INDEXES
-- ========================================

-- Daily check-ins
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_checkins_user_date ON user_daily_checkins(user_id, checkin_date);

-- Deal of the day
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deal_of_the_day_product_date ON deal_of_the_day(product_id, start_date) WHERE is_active = true;

-- Coupons
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coupons_code_active ON coupons(code) WHERE is_active = true;

-- Site settings - frequently queried
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

-- Classes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_classes_slug ON classes(slug) WHERE is_active = true;

-- Skills
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_skills_slug ON skills(slug) WHERE is_active = true;

-- Trading posts
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trading_posts_status ON trading_posts(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trading_posts_user_id ON trading_posts(user_id);

-- ========================================
-- ANALYZE TABLES
-- ========================================
-- Update query planner statistics for better query plans

ANALYZE users;
ANALYZE user_profiles;
ANALYZE user_points;
ANALYZE orders;
ANALYZE order_items;
ANALYZE products;
ANALYZE product_categories;
ANALYZE product_classes;
ANALYZE product_reviews;
ANALYZE categories;
ANALYZE classes;
ANALYZE coupons;
ANALYZE site_settings;

-- ========================================
-- VERIFY INDEXES
-- ========================================
-- Run this query to verify indexes were created:
/*
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
*/

