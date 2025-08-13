const { Client } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');

// Database connection
const dbConfig = require('./db-config.js');
const client = new Client({
  connectionString: process.env.DATABASE_URL || dbConfig.POSTGRES_URL
});

// Helper function to create URL-friendly slugs
function createSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
}

// Helper function to clean HTML content
function cleanHtmlContent(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&')  // Replace &amp; with &
    .replace(/&lt;/g, '<')   // Replace &lt; with <
    .replace(/&gt;/g, '>')   // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'")  // Replace &#39; with '
    .trim();
}

// Helper function to parse price
function parsePrice(priceStr) {
  if (!priceStr || priceStr === '0' || priceStr === '') return 0;
  const price = parseFloat(priceStr);
  return isNaN(price) ? 0 : price;
}

// Helper function to determine product type based on category and item data
function determineProductType(categoryName, itemName) {
  const name = itemName.toLowerCase();
  const category = categoryName.toLowerCase();
  
  if (category.includes('gold') || name.includes('gold') || name.includes('million')) {
    return 'gold';
  }
  if (category.includes('house') || name.includes('house') || name.includes('plot')) {
    return 'house';
  }
  if (category.includes('account') || name.includes('account')) {
    return 'account';
  }
  if (category.includes('service') || name.includes('service')) {
    return 'service';
  }
  return 'item';
}

// Helper function to extract stats from game data
function extractStats(gameColor, gameType, spawnText) {
  const stats = [];
  
  if (gameColor && gameColor !== '0' && gameColor !== '') {
    stats.push({ name: 'Color', value: gameColor });
  }
  
  if (gameType && gameType !== '0' && gameType !== '') {
    stats.push({ name: 'Type', value: gameType });
  }
  
  return stats.length > 0 ? stats : null;
}

