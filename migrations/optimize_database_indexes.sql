-- Database optimization indexes for better performance
-- Run these to improve query performance and reduce CPU usage

-- Product-related indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_slug ON products(slug) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured ON products(featured) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_status_rank ON products(status, rank) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Category indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_slug ON categories(slug) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Product-Category junction table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_categories_category_id ON product_categories(category_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_categories_primary ON product_categories(product_id, is_primary) WHERE is_primary = true;

-- Product reviews indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id) WHERE status = 'approved';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_reviews_user_product ON product_reviews(user_id, product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_reviews_status ON product_reviews(status);

-- User-related indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_account_rank ON users(account_rank);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);

-- Order-related indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Deal of the day indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deal_of_the_day_date ON deal_of_the_day(start_date, is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deal_of_the_day_product ON deal_of_the_day(product_id, start_date);

-- Skills indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_skills_slug ON skills(slug) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_skills_category ON skills(category) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_skills_active_sort ON skills(is_active, sort_order);

-- Trading posts indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trading_posts_status ON trading_posts(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trading_posts_user_id ON trading_posts(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trading_posts_created_at ON trading_posts(created_at);

-- Event items indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_items_season ON event_items(season_number);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_items_shard ON event_items(shard);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_items_type ON event_items(item_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_items_status ON event_items(status);

-- Contest winners indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contest_winners_period ON contest_winners(contest_period);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contest_winners_user_id ON contest_winners(user_id);

-- Daily check-ins indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_checkins_user_date ON user_daily_checkins(user_id, checkin_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_checkins_date ON user_daily_checkins(checkin_date);

-- Plots and maps indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_plots_map_id ON plots(map_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_plots_owner_id ON plots(owner_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_plots_available ON plots(is_available);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_maps_active ON maps(is_active);

-- Spawn location submissions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_spawn_submissions_user_id ON spawn_location_submissions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_spawn_submissions_status ON spawn_location_submissions(status);

-- Banner indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_banners_position ON banners(position, is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_banners_active_sort ON banners(is_active, sort_order);

-- Shard indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shards_active ON shards(is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shards_sort ON shards(sort_order);

-- User referral indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_referrals_referrer ON user_referrals(referrer_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_referrals_referred ON user_referrals(referred_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_referral_codes_user ON user_referral_codes(user_id, is_active);

-- Category reviews indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_category_reviews_category ON category_reviews(category_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_category_reviews_user ON category_reviews(user_id, status);

-- Product image submissions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_image_submissions_product ON product_image_submissions(product_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_image_submissions_user ON product_image_submissions(user_id, status);

-- Analyze tables after creating indexes
ANALYZE products;
ANALYZE categories;
ANALYZE product_categories;
ANALYZE product_reviews;
ANALYZE users;
ANALYZE orders;
ANALYZE order_items;
ANALYZE skills;
ANALYZE trading_posts;
ANALYZE event_items;
ANALYZE contest_winners;
ANALYZE user_daily_checkins;
ANALYZE plots;
ANALYZE maps;
ANALYZE spawn_location_submissions;
ANALYZE banners;
ANALYZE shards;
ANALYZE user_referrals;
ANALYZE category_reviews;
ANALYZE product_image_submissions;
