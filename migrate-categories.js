const { Pool } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

// Helper function to create slug from category name
function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
}

// Helper function to clean HTML content
function cleanHtmlContent(content) {
  if (!content || typeof content !== 'string') return null;
  
  // Remove excessive whitespace and normalize
  content = content.trim().replace(/\s+/g, ' ');
  
  // If content is just empty quotes or whitespace, return null
  if (content === '' || content === '""' || content.replace(/["'\s]/g, '') === '') {
    return null;
  }
  
  return content;
}

async function migrateCategories() {
  const client = await pool.connect();
  
  try {
    console.log('📂 Starting category migration from CSV...');
    
    // Read and process category CSV data
    console.log('📊 Reading category data from CSV...');
    const categories = [];
    const categoryMap = new Map();
    
    // Process category CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream('./public/category.csv')
        .pipe(csv())
        .on('data', (row) => {
          const categoryId = parseInt(row.category_id);
          const parentId = parseInt(row.parent_category) || null;
          const name = row.name && row.name.trim();
          
          if (!name || !categoryId) {
            console.log(`❌ Skipping invalid category: ${row.name || 'unnamed'}`);
            return;
          }
          
          // Skip if parent is 0 (convert to null)
          const parentCategoryId = parentId === 0 ? null : parentId;
          
          const description = cleanHtmlContent(row.description);
          const bottomDesc = cleanHtmlContent(row.bottom_desc);
          const image = row.image && row.image.trim() ? row.image.trim() : null;
          
          // Combine descriptions
          let fullDescription = description || '';
          if (bottomDesc) {
            fullDescription = fullDescription ? `${fullDescription}\n\n${bottomDesc}` : bottomDesc;
          }
          
          categories.push({
            legacyId: categoryId,
            parentLegacyId: parentCategoryId,
            name: name,
            slug: createSlug(name),
            description: fullDescription || null,
            imageUrl: image ? `/public/${image}` : null
          });
          
          // Store mapping for parent-child relationships
          categoryMap.set(categoryId, null); // Will be updated with UUID after insertion
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`📂 Loaded ${categories.length} categories from CSV`);
    
    // Insert categories (top-level first, then subcategories)
    console.log('📂 Migrating categories...');
    let categoryCount = 0;
    
    // Sort categories: parent categories first, then children
    const topLevelCategories = categories.filter(cat => cat.parentLegacyId === null);
    const subCategories = categories.filter(cat => cat.parentLegacyId !== null);
    const sortedCategories = [...topLevelCategories, ...subCategories];
    
    console.log(`📊 Processing ${topLevelCategories.length} top-level categories and ${subCategories.length} subcategories...`);
    
    for (const category of sortedCategories) {
      try {
        await client.query('BEGIN');
        
        // Get parent UUID if this is a subcategory
        const parentId = category.parentLegacyId ? categoryMap.get(category.parentLegacyId) : null;
        
        const result = await client.query(`
          INSERT INTO categories (
            name, slug, description, parent_id, image_url, sort_order, is_active,
            meta_title, meta_description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            parent_id = EXCLUDED.parent_id,
            image_url = EXCLUDED.image_url,
            meta_title = EXCLUDED.meta_title,
            meta_description = EXCLUDED.meta_description
          RETURNING id
        `, [
          category.name,
          category.slug,
          category.description,
          parentId,
          category.imageUrl,
          category.legacyId, // Use legacy ID as sort order
          true,
          `${category.name} - UO King`, // Meta title
          category.description ? category.description.substring(0, 160) : `Shop ${category.name} items for Ultima Online` // Meta description
        ]);
        
        await client.query('COMMIT');
        
        if (result.rows.length > 0) {
          categoryMap.set(category.legacyId, result.rows[0].id);
          categoryCount++;
          
          if (category.parentLegacyId) {
            console.log(`  ↳ ${category.name} (subcategory)`);
          } else {
            console.log(`✓ ${category.name}`);
          }
        }
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Error inserting category ${category.name}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully migrated ${categoryCount} categories`);
    
    // Display final statistics
    console.log('\n📊 Category Migration Summary:');
    
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_categories,
        COUNT(*) FILTER (WHERE parent_id IS NULL) as top_level_categories,
        COUNT(*) FILTER (WHERE parent_id IS NOT NULL) as subcategories
      FROM categories
    `);
    
    const summary = stats.rows[0];
    console.log(`• ${summary.total_categories} total categories in database`);
    console.log(`• ${summary.top_level_categories} top-level categories`);
    console.log(`• ${summary.subcategories} subcategories`);
    
    // Show category tree
    console.log('\n🌳 Category Structure:');
    const categoryTree = await client.query(`
      SELECT 
        p.name as parent_name,
        p.slug as parent_slug,
        COUNT(c.id) as child_count
      FROM categories p
      LEFT JOIN categories c ON c.parent_id = p.id
      WHERE p.parent_id IS NULL
      GROUP BY p.id, p.name, p.slug
      ORDER BY p.sort_order, p.name
    `);
    
    for (const parent of categoryTree.rows) {
      console.log(`📁 ${parent.parent_name} (${parent.child_count} subcategories)`);
      
      if (parseInt(parent.child_count) > 0) {
        const children = await client.query(`
          SELECT name, slug
          FROM categories
          WHERE parent_id = (SELECT id FROM categories WHERE slug = $1)
          ORDER BY sort_order, name
          LIMIT 5
        `, [parent.parent_slug]);
        
        for (const child of children.rows) {
          console.log(`  ├─ ${child.name}`);
        }
        
        if (parseInt(parent.child_count) > 5) {
          console.log(`  └─ ... and ${parseInt(parent.child_count) - 5} more`);
        }
      }
    }
    
    console.log('\n🎉 Category migration completed successfully!');
    console.log('💡 Categories are now ready for product assignment and dynamic page generation.');
    
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      // Ignore rollback errors
    }
    console.error('❌ Category migration failed:', error);
    throw error;
  } finally {
    if (client && !client._ended) {
      client.release();
    }
    await pool.end();
  }
}

// Run migration
if (require.main === module) {
  migrateCategories().catch(console.error);
}

module.exports = { migrateCategories }; 