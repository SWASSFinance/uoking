const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

(async () => {
  try {
    const result = await pool.query(`
      SELECT name, slug, image_url, description
      FROM products 
      WHERE slug LIKE 'pvp-%'
      ORDER BY name
    `);
    
    console.log(`\n=== CURRENT CLOUDINARY URLs FOR PVP PRODUCTS ===\n`);
    
    result.rows.forEach((product, idx) => {
      console.log(`${idx + 1}. ${product.name}`);
      console.log(`   Product slug: ${product.slug}`);
      console.log(`\n   MAIN IMAGE URL (copy this to test in browser):`);
      console.log(`   ${product.image_url}`);
      
      // Extract image URLs from description HTML
      const descImageMatches = product.description.match(/https:\/\/res\.cloudinary\.com[^"'\s]+(jpg|jpeg|png|gif|webp)/gi);
      if (descImageMatches && descImageMatches.length > 0) {
        console.log(`\n   DESCRIPTION IMAGE URLs:`);
        descImageMatches.forEach((url, i) => {
          console.log(`   ${i + 1}. ${url}`);
        });
      }
      
      console.log('\n' + '='.repeat(80) + '\n');
    });
    
    console.log('INSTRUCTIONS:');
    console.log('1. Copy each URL above');
    console.log('2. Paste into your browser to verify the correct image is shown');
    console.log('3. The main image should be stats/character image (NO watermark/logo)');
    console.log('4. Tell me if ANY of these URLs show the wrong image\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
})();
