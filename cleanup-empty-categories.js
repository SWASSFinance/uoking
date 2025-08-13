const { Client } = require('pg');

// Database connection
const dbConfig = require('./db-config.js');
const client = new Client({
  connectionString: process.env.DATABASE_URL || dbConfig.POSTGRES_URL
});

async function cleanupEmptyCategories() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Step 1: Find all categories with their product counts
    console.log('\n=== Step 1: Analyzing categories ===');
    
    const categoryAnalysis = await client.query(`
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.parent_id,
        COALESCE(pc_count.product_count, 0) as direct_products,
        COALESCE(legacy_count.legacy_products, 0) as legacy_products,
        CASE WHEN children.child_count > 0 THEN true ELSE false END as has_children
      FROM categories c
      LEFT JOIN (
        SELECT category_id, COUNT(*) as product_count 
        FROM product_categories 
        GROUP BY category_id
      ) pc_count ON c.id = pc_count.category_id
      LEFT JOIN (
        SELECT category_id, COUNT(*) as legacy_products
        FROM products 
        WHERE category_id IS NOT NULL
        GROUP BY category_id
      ) legacy_count ON c.id = legacy_count.category_id
      LEFT JOIN (
        SELECT parent_id, COUNT(*) as child_count
        FROM categories
        WHERE parent_id IS NOT NULL
        GROUP BY parent_id
      ) children ON c.id = children.parent_id
      ORDER BY c.name
    `);
    
    console.log('\n📊 Category Analysis:');
    console.log('──────────────────────────────────────────────────────────');
    
    const emptyCategories = [];
    const categoriesWithProducts = [];
    const parentCategories = [];
    
    for (const cat of categoryAnalysis.rows) {
      const totalProducts = cat.direct_products + cat.legacy_products;
      const status = totalProducts > 0 ? '✅' : (cat.has_children ? '📁' : '❌');
      
      console.log(`${status} ${cat.name}: ${totalProducts} products${cat.has_children ? ' (has children)' : ''}`);
      
      if (totalProducts === 0 && !cat.has_children) {
        emptyCategories.push(cat);
      } else if (totalProducts > 0) {
        categoriesWithProducts.push(cat);
      } else if (cat.has_children) {
        parentCategories.push(cat);
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`✅ Categories with products: ${categoriesWithProducts.length}`);
    console.log(`📁 Parent categories (empty but have children): ${parentCategories.length}`);
    console.log(`❌ Empty categories (safe to delete): ${emptyCategories.length}`);
    
    if (emptyCategories.length === 0) {
      console.log('\n🎉 No empty categories found! Your database is already clean.');
      return;
    }
    
    // Step 2: Show what will be deleted
    console.log('\n=== Step 2: Categories to be deleted ===');
    emptyCategories.forEach(cat => {
      console.log(`🗑️  ${cat.name} (${cat.slug})`);
    });
    
    // Step 3: Delete empty categories
    console.log('\n=== Step 3: Deleting empty categories ===');
    
    await client.query('BEGIN');
    
    try {
      let deletedCount = 0;
      
      for (const cat of emptyCategories) {
        // Double-check that category is still empty (safety check)
        const recheck = await client.query(`
          SELECT 
            (SELECT COUNT(*) FROM product_categories WHERE category_id = $1) +
            (SELECT COUNT(*) FROM products WHERE category_id = $1) as total_products
        `, [cat.id]);
        
        if (recheck.rows[0].total_products > 0) {
          console.log(`⚠️  Skipping ${cat.name} - products were added during cleanup`);
          continue;
        }
        
        // Delete the category
        await client.query('DELETE FROM categories WHERE id = $1', [cat.id]);
        console.log(`✅ Deleted: ${cat.name}`);
        deletedCount++;
      }
      
      await client.query('COMMIT');
      
      console.log('\n=== Cleanup Summary ===');
      console.log(`🗑️  Successfully deleted: ${deletedCount} empty categories`);
      console.log(`✅ Kept: ${categoriesWithProducts.length} categories with products`);
      console.log(`📁 Kept: ${parentCategories.length} parent categories`);
      
      // Step 4: Update category counts in the database
      console.log('\n=== Step 4: Updating category product counts ===');
      
      await client.query(`
        UPDATE categories 
        SET product_count = COALESCE(counts.total_count, 0)
        FROM (
          SELECT 
            c.id,
            COALESCE(pc_count.junction_products, 0) + COALESCE(direct_count.direct_products, 0) as total_count
          FROM categories c
          LEFT JOIN (
            SELECT category_id, COUNT(*) as junction_products
            FROM product_categories
            GROUP BY category_id
          ) pc_count ON c.id = pc_count.category_id
          LEFT JOIN (
            SELECT category_id, COUNT(*) as direct_products
            FROM products
            WHERE category_id IS NOT NULL
            GROUP BY category_id
          ) direct_count ON c.id = direct_count.category_id
        ) counts
        WHERE categories.id = counts.id
      `);
      
      console.log('✅ Updated product counts for all remaining categories');
      
      // Show final category list
      console.log('\n=== Final Category List ===');
      const finalCategories = await client.query(`
        SELECT name, product_count 
        FROM categories 
        WHERE product_count > 0 
        ORDER BY product_count DESC, name
      `);
      
      console.log('Categories with products:');
      finalCategories.rows.forEach(cat => {
        console.log(`  ${cat.name}: ${cat.product_count} products`);
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run cleanup
if (require.main === module) {
  cleanupEmptyCategories()
    .then(() => {
      console.log('\n🎉 Category cleanup completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanupEmptyCategories }; 