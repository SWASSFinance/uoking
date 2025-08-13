// SQL Dump Migration Script
// Migrates data from your 60MB SQL dump to the new Neon schema

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { SQLDataExtractor } = require('./extract-data-from-sql');
require('dotenv').config();

class SQLDumpMigrator {
  constructor() {
    this.newDbPool = new Pool({ connectionString: process.env.POSTGRES_URL });
    this.stats = {
      usersProcessed: 0,
      usersMigrated: 0,
      usersSkipped: 0,
      transactionsProcessed: 0,
      transactionsMigrated: 0,
      transactionsSkipped: 0,
      errors: []
    };
  }

  async connect() {
    try {
      await this.newDbPool.connect();
      console.log('✅ Connected to Neon database');
    } catch (error) {
      console.error('❌ Failed to connect to Neon database:', error);
      throw error;
    }
  }

  async migrateFromSQLDump(sqlFilePath) {
    console.log('🚀 Starting migration from SQL dump...');
    
    // Step 1: Extract data from SQL dump
    console.log('\n📤 Step 1: Extracting data from SQL dump...');
    const extractor = new SQLDataExtractor(sqlFilePath);
    const extractedData = await extractor.extract();
    
    // Step 2: Migrate users first (they're referenced by transactions)
    console.log('\n👤 Step 2: Migrating users...');
    const userData = this.findUserData(extractedData);
    if (userData.length > 0) {
      await this.migrateUsers(userData);
    } else {
      console.log('⚠️  No user data found in extracted data');
    }
    
    // Step 3: Build user email-to-ID mapping for transactions
    const userEmailToIdMap = await this.buildUserEmailToIdMap();
    
    // Step 4: Migrate transactions
    console.log('\n💰 Step 4: Migrating transactions...');
    const transactionData = this.findTransactionData(extractedData);
    if (transactionData.length > 0) {
      await this.migrateTransactions(transactionData, userEmailToIdMap);
    } else {
      console.log('⚠️  No transaction data found in extracted data');
    }
    
    // Step 5: Print final statistics
    await this.printStats();
  }

  findUserData(extractedData) {
    // Look for user data in various possible collections
    const possibleUserCollections = ['users', 'customers', 'members', 'accounts'];
    
    for (const collection of possibleUserCollections) {
      if (extractedData[collection] && extractedData[collection].length > 0) {
        console.log(`📋 Found ${extractedData[collection].length} users in '${collection}' collection`);
        return extractedData[collection];
      }
    }
    
    // Also check for table names that might contain users
    for (const [key, data] of Object.entries(extractedData)) {
      if (Array.isArray(data) && data.length > 0) {
        const sample = data[0];
        // Check if this looks like user data (has email, username, password, etc.)
        const hasUserFields = ['email', 'username', 'password', 'user_email', 'user_name'].some(field => 
          Object.keys(sample).some(key => key.toLowerCase().includes(field))
        );
        
        if (hasUserFields) {
          console.log(`📋 Found potential user data in '${key}' collection (${data.length} records)`);
          return data;
        }
      }
    }
    
    return [];
  }

  findTransactionData(extractedData) {
    // Look for transaction data in various possible collections
    const possibleTxnCollections = ['transactions', 'orders', 'payments', 'purchases', 'sales'];
    
    for (const collection of possibleTxnCollections) {
      if (extractedData[collection] && extractedData[collection].length > 0) {
        console.log(`📋 Found ${extractedData[collection].length} transactions in '${collection}' collection`);
        return extractedData[collection];
      }
    }
    
    // Also check for table names that might contain transactions
    for (const [key, data] of Object.entries(extractedData)) {
      if (Array.isArray(data) && data.length > 0) {
        const sample = data[0];
        // Check if this looks like transaction data (has amount, price, total, etc.)
        const hasTxnFields = ['amount', 'price', 'total', 'cost', 'value', 'payment'].some(field => 
          Object.keys(sample).some(key => key.toLowerCase().includes(field))
        );
        
        if (hasTxnFields) {
          console.log(`📋 Found potential transaction data in '${key}' collection (${data.length} records)`);
          return data;
        }
      }
    }
    
    return [];
  }

