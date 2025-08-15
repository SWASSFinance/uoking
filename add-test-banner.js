const { Pool } = require('pg')

// Database configuration
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

async function addTestBanner() {
  try {
    console.log('Adding test banner...')
    
    const bannerData = {
      title: 'Welcome to UO KING',
      subtitle: 'Your Ultimate Ultima Online Resource',
      description: 'Discover the best Ultima Online items, gold, and services',
      video_url: 'https://youtu.be/XxdCFGYId_4',
      image_url: '',
      button_text: 'Shop Now',
      button_url: '/store',
      position: 'homepage',
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const result = await pool.query(`
      INSERT INTO banners (
        title, subtitle, description, video_url, image_url, 
        button_text, button_url, position, is_active, sort_order,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      bannerData.title,
      bannerData.subtitle,
      bannerData.description,
      bannerData.video_url,
      bannerData.image_url,
      bannerData.button_text,
      bannerData.button_url,
      bannerData.position,
      bannerData.is_active,
      bannerData.sort_order,
      bannerData.created_at,
      bannerData.updated_at
    ])
    
    console.log('✅ Test banner added successfully!')
    console.log('Banner ID:', result.rows[0].id)
    console.log('Video URL:', result.rows[0].video_url)
    
    // Verify the banner was added
    const verifyResult = await pool.query(`
      SELECT COUNT(*) as count FROM banners WHERE position = 'homepage' AND is_active = true
    `)
    
    console.log('Active homepage banners:', verifyResult.rows[0].count)
    
  } catch (error) {
    console.error('❌ Error adding test banner:', error.message)
    if (error.code === '23505') {
      console.log('ℹ️  Banner already exists, continuing...')
    } else {
      throw error
    }
  } finally {
    await pool.end()
  }
}

// Run the script
addTestBanner()
  .then(() => {
    console.log('Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  }) 