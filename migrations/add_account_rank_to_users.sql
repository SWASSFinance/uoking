-- Add account_rank field to users table
-- This field tracks if a user has upgraded their account (1 = premium, 0 = standard)

ALTER TABLE users 
ADD COLUMN account_rank INTEGER DEFAULT 0 NOT NULL;

-- Add comment to explain the field
COMMENT ON COLUMN users.account_rank IS 'Account upgrade status: 0 = standard account, 1 = premium upgraded account';

-- Create index for faster queries on account rank
CREATE INDEX idx_users_account_rank ON users(account_rank);