  async migrateUsers(userData) {
    console.log(`🔄 Processing ${userData.length} user records...`);
    
    for (const oldUser of userData) {
      try {
        this.stats.usersProcessed++;
        
        const cleanUser = await this.cleanUserData(oldUser);
        
        if (!cleanUser) {
          this.stats.usersSkipped++;
          continue;
        }

        // Insert into new database
        const query = `
          INSERT INTO users (
            email, username, password_hash, first_name, last_name,
            discord_username, main_shard, character_names, status,
            email_verified, created_at, last_login_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (email) DO NOTHING
          RETURNING id
        `;

        const result = await this.newDbPool.query(query, [
          cleanUser.email,
          cleanUser.username,
          cleanUser.password_hash,
          cleanUser.first_name,
          cleanUser.last_name,
          cleanUser.discord_username,
          cleanUser.main_shard,
          cleanUser.character_names,
          cleanUser.status,
          cleanUser.email_verified,
          cleanUser.created_at,
          cleanUser.last_login_at
        ]);

        if (result.rowCount > 0) {
          this.stats.usersMigrated++;
          if (this.stats.usersMigrated % 100 === 0) {
            console.log(`✅ Migrated ${this.stats.usersMigrated} users so far...`);
          }
        } else {
          this.stats.usersSkipped++;
        }

      } catch (error) {
        this.stats.usersSkipped++;
        this.stats.errors.push(`User migration error: ${error.message}`);
        console.error(`❌ Error migrating user:`, error.message);
      }
    }
  }

  async cleanUserData(oldUser) {
    try {
      // Try various field name patterns for email
      const emailField = this.findFieldByPatterns(oldUser, ['email', 'user_email', 'e_mail', 'mail']);
      const usernameField = this.findFieldByPatterns(oldUser, ['username', 'user_name', 'login', 'name']);
      
      const email = this.cleanEmail(emailField);
      const username = this.cleanUsername(usernameField);
      
      if (!email || !username) {
        console.log(`⚠️  Skipping user with missing email/username`);
        return null;
      }

      // Hash password if it exists
      const passwordField = this.findFieldByPatterns(oldUser, ['password', 'pass', 'pwd', 'user_password']);
      let password_hash;
      
      if (passwordField && !passwordField.startsWith('$2')) {
        // Plain text password - hash it
        password_hash = await bcrypt.hash(passwordField, 12);
      } else {
        // Already hashed or no password - create temp password
        password_hash = await bcrypt.hash('temp_password_' + Date.now(), 12);
      }

      return {
        email: email,
        username: username,
        password_hash: password_hash,
        first_name: this.findFieldByPatterns(oldUser, ['first_name', 'fname', 'firstname']) || null,
        last_name: this.findFieldByPatterns(oldUser, ['last_name', 'lname', 'lastname']) || null,
        discord_username: this.findFieldByPatterns(oldUser, ['discord', 'discord_name', 'discord_username']) || null,
        main_shard: this.findFieldByPatterns(oldUser, ['shard', 'main_shard', 'server']) || null,
        character_names: this.parseCharacterNames(
          this.findFieldByPatterns(oldUser, ['characters', 'character_names', 'chars'])
        ),
        status: this.mapUserStatus(this.findFieldByPatterns(oldUser, ['status', 'account_status', 'state'])),
        email_verified: Boolean(this.findFieldByPatterns(oldUser, ['email_verified', 'verified', 'is_verified'])),
        created_at: this.parseDate(this.findFieldByPatterns(oldUser, ['created_at', 'date_created', 'registration_date', 'created'])),
        last_login_at: this.parseDate(this.findFieldByPatterns(oldUser, ['last_login', 'last_login_date', 'last_seen']))
      };
    } catch (error) {
      console.error('Error cleaning user data:', error);
      return null;
    }
  }

  async migrateTransactions(transactionData, userEmailToIdMap) {
    console.log(`🔄 Processing ${transactionData.length} transaction records...`);
    
    for (const oldTxn of transactionData) {
      try {
        this.stats.transactionsProcessed++;
        
        const cleanTxn = await this.cleanTransactionData(oldTxn, userEmailToIdMap);
        
        if (!cleanTxn) {
          this.stats.transactionsSkipped++;
          continue;
        }

        const query = `
          INSERT INTO transactions (
            user_id, category_id, type, status, amount_usd, currency,
            payment_method, shard, character_name, delivery_location,
            items, payment_provider_id, internal_reference,
            delivery_status, customer_notes, staff_notes, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          RETURNING id
        `;

        await this.newDbPool.query(query, [
          cleanTxn.user_id,
          cleanTxn.category_id,
          cleanTxn.type,
          cleanTxn.status,
          cleanTxn.amount_usd,
          cleanTxn.currency,
          cleanTxn.payment_method,
          cleanTxn.shard,
          cleanTxn.character_name,
          cleanTxn.delivery_location,
          cleanTxn.items,
          cleanTxn.payment_provider_id,
          cleanTxn.internal_reference,
          cleanTxn.delivery_status,
          cleanTxn.customer_notes,
          cleanTxn.staff_notes,
          cleanTxn.created_at
        ]);

        this.stats.transactionsMigrated++;
        if (this.stats.transactionsMigrated % 100 === 0) {
          console.log(`✅ Migrated ${this.stats.transactionsMigrated} transactions so far...`);
        }

      } catch (error) {
        this.stats.transactionsSkipped++;
        this.stats.errors.push(`Transaction migration error: ${error.message}`);
        console.error(`❌ Error migrating transaction:`, error.message);
      }
    }
  }

