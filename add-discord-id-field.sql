-- Add discord_id field to users table
-- This stores the actual Discord user ID (numeric) for proper Discord integration

-- Add discord_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'discord_id'
    ) THEN
        ALTER TABLE users ADD COLUMN discord_id VARCHAR(50);
    END IF;
END $$;

-- Add index for discord_id lookups
CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id) WHERE discord_id IS NOT NULL;

-- Add comment to document the field
COMMENT ON COLUMN users.discord_id IS 'Discord user ID (numeric) for Discord OAuth integration'; 