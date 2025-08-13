-- Manual Migration SQL Script
-- Run this directly in your Neon database console

-- First, let's check if our tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'transactions', 'transaction_categories');

-- Insert sample users (based on your SQL dump data)
INSERT INTO users (
  email, username, password_hash, first_name, last_name, 
  discord_username, main_shard, character_names, status, 
  email_verified, created_at, last_login_at
) VALUES 
(
  'jeremy.p.martell@gmail.com',
  'Jerm',
  '$2y$10$Wsfac6xqqRNQOj5oZClVh.X/uEARSgTjD1GDvE8qgqgdsmH9TZuki',
  'Jerm',
  'Martell',
  NULL,
  NULL,
  ARRAY[]::TEXT[],
  'active',
  true,
  '2018-03-14'::timestamp,
  '2018-03-14'::timestamp
),
(
  'petervesti@gmail.com',
  'Peter Vesti',
  '$2y$10$/.21VbLhnh0b.JpB7x7kqu7N6SI7ldJTNO7un3M4ENiq79ZliZHgu',
  'Peter Vesti',
  'Frendrup',
  '563072273544773632',
  NULL,
  ARRAY[]::TEXT[],
  'active',
  true,
  '2018-03-14'::timestamp,
  '2018-03-14'::timestamp
)
ON CONFLICT (email) DO NOTHING;

-- Check if users were inserted
SELECT id, email, username, first_name, last_name FROM users;

-- Insert sample transactions
INSERT INTO transactions (
  user_id, category_id, type, status, amount_usd, currency,
  payment_method, shard, character_name, delivery_location,
  items, payment_provider_id, internal_reference,
  delivery_status, customer_notes, staff_notes, created_at
) VALUES
(
  (SELECT id FROM users WHERE email = 'jeremy.p.martell@gmail.com' LIMIT 1),
  2, -- items category
  'purchase',
  'completed',
  49.99,
  'USD',
  'other',
  'Atlantic',
  'wew',
  NULL,
  '{"items": [{"name": "UO Items", "character": "wew", "quantity": 1}]}'::jsonb,
  '7',
  '7',
  'delivered',
  NULL,
  NULL,
  '2018-03-27 17:47:44'::timestamp
),
(
  NULL, -- anonymous order
  2, -- items category  
  'purchase',
  'completed',
  25.99,
  'USD',
  'paypal',
  'Atlantic', 
  'Skull',
  NULL,
  '{"items": [{"name": "UO Items", "character": "Skull", "quantity": 1}]}'::jsonb,
  '401',
  '401',
  'delivered',
  NULL,
  NULL,
  '2020-01-24 01:28:46'::timestamp
);

-- Check if transactions were inserted
SELECT 
  t.id,
  u.email as user_email,
  t.amount_usd,
  t.shard,
  t.character_name,
  t.created_at
FROM transactions t
LEFT JOIN users u ON t.user_id = u.id
ORDER BY t.created_at;

-- Summary
SELECT 
  'Users' as table_name, 
  COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 
  'Transactions' as table_name, 
  COUNT(*) as record_count 
FROM transactions; 