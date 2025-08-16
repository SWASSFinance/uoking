const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

const shards = [
  'Atlantic',
  'Arirang', 
  'Asuka',
  'Balhae',
  'Baja',
  'Catskills',
  'Chesapeake',
  'Drachenfels',
  'Europa',
  'Formosa',
  'Great Lakes',
  'Hokuto',
  'Izumo',
  'Lake Austin',
  'Lake Superior',
  'Legends',
  'Mizuho',
  'Mugan',
  'Napa Valley',
  'Oceania',
  'Origins',
  'Pacific',
  'Sakura',
  'Sonoma',
  'Siege Perilous',
  'Wakoku',
  'Yamato'
];

async function createShardsTable() {
  const client = await pool.connect();
  
  try {
    // Create shards table
    await client.query(`
      CREATE TABLE IF NOT EXISTS shards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Shards table created successfully');

    // Insert initial shards
    for (let i = 0; i < shards.length; i++) {
      const shard = shards[i];
      const slug = shard.toLowerCase().replace(/\s+/g, '-');
      
      try {
        await client.query(`
          INSERT INTO shards (name, slug, sort_order) 
          VALUES ($1, $2, $3)
          ON CONFLICT (name) DO NOTHING
        `, [shard, slug, i + 1]);
        
        console.log(`✅ Added shard: ${shard}`);
      } catch (error) {
        console.log(`⚠️  Skipped shard: ${shard} (already exists)`);
      }
    }

    console.log('✅ All shards added successfully');

  } catch (error) {
    console.error('❌ Error creating shards table:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await createShardsTable();
    console.log('🎉 Shards table migration completed successfully!');
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main(); 