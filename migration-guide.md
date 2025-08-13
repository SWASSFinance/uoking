# Database Migration Guide 🚀

## Overview
This guide will help you migrate from your old, messy database to a clean, modern schema on Neon PostgreSQL.

## What You Get
- **Clean Schema**: Proper normalization, constraints, and indexes
- **Security**: Bcrypt password hashing, UUID primary keys
- **Performance**: Optimized indexes and data types
- **Scalability**: JSONB for flexible data, proper foreign keys
- **Audit Trail**: Change tracking and session management

---

## Step 1: Analyze Your Current Database

First, let's understand your old database structure:

```bash
# Run the analysis script
node analyze-old-db.js
```

This will give you SQL queries to run against your old database. You need to:

1. **Connect to your old database** (MySQL, PostgreSQL, SQLite, etc.)
2. **Run the "SHOW TABLES" query** to see all tables
3. **For each table**, run the "DESCRIBE" query to see columns
4. **Get sample data** to understand the format
5. **Check data volume** to plan migration timing

### Document Your Schema
Create a document like this:
```
Old Database Analysis:
- Database Type: MySQL/PostgreSQL/SQLite
- Total Users: ~1,500
- Total Transactions: ~3,200
- Tables: users, orders, transactions, payments
- Issues: Plain text passwords, no foreign keys, duplicate data
```

---

## Step 2: Set Up New Database Schema

1. **Install dependencies**:
```bash
npm install pg bcryptjs dotenv
```

2. **Create your .env file** (already done):
```env
POSTGRES_URL=postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

3. **Run the setup script**:
```bash
node setup-database.js
```

This creates all the new tables with proper structure.

---

## Step 3: Prepare Migration Data

Update the `migrate.js` file with your old database connection details:

```javascript
// In migrate.js, update the oldDb config:
oldDb: {
  mysql: {
    host: 'your-old-host',
    user: 'your-old-username', 
    password: 'your-old-password',
    database: 'your-old-database'
  }
}
```

### Field Mapping
You'll need to map your old fields to new ones. Update the `cleanUserData` method:

```javascript
// Example mapping for users:
email: oldUser.email || oldUser.user_email || oldUser.mail,
username: oldUser.username || oldUser.user_name || oldUser.login,
first_name: oldUser.first_name || oldUser.fname,
// Add your specific field mappings
```

---

## Step 4: Test Migration (Small Batch)

Before migrating everything, test with a small batch:

1. **Export 10-20 users** from your old database
2. **Export their transactions**
3. **Update migrate.js** with test data
4. **Run migration**:
```bash
node migrate.js
```

5. **Verify results** in your Neon database

---

## Step 5: Full Migration

Once testing looks good:

1. **Export all data** from old database
2. **Run full migration**
3. **Verify data integrity**
4. **Update your application** to use new schema

---

## Common Migration Scenarios

### Scenario 1: MySQL to PostgreSQL
```javascript
// Add MySQL connection in migrate.js
const mysql = require('mysql2/promise');
const connection = await mysql.createConnection(config.oldDb.mysql);
const [users] = await connection.execute('SELECT * FROM users');
```

### Scenario 2: SQLite to PostgreSQL
```javascript
// Add SQLite connection
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const db = await open({ filename: './old-database.db', driver: sqlite3.Database });
const users = await db.all('SELECT * FROM users');
```

### Scenario 3: CSV/JSON Export
```javascript
// If you exported to CSV/JSON files
const fs = require('fs');
const users = JSON.parse(fs.readFileSync('./exported-users.json', 'utf8'));
```

---

## Data Mapping Examples

### Users Table Mapping
```javascript
// Old -> New
{
  user_id: 123,           // -> UUID (auto-generated)
  email: "user@mail.com", // -> email
  username: "player1",    // -> username  
  password: "plaintext",  // -> password_hash (bcrypt)
  fname: "John",          // -> first_name
  lname: "Doe",          // -> last_name
  discord: "johndoe#123", // -> discord_username
  shard: "Atlantic",      // -> main_shard
  chars: "Char1,Char2",   // -> character_names (array)
  status: 1,              // -> status ('active')
  created: "2023-01-01",  // -> created_at
}
```

### Transactions Table Mapping
```javascript
// Old -> New
{
  order_id: "ORD123",     // -> internal_reference
  user_email: "user@..",  // -> user_id (lookup)
  amount: 25.00,          // -> amount_usd
  item: "Power Scroll",   // -> items (JSONB)
  status: "complete",     // -> status ('completed')
  payment_id: "PAY123",   // -> payment_provider_id
  shard: "Atlantic",      // -> shard
  character: "MyChar",    // -> character_name
  date: "2023-01-01",     // -> created_at
}
```

---

## Verification Queries

After migration, verify your data:

```sql
-- Check user counts
SELECT COUNT(*) FROM users;

-- Check transaction totals
SELECT 
  COUNT(*) as total_transactions,
  SUM(amount_usd) as total_revenue,
  AVG(amount_usd) as avg_transaction
FROM transactions;

-- Check data integrity
SELECT 
  u.username,
  COUNT(t.id) as transaction_count,
  SUM(t.amount_usd) as total_spent
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.username
ORDER BY total_spent DESC
LIMIT 10;
```

---

## Rollback Plan

Always have a backup plan:

1. **Backup old database** before starting
2. **Test thoroughly** with small batches
3. **Keep old system running** until migration is verified
4. **Document any issues** for future reference

---

## Next Steps After Migration

1. **Update your application** to use new schema
2. **Set up proper authentication** with bcrypt
3. **Implement audit logging** for important changes
4. **Add indexes** for any custom queries
5. **Set up monitoring** and backups

---

## Need Help?

If you run into issues:

1. **Check the error logs** from migration script
2. **Verify field mappings** match your old schema
3. **Test with smaller datasets** first
4. **Check data types** and constraints

The migration script includes detailed error logging and statistics to help you track progress and identify issues.

---

## Database Schema Benefits

Your new schema includes:

✅ **Security**: Bcrypt password hashing, proper validation  
✅ **Performance**: Optimized indexes, efficient data types  
✅ **Scalability**: UUID keys, JSONB for flexible data  
✅ **Maintainability**: Proper constraints, foreign keys  
✅ **Audit Trail**: Change tracking, session management  
✅ **Modern Standards**: PostgreSQL best practices 