async function migrateItems() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Step 1: Create product_categories junction table
    console.log('\n=== Step 1: Creating product_categories junction table ===');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(product_id, category_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON product_categories(product_id);
      CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON product_categories(category_id);
      CREATE INDEX IF NOT EXISTS idx_product_categories_primary ON product_categories(product_id, is_primary) WHERE is_primary = true;
    `);
    
    console.log('✅ Product_categories table created');

    // Step 2: Load categories and create mapping
    console.log('\n=== Step 2: Loading category mapping ===');
    
    // First, load category CSV to create legacy_id -> name mapping
    const legacyCategories = new Map(); // legacy_id -> name
    const categoryRows = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream('public/category.csv')
        .pipe(csv())
        .on('data', (row) => categoryRows.push(row))
        .on('end', () => {
          for (const row of categoryRows) {
            if (row.category_id && row.name) {
              legacyCategories.set(row.category_id, row.name.trim());
            }
          }
          resolve();
        })
        .on('error', reject);
    });
    
    console.log(`📋 Loaded ${legacyCategories.size} legacy categories from CSV`);
    
    // Now load current categories from database  
    const categoryMap = new Map(); // legacy_id -> { uuid, name, slug }
    const categoriesResult = await client.query('SELECT id, name, slug FROM categories');
    
    // Create mapping: legacy_id -> database category
    for (const [legacyId, legacyName] of legacyCategories.entries()) {
      // Find matching category by name (case-insensitive)
      const dbCategory = categoriesResult.rows.find(cat => 
        cat.name.toLowerCase().trim() === legacyName.toLowerCase().trim()
      );
      
      if (dbCategory) {
        categoryMap.set(legacyId, {
          uuid: dbCategory.id,
          name: dbCategory.name,
          slug: dbCategory.slug
        });
        console.log(`✅ Mapped legacy "${legacyName}" (ID: ${legacyId}) -> "${dbCategory.name}"`);
      } else {
        console.log(`⚠️  No match found for legacy category "${legacyName}" (ID: ${legacyId})`);
      }
    }
    
    console.log(`✅ Successfully mapped ${categoryMap.size} categories`);

    // Step 3: Load and process items
    console.log('\n=== Step 3: Processing items from CSV ===');
    
    const items = [];
    
    // Load items from CSV first
    await new Promise((resolve, reject) => {
      fs.createReadStream('public/item.csv')
        .pipe(csv())
        .on('data', (row) => {
          items.push(row);
        })
        .on('end', () => {
          console.log(`📋 Loaded ${items.length} items from CSV`);
          resolve();
        })
        .on('error', reject);
    });
    
        // Now process items
    let insertedCount = 0;
    let skippedCount = 0;
    let categoryRelationships = 0;
    
    for (const item of items) {
      await client.query('BEGIN');
      
      try {
        // Clean and prepare data
        const name = cleanHtmlContent(item.item_name || '').substring(0, 200);
        const slug = createSlug(name);
        const description = cleanHtmlContent(item.description || '');
        const shortDescription = cleanHtmlContent(item.tooltip_desc || '').substring(0, 500);
        const price = parsePrice(item.price);
        
        // Skip if no name or invalid price
        if (!name || name.length < 2) {
          console.log(`⚠️  Skipping item with invalid name: "${item.item_name}"`);
          skippedCount++;
          await client.query('ROLLBACK');
          continue;
        }
        
        // Get primary category
        const primaryCategoryId = item.category_id;
        const primaryCategory = categoryMap.get(primaryCategoryId);
        
        if (!primaryCategory) {
          console.log(`⚠️  Skipping item "${name}" - unknown category ID: ${primaryCategoryId}`);
          skippedCount++;
          await client.query('ROLLBACK');
          continue;
        }
        
        // Determine product type
        const type = determineProductType(primaryCategory.name, name);
        
        // Extract stats
        const stats = extractStats(item.game_color, item.game_type, item.spawn_text);
        
        // Prepare image URL
        let imageUrl = null;
        if (item.image1 && item.image1 !== '') {
          imageUrl = item.image1.startsWith('/') ? item.image1 : `/${item.image1}`;
        }
        
        // Insert product
        const productResult = await client.query(`
          INSERT INTO products (
            name, slug, description, short_description, price,
            category_id, type, item_type, spawn_location,
            stats, image_url, featured, stock_quantity,
            meta_title, meta_description, created_at
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9,
            $10, $11, $12, $13,
            $14, $15, $16
          )
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            updated_at = NOW()
          RETURNING id, slug
        `, [
          name,
          slug,
          description,
          shortDescription,
          price,
          primaryCategory.uuid, // category_id
          type,
          item.game_type || null, // item_type
          cleanHtmlContent(item.spawn_text) || null, // spawn_location
          stats ? JSON.stringify(stats) : null, // stats
          imageUrl,
          item.special === '1', // featured
          item.game_stack ? parseInt(item.game_stack) || 0 : 0, // stock_quantity
          `${name} - UO Item`, // meta_title
          shortDescription || `Buy ${name} for Ultima Online`, // meta_description
          item.date_created && item.date_created !== '0000-00-00' ? item.date_created : new Date()
        ]);
        
        const productId = productResult.rows[0].id;
        
        // Create category relationships
        const categoryIds = [
          { id: primaryCategoryId, isPrimary: true },
          { id: item.cat_also, isPrimary: false },
          { id: item.cat_third, isPrimary: false }
        ].filter(cat => cat.id && cat.id !== '0' && cat.id !== '');
        
        for (const catRef of categoryIds) {
          const category = categoryMap.get(catRef.id);
          if (category) {
            await client.query(`
              INSERT INTO product_categories (product_id, category_id, is_primary)
              VALUES ($1, $2, $3)
              ON CONFLICT (product_id, category_id) DO UPDATE SET
                is_primary = EXCLUDED.is_primary OR product_categories.is_primary
            `, [productId, category.uuid, catRef.isPrimary]);
            
            categoryRelationships++;
          }
        }
        
        await client.query('COMMIT');
        insertedCount++;
        
        if (insertedCount % 100 === 0) {
          console.log(`📦 Processed ${insertedCount} items...`);
        }
        
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Error processing item "${item.item_name}":`, error.message);
        skippedCount++;
      }
    }
    
    // Final summary
    console.log('\n=== Migration Summary ===');
    console.log(`✅ Successfully migrated: ${insertedCount} items`);
    console.log(`⚠️  Skipped: ${skippedCount} items`);
    console.log(`🔗 Category relationships: ${categoryRelationships}`);
    console.log(`📊 Total processed: ${items.length} items`);
    
    // Show category distribution
    console.log('\n=== Category Distribution ===');
    const categoryStats = await client.query(`
      SELECT c.name, COUNT(pc.product_id) as product_count
      FROM categories c
      LEFT JOIN product_categories pc ON c.id = pc.category_id
      GROUP BY c.id, c.name
      ORDER BY product_count DESC
    `);
    
    for (const stat of categoryStats.rows) {
      console.log(`${stat.name}: ${stat.product_count} products`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run migration
if (require.main === module) {
  migrateItems()
    .then(() => {
      console.log('\n🎉 Item migration completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateItems }; 