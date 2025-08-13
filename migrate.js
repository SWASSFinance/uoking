// Database Migration Script
// Migrates from old messy database to new clean schema on Neon

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Configuration
const config = {
  // New Neon database (destination)
  newDb: {
    connectionString: process.env.POSTGRES_URL,
  },
  
  // Old database (source) - Update these with your old database details
  oldDb: {
    // For MySQL
    mysql: {
      host: 'your-old-host',
      user: 'your-old-username', 
      password: 'your-old-password',
      database: 'your-old-database'
    },
    // For PostgreSQL
    postgresql: {
      connectionString: 'postgres://user:pass@host:port/db'
    },
    // For SQLite
    sqlite: {
      filename: './old-database.db'
    }
  }
};

class DatabaseMigrator {
  constructor() {
    this.newDbPool = new Pool({ connectionString: config.newDb.connectionString });
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

  async migrateUsers(oldUsers) {
    console.log(`\n🔄 Migrating ${oldUsers.length} users...`);
    
    for (const oldUser of oldUsers) {
      try {
        this.stats.usersProcessed++;
        
        // Clean and validate user data
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
          console.log(`✅ Migrated user: ${cleanUser.username}`);
        } else {
          this.stats.usersSkipped++;
          console.log(`⚠️  Skipped duplicate user: ${cleanUser.email}`);
        }

      } catch (error) {
        this.stats.usersSkipped++;
        this.stats.errors.push(`User migration error: ${error.message}`);
        console.error(`❌ Error migrating user ${oldUser.username || oldUser.email}:`, error.message);
      }
    }
  }

  async cleanUserData(oldUser) {
    // Map your old user fields to new schema
    // Update these field mappings based on your old database structure
    
    try {
      const email = this.cleanEmail(oldUser.email || oldUser.user_email || oldUser.mail);
      const username = this.cleanUsername(oldUser.username || oldUser.user_name || oldUser.login);
      
      if (!email || !username) {
        console.log(`⚠️  Skipping user with missing email/username: ${JSON.stringify(oldUser)}`);
        return null;
      }

      // Hash password if it's plain text (common in old systems)
      let password_hash;
      if (oldUser.password && !oldUser.password.startsWith('$2')) {
        // Plain text password - hash it
        password_hash = await bcrypt.hash(oldUser.password, 12);
      } else {
        // Already hashed or no password
        password_hash = oldUser.password_hash || oldUser.password || await bcrypt.hash('temp_password_' + Date.now(), 12);
      }

      return {
        email: email,
        username: username,
        password_hash: password_hash,
        first_name: oldUser.first_name || oldUser.fname || null,
        last_name: oldUser.last_name || oldUser.lname || null,
        discord_username: oldUser.discord || oldUser.discord_name || null,
        main_shard: oldUser.shard || oldUser.main_shard || null,
        character_names: this.parseCharacterNames(oldUser.characters || oldUser.character_names),
        status: this.mapUserStatus(oldUser.status || oldUser.account_status),
        email_verified: oldUser.email_verified || false,
        created_at: this.parseDate(oldUser.created_at || oldUser.registration_date || oldUser.date_created),
        last_login_at: this.parseDate(oldUser.last_login || oldUser.last_login_date)
      };
    } catch (error) {
      console.error('Error cleaning user data:', error);
      return null;
    }
  }

