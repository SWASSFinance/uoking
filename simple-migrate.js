// Simple Direct Migration Script
// Migrates your specific ecom_userlist and ecom_orders data

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
require('dotenv').config();

class DirectMigrator {
  constructor() {
    this.newDbPool = new Pool({ connectionString: process.env.POSTGRES_URL });
    this.stats = {
      usersProcessed: 0,
      usersMigrated: 0,
      transactionsProcessed: 0,
      transactionsMigrated: 0,
      errors: []
    };
    
    // Sample data from your SQL dump for testing
    this.sampleUsers = [
      {
        UserID: 5,
        Email: 'jeremy.p.martell@gmail.com',
        Pwd: '$2y$10$Wsfac6xqqRNQOj5oZClVh.X/uEARSgTjD1GDvE8qgqgdsmH9TZuki',
        FirstName: 'Jerm',
        LastName: 'Martell',
        Phone: '4014739857',
        Address: '62 spring street',
        City: 'Westerly',
        State: 'RI',
        Zip: '02891',
        shard: '',
        JoinedOn: '2018-03-14',
        ip_address: '96.230.70.118',
        discord_id: 0,
        EmailVerified: 1
      },
      {
        UserID: 4,
        Email: 'petervesti@gmail.com',
        Pwd: '$2y$10$/.21VbLhnh0b.JpB7x7kqu7N6SI7ldJTNO7un3M4ENiq79ZliZHgu',
        FirstName: 'Peter Vesti',
        LastName: 'Frendrup',
        Phone: '762889835',
        Address: 'Upplandsgatan 70, LGH 1002',
        City: 'Stockholm',
        State: 'Sweden',
        Zip: '11344',
        shard: '',
        JoinedOn: '2018-03-14',
        ip_address: '71.174.252.98',
        discord_id: 563072273544773632,
        EmailVerified: 1
      }
    ];
    
    this.sampleOrders = [
      {
        id: 7,
        userid: 1,
        first_name: 'William',
        last_name: 'Blow',
        phone: '4013008724',
        pp_email: 'will@rethinknetworks.com',
        payment_amount: 49.99,
        shard: 'Atlantic',
        order_date: '2018-03-27 17:47:44',
        charname: 'wew',
        ipaddress: '206.53.71.149',
        payment_type: 0
      },
      {
        id: 401,
        userid: 0,
        first_name: 'Mike',
        last_name: 'Palmer',
        phone: '3045599640',
        pp_email: 'kayak620@yahoo.com',
        payment_amount: 25.99,
        shard: 'Atlantic',
        order_date: '2020-01-24 01:28:46',
        charname: 'Skull',
        ipaddress: '67.186.60.76',
        payment_type: 1
      }
    ];
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

  async migrateTestData() {
    console.log('🚀 Starting test migration with sample data...');
    
    // Step 1: Migrate sample users
    console.log('\n👤 Step 1: Migrating sample users...');
    await this.migrateUsers(this.sampleUsers);
    
    // Step 2: Build email-to-ID mapping
    const userEmailToIdMap = await this.buildUserEmailToIdMap();
    
    // Step 3: Migrate sample orders
    console.log('\n💰 Step 3: Migrating sample orders...');
    await this.migrateOrders(this.sampleOrders, userEmailToIdMap);
    
    // Step 4: Print statistics
    await this.printStats();
  }

  async migrateUsers(users) {
    for (const user of users) {
      try {
        this.stats.usersProcessed++;
        
        const cleanUser = await this.cleanUserData(user);
        
        if (!cleanUser) {
          continue;
        }

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
          console.log(`✅ Migrated user: ${cleanUser.email}`);
        }

      } catch (error) {
        this.stats.errors.push(`User migration error: ${error.message}`);
        console.error(`❌ Error migrating user:`, error.message);
      }
    }
  }

