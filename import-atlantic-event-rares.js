const { Pool } = require('pg');
const { scrapeAtlanticEventRares } = require('./scrape-atlantic-event-rares');
const { uploadEventItemImages } = require('./upload-event-item-images');
require('dotenv').config();

// Utility function to create URL-friendly slugs
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
}

// Function to insert event items into database
async function insertEventItems(items) {
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    console.log('💾 Inserting event items into database...');
    
    let insertedCount = 0;
    let skippedCount = 0;
    
    for (const item of items) {
      try {
        // Check if item already exists
        const existingItem = await pool.query(`
          SELECT id FROM event_items WHERE slug = $1
        `, [item.slug]);
        
        if (existingItem.rows.length > 0) {
          console.log(`⏭️ Skipping existing item: ${item.name}`);
          skippedCount++;
          continue;
        }
        
        // Insert new item
        await pool.query(`
          INSERT INTO event_items (
            name, slug, description, season_number, season_name, 
            event_year, event_type, shard, original_image_url, 
            item_type, hue_number, graphic_number, status, rarity_level
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          item.name,
          item.slug,
          item.description,
          item.seasonNumber,
          item.seasonName,
          item.eventYear,
          item.eventType,
          item.shard,
          item.originalImageUrl,
          item.itemType,
          item.hueNumber,
          item.graphicNumber,
          item.status,
          item.rarityLevel
        ]);
        
        console.log(`✅ Inserted: ${item.name}`);
        insertedCount++;
        
      } catch (error) {
        console.error(`❌ Error inserting ${item.name}:`, error.message);
      }
    }
    
    console.log(`\n📊 Database Insert Summary:`);
    console.log(`✅ New items inserted: ${insertedCount}`);
    console.log(`⏭️ Items skipped (already exist): ${skippedCount}`);
    
    return { insertedCount, skippedCount };
    
  } catch (error) {
    console.error('❌ Error in database insertion:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Function to get import statistics
async function getImportStats() {
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN cloudinary_url IS NOT NULL THEN 1 END) as items_with_images,
        COUNT(CASE WHEN cloudinary_url IS NULL THEN 1 END) as items_without_images,
        COUNT(DISTINCT season_number) as total_seasons,
        COUNT(DISTINCT item_type) as total_item_types,
        MIN(season_number) as earliest_season,
        MAX(season_number) as latest_season
      FROM event_items
    `);
    
    return stats.rows[0];
    
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    return null;
  } finally {
    await pool.end();
  }
}

// Main import function
async function importAtlanticEventRares() {
  try {
    console.log('🚀 Starting Atlantic Event Rares Import Process...\n');
    
    // Step 1: Scrape data from HTML
    console.log('📋 Step 1: Scraping data from HTML file...');
    const scrapedItems = scrapeAtlanticEventRares();
    
    if (scrapedItems.length === 0) {
      console.log('❌ No items found to import');
      return;
    }
    
    console.log(`✅ Scraped ${scrapedItems.length} items\n`);
    
    // Step 2: Insert items into database
    console.log('💾 Step 2: Inserting items into database...');
    const insertResult = await insertEventItems(scrapedItems);
    
    if (insertResult.insertedCount === 0) {
      console.log('⚠️ No new items were inserted');
    } else {
      console.log(`✅ Inserted ${insertResult.insertedCount} new items\n`);
    }
    
    // Step 3: Upload images to Cloudinary
    console.log('🖼️ Step 3: Uploading images to Cloudinary...');
    await uploadEventItemImages();
    
    // Step 4: Get final statistics
    console.log('\n📊 Step 4: Generating import statistics...');
    const stats = await getImportStats();
    
    if (stats) {
      console.log('\n🎉 Import Process Complete!');
      console.log('📈 Final Statistics:');
      console.log(`   Total items: ${stats.total_items}`);
      console.log(`   Items with images: ${stats.items_with_images}`);
      console.log(`   Items without images: ${stats.items_without_images}`);
      console.log(`   Total seasons: ${stats.total_seasons}`);
      console.log(`   Total item types: ${stats.total_item_types}`);
      console.log(`   Season range: ${stats.earliest_season} - ${stats.latest_season}`);
      
      const imageCompletionRate = ((stats.items_with_images / stats.total_items) * 100).toFixed(1);
      console.log(`   Image completion rate: ${imageCompletionRate}%`);
    }
    
  } catch (error) {
    console.error('❌ Error in import process:', error);
  }
}

// Function to run a dry run (scrape only, no database operations)
async function dryRun() {
  console.log('🧪 Running dry run (scrape only)...\n');
  
  const scrapedItems = scrapeAtlanticEventRares();
  
  console.log('\n📊 Dry Run Results:');
  console.log(`Total items found: ${scrapedItems.length}`);
  
  // Group by season
  const seasonGroups = {};
  scrapedItems.forEach(item => {
    if (!seasonGroups[item.seasonName]) {
      seasonGroups[item.seasonName] = [];
    }
    seasonGroups[item.seasonName].push(item);
  });
  
  console.log('\n📅 Items by Season:');
  Object.keys(seasonGroups).sort().forEach(season => {
    console.log(`  ${season}: ${seasonGroups[season].length} items`);
  });
  
  // Group by item type
  const typeGroups = {};
  scrapedItems.forEach(item => {
    if (!typeGroups[item.itemType]) {
      typeGroups[item.itemType] = [];
    }
    typeGroups[item.itemType].push(item);
  });
  
  console.log('\n🎭 Items by Type:');
  Object.keys(typeGroups).sort().forEach(type => {
    console.log(`  ${type}: ${typeGroups[type].length} items`);
  });
  
  console.log('\n📝 Sample items:');
  scrapedItems.slice(0, 5).forEach(item => {
    console.log(`  - ${item.name} (${item.seasonName}, ${item.itemType})`);
  });
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--dry-run') || args.includes('-d')) {
    dryRun();
  } else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 Atlantic Event Rares Import Tool

Usage:
  node import-atlantic-event-rares.js [options]

Options:
  --dry-run, -d    Run scrape only, no database operations
  --help, -h       Show this help message

Examples:
  node import-atlantic-event-rares.js          # Full import process
  node import-atlantic-event-rares.js --dry-run # Scrape and preview only
    `);
  } else {
    importAtlanticEventRares();
  }
}

module.exports = { 
  importAtlanticEventRares, 
  dryRun, 
  getImportStats 
};
