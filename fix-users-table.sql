-- Fix users table to add missing columns
-- This adds the discord_username column that was missing

-- Add discord_username column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'discord_username') THEN
        ALTER TABLE users ADD COLUMN discord_username VARCHAR(50);
    END IF;
END $$;

-- Add any other missing columns that might be needed
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'main_shard') THEN
        ALTER TABLE users ADD COLUMN main_shard VARCHAR(50);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'character_names') THEN
        ALTER TABLE users ADD COLUMN character_names TEXT[];
    END IF;
END $$;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position; 