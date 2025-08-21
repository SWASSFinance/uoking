const pool = require('./lib/db.ts').default;
const fs = require('fs');
const csv = require('csv-parser');

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
    
    // Read and parse CSV file
    console.log('Reading CSV file...');
    const newsData = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream('./news.csv')
        .pipe(csv())
        .on('data', (row) => {
          newsData.push({
            id: row.id,
            title: row.title,
            message: row.message,
            posted_by: row.postedby,
            date_posted: row.dateposted
          });
        })
        .on('end', async () => {
          try {
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
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
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