  async cleanTransactionData(oldTxn, userEmailToIdMap) {
    try {
      // Find user by email
      const userEmail = this.findFieldByPatterns(oldTxn, ['email', 'user_email', 'customer_email', 'buyer_email']);
      const userId = userEmailToIdMap.get(userEmail);
      
      if (!userId) {
        return null; // Skip if user not found
      }

      // Extract amount
      const amountField = this.findFieldByPatterns(oldTxn, ['amount', 'price', 'total', 'cost', 'value']);
      const amount = parseFloat(amountField || 0);

      if (amount <= 0) {
        return null; // Skip zero-amount transactions
      }

      return {
        user_id: userId,
        category_id: this.mapTransactionCategory(
          this.findFieldByPatterns(oldTxn, ['category', 'type', 'item_type'])
        ),
        type: this.mapTransactionType(
          this.findFieldByPatterns(oldTxn, ['transaction_type', 'type', 'action'])
        ),
        status: this.mapTransactionStatus(
          this.findFieldByPatterns(oldTxn, ['status', 'state', 'transaction_status'])
        ),
        amount_usd: amount,
        currency: this.findFieldByPatterns(oldTxn, ['currency']) || 'USD',
        payment_method: this.findFieldByPatterns(oldTxn, ['payment_method', 'gateway', 'method']),
        shard: this.findFieldByPatterns(oldTxn, ['shard', 'server', 'realm']),
        character_name: this.findFieldByPatterns(oldTxn, ['character', 'character_name', 'char_name']),
        delivery_location: this.findFieldByPatterns(oldTxn, ['location', 'delivery_location']),
        items: this.parseItems(this.findFieldByPatterns(oldTxn, ['items', 'products', 'description', 'item_name'])),
        payment_provider_id: this.findFieldByPatterns(oldTxn, ['payment_id', 'transaction_id', 'external_id']),
        internal_reference: this.findFieldByPatterns(oldTxn, ['order_id', 'reference', 'id']),
        delivery_status: this.mapDeliveryStatus(
          this.findFieldByPatterns(oldTxn, ['delivery_status', 'delivered', 'delivery_state'])
        ),
        customer_notes: this.findFieldByPatterns(oldTxn, ['notes', 'customer_notes', 'comment']),
        staff_notes: this.findFieldByPatterns(oldTxn, ['admin_notes', 'staff_notes', 'internal_notes']),
        created_at: this.parseDate(this.findFieldByPatterns(oldTxn, ['created_at', 'date', 'order_date', 'timestamp']))
      };
    } catch (error) {
      console.error('Error cleaning transaction data:', error);
      return null;
    }
  }

  // Helper method to find fields by various name patterns
  findFieldByPatterns(obj, patterns) {
    for (const pattern of patterns) {
      // Exact match
      if (obj[pattern] !== undefined) {
        return obj[pattern];
      }
      
      // Case-insensitive match
      const key = Object.keys(obj).find(k => k.toLowerCase() === pattern.toLowerCase());
      if (key && obj[key] !== undefined) {
        return obj[key];
      }
      
      // Partial match
      const partialKey = Object.keys(obj).find(k => k.toLowerCase().includes(pattern.toLowerCase()));
      if (partialKey && obj[partialKey] !== undefined) {
        return obj[partialKey];
      }
    }
    return null;
  }

  // All the existing helper methods from the original migrate.js
  cleanEmail(email) {
    if (!email) return null;
    const cleaned = email.toString().toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(cleaned) ? cleaned : null;
  }

  cleanUsername(username) {
    if (!username) return null;
    return username.toString().trim().slice(0, 50);
  }

