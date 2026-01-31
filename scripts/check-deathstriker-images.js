const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

(async () => {
  try {
    const result = await pool.query(`
      SELECT name, image_url, description
      FROM products 
      WHERE slug = 'pvp-bushi-parry-deathstriker-1'
    `);
    
    if (result.rows.length > 0) {
      const product = result.rows[0];
      console.log('=== Product Image Check ===');
      console.log('Name:', product.name);
      console.log('\nMain Image URL:', product.image_url);
      console.log('\n=== Description Images ===');
      
      // Extract all image URLs from description
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
      let match;
      let imgCount = 0;
      while ((match = imgRegex.exec(product.description)) !== null) {
        imgCount++;
        console.log(`${imgCount}. ${match[1]}`);
      }
      
      if (imgCount === 0) {
        console.log('(No images found in description)');
      }
      
      console.log('\n=== Analysis ===');
      if (product.image_url && product.image_url.includes('uowts.com')) {
        console.log('⚠️  WARNING: Main image is from uowts.com (watermarked!)');
      } else if (product.image_url && product.image_url.includes('cloudinary')) {
        console.log('✓ Main image is from Cloudinary (correct)');
      }
      
      if (product.description.includes('uowts.com/wp-content')) {
        console.log('⚠️  WARNING: Description still contains uowts.com image URLs!');
      } else if (product.description.includes('cloudinary')) {
        console.log('✓ Description images are from Cloudinary (correct)');
      }
    } else {
      console.log('Product not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
})();
