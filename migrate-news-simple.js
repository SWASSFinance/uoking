const { Pool } = require('pg');
const fs = require('fs');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function migrateNewsData() {
  try {
    console.log('Starting news data migration...');
    
    // Drop existing news table if it exists
    console.log('Dropping existing news table...');
    await pool.query(`DROP TABLE IF EXISTS news CASCADE`);
    
    // Create new news table with structure matching CSV
    console.log('Creating new news table...');
    await pool.query(`
      CREATE TABLE news (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        posted_by VARCHAR(100) NOT NULL DEFAULT 'admin',
        date_posted DATE NOT NULL DEFAULT CURRENT_DATE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Create indexes for performance
    await pool.query(`CREATE INDEX idx_news_date_posted ON news(date_posted DESC)`);
    await pool.query(`CREATE INDEX idx_news_is_active ON news(is_active)`);
    
    console.log('✅ News table created successfully!');
    
    // Read CSV file manually
    console.log('Reading CSV file...');
    const csvContent = fs.readFileSync('./news.csv', 'utf8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    
    console.log('Headers:', headers);
    
    const newsData = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
        if (values.length >= 5) {
          newsData.push({
            id: values[0],
            title: values[1],
            message: values[2],
            posted_by: values[3],
            date_posted: values[4]
          });
        }
      }
    }
    
    console.log(`Found ${newsData.length} news records in CSV`);
    
    // Insert all news data
    console.log('Inserting news data...');
    for (const news of newsData) {
      await pool.query(`
        INSERT INTO news (id, title, message, posted_by, date_posted)
        VALUES ($1, $2, $3, $4, $5)
      `, [news.id, news.title, news.message, news.posted_by, news.date_posted]);
    }
    
    console.log(`✅ Successfully inserted ${newsData.length} news records!`);
    
    // Verify the data
    const result = await pool.query(`SELECT COUNT(*) as count FROM news`);
    console.log(`📊 News table now contains ${result.rows[0].count} records`);
    
    // Show sample data
    const sample = await pool.query(`SELECT id, title, date_posted FROM news ORDER BY date_posted DESC LIMIT 3`);
    console.log('Sample records:');
    sample.rows.forEach(row => {
      console.log(`  - ${row.title} (${row.date_posted})`);
    });
    
    console.log('🎉 News migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
migrateNewsData()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
