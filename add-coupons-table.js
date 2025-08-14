const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createCouponsTable() {
  const client = await pool.connect();
  
  try {
    console.log('Checking if coupons table exists...');
    
    // Check if coupons table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'coupons'
      );
    `);
    
    if (tableExists.rows[0].exists) {
      console.log('Coupons table already exists. Checking columns...');
      
      // Check what columns exist
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'coupons' 
        AND table_schema = 'public'
        ORDER BY column_name;
      `);
      
      console.log('Existing columns:', columnsResult.rows.map(row => `${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`));
      
      // Check the type column constraint
      const typeConstraintResult = await client.query(`
        SELECT conname, pg_get_constraintdef(oid) as constraint_def
        FROM pg_constraint 
        WHERE conrelid = 'coupons'::regclass 
        AND conname LIKE '%type%';
      `);
      
      console.log('Type column constraints:', typeConstraintResult.rows);
      
      // Add missing columns if needed
      const existingColumns = columnsResult.rows.map(row => row.column_name);
      
      if (!existingColumns.includes('discount_type')) {
        console.log('Adding discount_type column...');
        await client.query(`
          ALTER TABLE coupons 
          ADD COLUMN discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage' 
          CHECK (discount_type IN ('percentage', 'fixed'));
        `);
      }
      
      if (!existingColumns.includes('discount_value')) {
        console.log('Adding discount_value column...');
        await client.query(`
          ALTER TABLE coupons 
          ADD COLUMN discount_value DECIMAL(10,2) NOT NULL DEFAULT 0;
        `);
      }
      
      if (!existingColumns.includes('is_unlimited')) {
        console.log('Adding is_unlimited column...');
        await client.query(`
          ALTER TABLE coupons 
          ADD COLUMN is_unlimited BOOLEAN DEFAULT false;
        `);
      }
      
      if (!existingColumns.includes('max_uses')) {
        console.log('Adding max_uses column...');
        await client.query(`
          ALTER TABLE coupons 
          ADD COLUMN max_uses INTEGER DEFAULT 1;
        `);
      }
      
      if (!existingColumns.includes('used_count')) {
        console.log('Adding used_count column...');
        await client.query(`
          ALTER TABLE coupons 
          ADD COLUMN used_count INTEGER DEFAULT 0;
        `);
      }
      
      if (!existingColumns.includes('valid_from')) {
        console.log('Adding valid_from column...');
        await client.query(`
          ALTER TABLE coupons 
          ADD COLUMN valid_from TIMESTAMP DEFAULT NOW();
        `);
      }
      
      if (!existingColumns.includes('valid_until')) {
        console.log('Adding valid_until column...');
        await client.query(`
          ALTER TABLE coupons 
          ADD COLUMN valid_until TIMESTAMP;
        `);
      }
      
      if (!existingColumns.includes('updated_at')) {
        console.log('Adding updated_at column...');
        await client.query(`
          ALTER TABLE coupons 
          ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
        `);
      }
      
    } else {
      console.log('Creating coupons table...');
      
      // Create coupons table
      await client.query(`
        CREATE TABLE coupons (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          type VARCHAR(50) NOT NULL DEFAULT 'discount',
          value DECIMAL(10,2) NOT NULL DEFAULT 0,
          discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
          discount_value DECIMAL(10,2) NOT NULL,
          is_unlimited BOOLEAN DEFAULT false,
          max_uses INTEGER DEFAULT 1,
          used_count INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          valid_from TIMESTAMP DEFAULT NOW(),
          valid_until TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
    }
    
    console.log('Checking if coupon_usage table exists...');
    
    // Check if coupon_usage table exists
    const usageTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'coupon_usage'
      );
    `);
    
    if (!usageTableExists.rows[0].exists) {
      console.log('Creating coupon_usage table...');
      
      // Create coupon_usage table
      await client.query(`
        CREATE TABLE coupon_usage (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
          used_at TIMESTAMP DEFAULT NOW(),
          discount_amount DECIMAL(10,2) NOT NULL,
          UNIQUE(coupon_id, user_id)
        );
      `);
    } else {
      console.log('Coupon_usage table already exists.');
    }
    
    console.log('Inserting default "fiveoff" coupon...');
    
    // Check if fiveoff coupon already exists
    const existingCoupon = await client.query(`
      SELECT id FROM coupons WHERE code = 'fiveoff';
    `);
    
    if (existingCoupon.rows.length === 0) {
      // Try different type values based on common patterns
      const typeValues = ['discount', 'percentage', 'coupon', 'promo'];
      let insertSuccess = false;
      
      for (const typeValue of typeValues) {
        try {
          await client.query(`
            INSERT INTO coupons (
              code, name, description, type, value, discount_type, discount_value, 
              is_unlimited, is_active, valid_from, created_at, updated_at
            ) VALUES (
              'fiveoff', '5% Off Coupon', '5% off your entire order', 
              $1, 5.00, 'percentage', 5.00, true, true, NOW(), NOW(), NOW()
            );
          `, [typeValue]);
          
          console.log(`✅ Default "fiveoff" coupon created successfully with type: ${typeValue}!`);
          insertSuccess = true;
          break;
        } catch (error) {
          console.log(`Failed with type '${typeValue}':`, error.message);
          continue;
        }
      }
      
      if (!insertSuccess) {
        throw new Error('Could not insert coupon with any type value');
      }
    } else {
      // Update existing coupon with new fields
      await client.query(`
        UPDATE coupons SET 
          name = '5% Off Coupon',
          description = '5% off your entire order',
          value = 5.00,
          discount_type = 'percentage',
          discount_value = 5.00,
          is_unlimited = true,
          is_active = true,
          updated_at = NOW()
        WHERE code = 'fiveoff';
      `);
      console.log('✅ Default "fiveoff" coupon updated successfully!');
    }
    
    console.log('Creating indexes...');
    
    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);');
    
    console.log('✅ Coupons table and related structures created successfully!');
    
    // Verify the tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('coupons', 'coupon_usage')
      ORDER BY table_name;
    `);
    
    console.log('Created tables:', tablesResult.rows.map(row => row.table_name));
    
    // Check if fiveoff coupon was created
    const couponResult = await client.query(`
      SELECT code, name, description, type, value, discount_type, discount_value, is_unlimited, is_active
      FROM coupons WHERE code = 'fiveoff';
    `);
    
    if (couponResult.rows.length > 0) {
      console.log('✅ Default "fiveoff" coupon verified:', couponResult.rows[0]);
    } else {
      console.log('⚠️  Default "fiveoff" coupon not found');
    }
    
  } catch (error) {
    console.error('❌ Error creating coupons table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
createCouponsTable()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }); 