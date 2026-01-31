#!/usr/bin/env node

/**
 * Create PVP Suits category
 * Run this first to get the category ID for the cron script
 */

const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

// Generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function createCategory() {
  try {
    console.log('=== Creating PVP Suits Category ===\n');

    const categoryName = 'PVP Suits';
    const categorySlug = generateSlug(categoryName);
    const categoryDescription = `Complete PVP gear sets for Ultima Online - optimized bundles for templars, mages, archers and dexxers. Meta-ready kits with best-in-slot weapons, armor and jewelry.`;

    // Check if category exists
    const existing = await pool.query(
      'SELECT id FROM categories WHERE slug = $1',
      [categorySlug]
    );

    if (existing.rows.length > 0) {
      console.log(`✓ Category "${categoryName}" already exists`);
      console.log(`  Category ID: ${existing.rows[0].id}`);
      console.log(`  Slug: ${categorySlug}`);
      console.log('\n=== Done ===');
      console.log(`\nUse this Category ID in sync-pvp-suits.js:`);
      console.log(`const PVP_SUITS_CATEGORY_ID = '${existing.rows[0].id}';`);
      return existing.rows[0].id;
    }

    // Create category
    const result = await pool.query(`
      INSERT INTO categories (name, slug, description, is_active, sort_order)
      VALUES ($1, $2, $3, true, 0)
      RETURNING id
    `, [categoryName, categorySlug, categoryDescription]);

    const categoryId = result.rows[0].id;

    console.log(`✓ Created category: ${categoryName}`);
    console.log(`  Category ID: ${categoryId}`);
    console.log(`  Slug: ${categorySlug}`);
    console.log('\n=== Done ===');
    console.log(`\nUse this Category ID in sync-pvp-suits.js:`);
    console.log(`const PVP_SUITS_CATEGORY_ID = '${categoryId}';`);

    return categoryId;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

createCategory();
