-- Add unique constraint to email field to prevent duplicate users
-- This ensures that each email address can only be associated with one user account

-- First, let's check if there are any duplicate emails
-- If there are, we need to handle them before adding the constraint

-- Check for duplicate emails
SELECT email, COUNT(*) as count
FROM users 
WHERE email IS NOT NULL
GROUP BY email 
HAVING COUNT(*) > 1;

-- If duplicates exist, we need to keep only the most recent user for each email
-- This query will help identify which users to keep (most recent) and which to remove
WITH duplicate_emails AS (
  SELECT email, COUNT(*) as count
  FROM users 
  WHERE email IS NOT NULL
  GROUP BY email 
  HAVING COUNT(*) > 1
),
users_to_keep AS (
  SELECT DISTINCT ON (u.email) u.id, u.email, u.created_at
  FROM users u
  INNER JOIN duplicate_emails de ON u.email = de.email
  ORDER BY u.email, u.created_at DESC
),
users_to_remove AS (
  SELECT u.id, u.email, u.created_at
  FROM users u
  INNER JOIN duplicate_emails de ON u.email = de.email
  WHERE u.id NOT IN (SELECT id FROM users_to_keep)
)
-- This will show which users would be removed (for review)
SELECT 'Users to remove:' as action, id, email, created_at FROM users_to_remove
UNION ALL
SELECT 'Users to keep:' as action, id, email, created_at FROM users_to_keep
ORDER BY email, action;

-- Uncomment the following lines to actually remove duplicate users
-- (Only do this after reviewing the above query results)
/*
-- Remove duplicate users (keep only the most recent)
DELETE FROM users 
WHERE id IN (
  SELECT u.id
  FROM users u
  INNER JOIN (
    SELECT email, COUNT(*) as count
    FROM users 
    WHERE email IS NOT NULL
    GROUP BY email 
    HAVING COUNT(*) > 1
  ) duplicate_emails ON u.email = duplicate_emails.email
  WHERE u.id NOT IN (
    SELECT DISTINCT ON (u2.email) u2.id
    FROM users u2
    INNER JOIN (
      SELECT email, COUNT(*) as count
      FROM users 
      WHERE email IS NOT NULL
      GROUP BY email 
      HAVING COUNT(*) > 1
    ) duplicate_emails2 ON u2.email = duplicate_emails2.email
    ORDER BY u2.email, u2.created_at DESC
  )
);
*/

-- Add unique constraint to email field
-- This will prevent future duplicate emails
ALTER TABLE users ADD CONSTRAINT unique_user_email UNIQUE (email);

-- Add index for better performance on email lookups (if not already exists)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_unique ON users(email) WHERE email IS NOT NULL;
