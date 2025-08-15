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

async function testBanners() {
  try {
    console.log('Testing banner fetching...')
    
    // Test 1: Get all banners
    const allBanners = await pool.query('SELECT * FROM banners')
    console.log('All banners:', allBanners.rows.length)
    allBanners.rows.forEach((banner, index) => {
      console.log(`Banner ${index + 1}:`, {
        id: banner.id,
        title: banner.title,
        position: banner.position,
        is_active: banner.is_active,
        video_url: banner.video_url
      })
    })
    
    // Test 2: Get active banners
    const activeBanners = await pool.query('SELECT * FROM banners WHERE is_active = true')
    console.log('Active banners:', activeBanners.rows.length)
    
    // Test 3: Get homepage banners
    const homepageBanners = await pool.query('SELECT * FROM banners WHERE position = \'homepage\' AND is_active = true')
    console.log('Homepage banners:', homepageBanners.rows.length)
    homepageBanners.rows.forEach((banner, index) => {
      console.log(`Homepage Banner ${index + 1}:`, {
        id: banner.id,
        title: banner.title,
        video_url: banner.video_url,
        is_active: banner.is_active
      })
    })
    
  } catch (error) {
    console.error('❌ Error testing banners:', error.message)
    throw error
  } finally {
    await pool.end()
  }
}

// Run the test
testBanners()
  .then(() => {
    console.log('Test completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  }) 