  async migrateTransactions(oldTransactions, userEmailToIdMap) {
    console.log(`\n🔄 Migrating ${oldTransactions.length} transactions...`);
    
    for (const oldTxn of oldTransactions) {
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

        const result = await this.newDbPool.query(query, [
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
        console.log(`✅ Migrated transaction: ${cleanTxn.internal_reference || 'N/A'}`);

      } catch (error) {
        this.stats.transactionsSkipped++;
        this.stats.errors.push(`Transaction migration error: ${error.message}`);
        console.error(`❌ Error migrating transaction:`, error.message);
      }
    }
  }

  async cleanTransactionData(oldTxn, userEmailToIdMap) {
    try {
      // Map user by email or username
      const userEmail = oldTxn.user_email || oldTxn.customer_email || oldTxn.email;
      const userId = userEmailToIdMap.get(userEmail);
      
      if (!userId) {
        console.log(`⚠️  Skipping transaction - user not found: ${userEmail}`);
        return null;
      }

      // Map category (you'll need to adjust based on your old data)
      const categoryId = this.mapTransactionCategory(oldTxn.category || oldTxn.type || 'items');

      return {
        user_id: userId,
        category_id: categoryId,
        type: this.mapTransactionType(oldTxn.transaction_type || oldTxn.type),
        status: this.mapTransactionStatus(oldTxn.status || oldTxn.state),
        amount_usd: parseFloat(oldTxn.amount || oldTxn.price || oldTxn.total || 0),
        currency: oldTxn.currency || 'USD',
        payment_method: oldTxn.payment_method || oldTxn.gateway || null,
        shard: oldTxn.shard || oldTxn.server || null,
        character_name: oldTxn.character || oldTxn.character_name || null,
        delivery_location: oldTxn.delivery_location || oldTxn.location || null,
        items: this.parseItems(oldTxn.items || oldTxn.products || oldTxn.description),
        payment_provider_id: oldTxn.payment_id || oldTxn.transaction_id || null,
        internal_reference: oldTxn.order_id || oldTxn.reference || null,
        delivery_status: this.mapDeliveryStatus(oldTxn.delivery_status || oldTxn.delivered),
        customer_notes: oldTxn.notes || oldTxn.customer_notes || null,
        staff_notes: oldTxn.admin_notes || oldTxn.staff_notes || null,
        created_at: this.parseDate(oldTxn.created_at || oldTxn.order_date || oldTxn.date)
      };
    } catch (error) {
      console.error('Error cleaning transaction data:', error);
      return null;
    }
  }

  // Helper methods for data cleaning
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
      'active': 'active',
      'inactive': 'suspended',
      'banned': 'banned',
      'suspended': 'suspended',
      '1': 'active',
      '0': 'suspended'
    };
    return statusMap[status.toString().toLowerCase()] || 'active';
  }

  mapTransactionCategory(category) {
    const categoryMap = {
      'gold': 1,
      'items': 2,
      'item': 2,
      'service': 3,
      'services': 3,
      'refund': 4
    };
    return categoryMap[category?.toLowerCase()] || 2; // Default to items
  }

  mapTransactionType(type) {
    const typeMap = {
      'purchase': 'purchase',
      'buy': 'purchase',
      'sale': 'sale',
      'sell': 'sale',
      'refund': 'refund',
      'bonus': 'bonus'
    };
    return typeMap[type?.toLowerCase()] || 'purchase';
  }

  mapTransactionStatus(status) {
    const statusMap = {
      'completed': 'completed',
      'complete': 'completed',
      'pending': 'pending',
      'processing': 'processing',
      'failed': 'failed',
      'cancelled': 'cancelled',
      'canceled': 'cancelled',
      'refunded': 'refunded'
    };
    return statusMap[status?.toLowerCase()] || 'pending';
  }

  mapDeliveryStatus(status) {
    if (status === true || status === '1' || status === 'delivered') return 'delivered';
    if (status === false || status === '0') return 'pending';
    const statusMap = {
      'delivered': 'delivered',
      'pending': 'pending',
      'in_progress': 'in_progress',
      'failed': 'failed'
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
        // Create simple item object from string
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
    return map;
  }

  async printStats() {
    console.log('\n📊 Migration Statistics:');
    console.log('========================');
    console.log(`Users Processed: ${this.stats.usersProcessed}`);
    console.log(`Users Migrated: ${this.stats.usersMigrated}`);
    console.log(`Users Skipped: ${this.stats.usersSkipped}`);
    console.log(`Transactions Processed: ${this.stats.transactionsProcessed}`);
    console.log(`Transactions Migrated: ${this.stats.transactionsMigrated}`);
    console.log(`Transactions Skipped: ${this.stats.transactionsSkipped}`);
    
    if (this.stats.errors.length > 0) {
      console.log(`\n❌ Errors (${this.stats.errors.length}):`);
      this.stats.errors.forEach(error => console.log(`  - ${error}`));
    }
  }

  async close() {
    await this.newDbPool.end();
  }
}

// Example usage - you'll need to replace this with your actual data loading
async function runMigration() {
  const migrator = new DatabaseMigrator();
  
  try {
    await migrator.connect();
    
    // TODO: Load your old database data
    // This is where you'd connect to your old database and fetch the data
    const oldUsers = [
      // Load from your old database
      // Example: await loadOldUsers()
    ];
    
    const oldTransactions = [
      // Load from your old database  
      // Example: await loadOldTransactions()
    ];

    // Run migrations
    await migrator.migrateUsers(oldUsers);
    const userMap = await migrator.buildUserEmailToIdMap();
    await migrator.migrateTransactions(oldTransactions, userMap);
    
    await migrator.printStats();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await migrator.close();
  }
}

// Export for use
module.exports = { DatabaseMigrator, runMigration };

// Uncomment to run directly
// runMigration(); 