  parseCharacterNames(chars) {
    if (!chars) return [];
    if (Array.isArray(chars)) return chars;
    if (typeof chars === 'string') {
      return chars.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [];
  }

  mapUserStatus(status) {
    if (!status) return 'active';
    const statusMap = {
      'active': 'active', '1': 'active', 'enabled': 'active',
      'inactive': 'suspended', 'suspended': 'suspended', '0': 'suspended',
      'banned': 'banned', 'disabled': 'banned'
    };
    return statusMap[status.toString().toLowerCase()] || 'active';
  }

  mapTransactionCategory(category) {
    const categoryMap = {
      'gold': 1, 'items': 2, 'item': 2, 'service': 3, 'services': 3, 'refund': 4
    };
    return categoryMap[category?.toLowerCase()] || 2;
  }

  mapTransactionType(type) {
    const typeMap = {
      'purchase': 'purchase', 'buy': 'purchase', 'sale': 'sale', 
      'sell': 'sale', 'refund': 'refund', 'bonus': 'bonus'
    };
    return typeMap[type?.toLowerCase()] || 'purchase';
  }

  mapTransactionStatus(status) {
    const statusMap = {
      'completed': 'completed', 'complete': 'completed', 'success': 'completed',
      'pending': 'pending', 'processing': 'processing', 'failed': 'failed',
      'cancelled': 'cancelled', 'canceled': 'cancelled', 'refunded': 'refunded'
    };
    return statusMap[status?.toLowerCase()] || 'pending';
  }

  mapDeliveryStatus(status) {
    if (status === true || status === '1' || status === 'delivered') return 'delivered';
    if (status === false || status === '0') return 'pending';
    const statusMap = {
      'delivered': 'delivered', 'pending': 'pending', 
      'in_progress': 'in_progress', 'failed': 'failed'
    };
    return statusMap[status?.toLowerCase()] || 'pending';
  }

  parseItems(items) {
    if (!items) return null;
    if (typeof items === 'object') return items;
    if (typeof items === 'string') {
      try {
        return JSON.parse(items);
      } catch {
        return [{ name: items, quantity: 1 }];
      }
    }
    return null;
  }

  parseDate(date) {
    if (!date) return new Date();
    if (date instanceof Date) return date;
    return new Date(date);
  }

  async buildUserEmailToIdMap() {
    const result = await this.newDbPool.query('SELECT id, email FROM users');
    const map = new Map();
    result.rows.forEach(row => {
      map.set(row.email, row.id);
    });
    console.log(`📋 Built email-to-ID mapping for ${map.size} users`);
    return map;
  }

  async printStats() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION COMPLETE - FINAL STATISTICS');
    console.log('='.repeat(60));
    console.log(`Users Processed: ${this.stats.usersProcessed}`);
    console.log(`Users Migrated: ${this.stats.usersMigrated}`);
    console.log(`Users Skipped: ${this.stats.usersSkipped}`);
    console.log(`Transactions Processed: ${this.stats.transactionsProcessed}`);
    console.log(`Transactions Migrated: ${this.stats.transactionsMigrated}`);
    console.log(`Transactions Skipped: ${this.stats.transactionsSkipped}`);
    
    if (this.stats.errors.length > 0) {
      console.log(`\n❌ Errors (${this.stats.errors.length}):`);
      this.stats.errors.slice(0, 10).forEach(error => console.log(`  - ${error}`));
      if (this.stats.errors.length > 10) {
        console.log(`  ... and ${this.stats.errors.length - 10} more errors`);
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
  }

  async close() {
    await this.newDbPool.end();
  }
}

// Main migration function
async function runSQLDumpMigration() {
  // Look for SQL files in current directory, excluding our schema file
  const files = fs.readdirSync('.');
  const sqlFiles = files.filter(file => 
    file.endsWith('.sql') && 
    file !== 'schema.sql' // Exclude our new schema file
  );
  
  if (sqlFiles.length === 0) {
    console.log('❌ No database dump .sql files found in current directory');
    console.log('💡 Please place your SQL dump file in this directory and run again');
    return;
  }
  
  // Use the largest SQL file (most likely the main dump)
  const filesWithSize = sqlFiles.map(file => {
    const stats = fs.statSync(file);
    const sizeMB = stats.size / 1024 / 1024;
    return { file, sizeMB };
  }).sort((a, b) => b.sizeMB - a.sizeMB);
  
  const sqlFile = filesWithSize[0].file;
  console.log(`📁 Using database dump: ${sqlFile} (${filesWithSize[0].sizeMB.toFixed(2)} MB)`);
  
  const migrator = new SQLDumpMigrator();
  
  try {
    await migrator.connect();
    await migrator.migrateFromSQLDump(sqlFile);
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await migrator.close();
  }
}

if (require.main === module) {
  runSQLDumpMigration().catch(console.error);
}

module.exports = { SQLDumpMigrator }; 