  async cleanUserData(oldUser) {
    try {
      // Hash password if it's not already hashed
      let password_hash;
      if (oldUser.Pwd && oldUser.Pwd.startsWith('$2')) {
        // Already hashed
        password_hash = oldUser.Pwd;
      } else if (oldUser.Pwd) {
        // Plain text - hash it
        password_hash = await bcrypt.hash(oldUser.Pwd, 12);
      } else {
        // No password - create temp one
        password_hash = await bcrypt.hash('temp_password_' + Date.now(), 12);
      }

      return {
        email: oldUser.Email?.toLowerCase()?.trim(),
        username: oldUser.FirstName || 'User' + oldUser.UserID,
        password_hash: password_hash,
        first_name: oldUser.FirstName || null,
        last_name: oldUser.LastName || null,
        discord_username: oldUser.discord_id ? oldUser.discord_id.toString() : null,
        main_shard: oldUser.shard || null,
        character_names: [], // Will be populated from orders
        status: 'active',
        email_verified: Boolean(oldUser.EmailVerified),
        created_at: new Date(oldUser.JoinedOn || '2018-01-01'),
        last_login_at: new Date(oldUser.JoinedOn || '2018-01-01')
      };
    } catch (error) {
      console.error('Error cleaning user data:', error);
      return null;
    }
  }

  async migrateOrders(orders, userEmailToIdMap) {
    for (const order of orders) {
      try {
        this.stats.transactionsProcessed++;
        
        const cleanTxn = await this.cleanOrderData(order, userEmailToIdMap);
        
        if (!cleanTxn) {
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
        console.log(`✅ Migrated order: $${cleanTxn.amount_usd} for ${cleanTxn.character_name}`);

      } catch (error) {
        this.stats.errors.push(`Transaction migration error: ${error.message}`);
        console.error(`❌ Error migrating transaction:`, error.message);
      }
    }
  }

  async cleanOrderData(order, userEmailToIdMap) {
    try {
      // Find user by email
      let userId = null;
      if (order.pp_email) {
        userId = userEmailToIdMap.get(order.pp_email.toLowerCase());
      }
      
      // If no user found and userid > 0, try to find by userid
      if (!userId && order.userid > 0) {
        // For this test, we'll create a placeholder user
        userId = null; // Will be handled by creating anonymous transactions
      }

      const amount = parseFloat(order.payment_amount || 0);
      if (amount <= 0) {
        return null;
      }

      return {
        user_id: userId, // Can be null for anonymous orders
        category_id: 2, // Default to "items"
        type: 'purchase',
        status: 'completed', // Assume completed since these are historical
        amount_usd: amount,
        currency: 'USD',
        payment_method: order.payment_type === 1 ? 'paypal' : 'other',
        shard: order.shard || null,
        character_name: order.charname || null,
        delivery_location: null,
        items: order.charname ? [{ name: 'UO Items', character: order.charname, quantity: 1 }] : null,
        payment_provider_id: order.id.toString(),
        internal_reference: order.id.toString(),
        delivery_status: 'delivered', // Assume delivered for historical data
        customer_notes: order.notes || null,
        staff_notes: null,
        created_at: new Date(order.order_date)
      };
    } catch (error) {
      console.error('Error cleaning order data:', error);
      return null;
    }
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
    console.log('📊 TEST MIGRATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`Users Processed: ${this.stats.usersProcessed}`);
    console.log(`Users Migrated: ${this.stats.usersMigrated}`);
    console.log(`Transactions Processed: ${this.stats.transactionsProcessed}`);
    console.log(`Transactions Migrated: ${this.stats.transactionsMigrated}`);
    
    if (this.stats.errors.length > 0) {
      console.log(`\n❌ Errors (${this.stats.errors.length}):`);
      this.stats.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n✅ Test migration completed!');
    console.log('\n💡 Next steps:');
    console.log('1. Review the migrated data in your Neon database');
    console.log('2. If satisfied, we can extract all 13 users and 34 orders from your SQL dump');
    console.log('3. Then run a full migration');
  }

  async close() {
    await this.newDbPool.end();
  }
}

// Run test migration
async function runTestMigration() {
  const migrator = new DirectMigrator();
  
  try {
    await migrator.connect();
    await migrator.migrateTestData();
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await migrator.close();
  }
}

if (require.main === module) {
  runTestMigration().catch(console.error);
}

module.exports = { DirectMigrator }; 