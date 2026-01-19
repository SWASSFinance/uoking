-- Add military status fields to users table for military cashback program
-- This allows users to indicate if they are a veteran or currently serving
--
-- NOTE: This migration should be run using the script:
--   node scripts/apply-military-status-migration.js
--
-- The script handles CREATE INDEX CONCURRENTLY properly (cannot be in a transaction)

-- Add is_veteran field (boolean, default false)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_veteran BOOLEAN DEFAULT false NOT NULL;

-- Add is_serving field (boolean, default false) 
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_serving BOOLEAN DEFAULT false NOT NULL;

-- Add index for efficient queries when distributing military cashback
-- NOTE: This must be run separately using CREATE INDEX CONCURRENTLY
-- The script handles this automatically
-- CREATE INDEX CONCURRENTLY idx_users_military_status 
-- ON users(id) 
-- WHERE is_veteran = true OR is_serving = true;

-- Add comment to document the purpose
COMMENT ON COLUMN users.is_veteran IS 'Indicates if user is a military veteran - eligible for military cashback program';
COMMENT ON COLUMN users.is_serving IS 'Indicates if user is currently serving in the military - eligible for military cashback program';
