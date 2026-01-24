# Database Performance Scripts

## Overview

These scripts help you optimize and monitor your Neon database performance.

## Scripts

### 1. apply-performance-indexes.js

Applies critical performance indexes to your database.

**Usage:**
```bash
# Make sure POSTGRES_URL is set in your environment
node scripts/apply-performance-indexes.js
```

**What it does:**
- Creates indexes on frequently queried columns
- Uses `CREATE INDEX CONCURRENTLY` to avoid locking tables
- Verifies indexes were created successfully
- Safe to run multiple times (uses IF NOT EXISTS)

**Expected runtime:** 2-5 minutes depending on table sizes

### 2. apply-payer-email-migration.js

Adds `payer_email` column to the `orders` table to store PayPal payer email addresses.

**Usage:**
```bash
# Make sure POSTGRES_URL is set in your environment
node scripts/apply-payer-email-migration.js
```

**What it does:**
- Adds `payer_email` column to `orders` table
- Creates an index on `payer_email` for faster lookups
- Verifies the migration was successful
- Shows statistics on how many orders have payer_email populated

**Why it's needed:**
PayPal IPN includes `payer_email` which is the email address of the person who actually paid. This may differ from the user's account email if they paid with a different PayPal account. Storing this allows us to:
- Import the correct payment email to Mailchimp
- Sync with the actual payer's email address
- Maintain better email list quality

**Expected runtime:** 5-10 seconds

**Safe to run multiple times:** Yes (uses IF NOT EXISTS)

### 3. apply-military-status-migration.js

Applies migration to add military status fields (is_veteran, is_serving) to users table.

**Usage:**
```bash
# Make sure POSTGRES_URL is set in your environment
node scripts/apply-military-status-migration.js
```

**What it does:**
- Adds `is_veteran` column (boolean, default false)
- Adds `is_serving` column (boolean, default false)
- Creates index for efficient veteran queries
- Adds column comments
- Verifies migration was successful
- Shows current statistics

**Expected runtime:** 10-30 seconds

**Safe to run multiple times:** Yes (uses IF NOT EXISTS)

### 4. check-db-performance.js

Checks database performance metrics and identifies issues.

**Usage:**
```bash
node scripts/check-db-performance.js
```

**What it checks:**
- Active database connections
- Table sizes
- Missing indexes on foreign keys
- Slow queries (if pg_stat_statements enabled)
- Table statistics freshness

**Expected runtime:** 10-30 seconds

## Quick Start

1. **Apply indexes (CRITICAL - Do this first!):**
   ```bash
   node scripts/apply-performance-indexes.js
   ```

2. **Apply payer email migration (recommended for Mailchimp sync):**
   ```bash
   node scripts/apply-payer-email-migration.js
   ```

3. **Apply military status migration (if needed):**
   ```bash
   node scripts/apply-military-status-migration.js
   ```

4. **Monitor performance:**
   ```bash
   node scripts/check-db-performance.js
   ```

4. **Check Neon dashboard:**
   - Log into your Neon dashboard
   - Monitor CPU usage - should drop from 100% to 15-30%
   - Check query performance improvements

## Troubleshooting

### "POSTGRES_URL environment variable not set"
- Add to your `.env.local`: `POSTGRES_URL=postgres://...`
- Or export it: `export POSTGRES_URL="postgres://..."`

### "already exists" errors
- This is normal! The migration uses IF NOT EXISTS
- The script will skip existing indexes safely

### Permission errors
- Ensure your database user has CREATE INDEX permissions
- Check your Neon project role settings

## Expected Results

After applying indexes, you should see:

- ✅ 70-90% reduction in query execution time
- ✅ 70-85% reduction in database CPU usage
- ✅ Faster page loads (especially product pages)
- ✅ Lower Neon compute usage

## Need Help?

See `DATABASE_PERFORMANCE_AUDIT.md` for detailed information about all optimizations.

