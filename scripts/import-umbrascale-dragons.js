#!/usr/bin/env node

/**
 * Import Umbrascale Dragons products from competitor
 * Creates categories and products with images from uostock.com
 */

const { Pool } = require('pg');
const { v2: cloudinary } = require('cloudinary');
const https = require('https');
const http = require('http');

// Database configuration
const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dngclyzkj',
  api_key: '827585767246395',
  api_secret: 'q4JyvKJGRoyoI0AJ3fxgR8p8nNA'
});

// Product data from competitor
const MATURE_EGGS = [
  { name: 'Mature Umbrascale Egg - Slimes #6', price: 69.99, hue: '#2206', image: 'egg_2206_slimes_6.png' },
  { name: 'Mature Umbrascale Egg - Birds #18', price: 69.99, hue: '#2118', image: 'egg_2118_birds_18.png' },
  { name: 'Mature Umbrascale Egg - Dark Red', price: 69.99, hue: '#1157', image: 'egg_1157_dark_red.png' },
  { name: 'Mature Umbrascale Egg - Royal Red', price: 69.99, hue: '#2772', image: 'egg_2772_royal_red.png' },
  { name: 'Mature Umbrascale Egg - Bloodwood', price: 69.99, hue: '#1194', image: 'egg_1194_bloodwood.png' },
  { name: 'Mature Umbrascale Egg - Unnamed Dark Red', price: 69.99, hue: '#2749', image: 'egg_2749_unnamed_dark_red.png' },
  { name: 'Mature Umbrascale Egg - Umbrascale Purple', price: 69.99, hue: '#2783', image: 'egg_2783_event_umbrascale_purple.png' },
  { name: 'Mature Umbrascale Egg - Umbrascale Blue', price: 69.99, hue: '#2784', image: 'egg_2784_event_umbrascale_blue.png' },
  { name: 'Mature Umbrascale Egg - Umbrascale Red', price: 69.99, hue: '#2785', image: 'egg_2785_umbrascale_red.png' },
  { name: 'Mature Umbrascale Egg - Default Red', price: 79.99, hue: '#0', image: 'egg_0_default_red_dragon.png' },
  { name: 'Mature Umbrascale Egg - Shogun Steel', price: 169.99, hue: '#2764', image: 'egg_2764_shogun_shadowed_steel.png' },
  { name: 'Mature Umbrascale Egg - Gargoyle Skin', price: 215.99, hue: '#1755', image: 'egg_1755_gargoyle_skin_hue_01.png' },
  { name: 'Mature Umbrascale Egg - Blue Grey', price: 314.99, hue: '#2715', image: 'egg_2715_blue_grey.png' },
  { name: 'Mature Umbrascale Egg - Decayed Moss', price: 359.99, hue: '#2768', image: 'egg_2768_decayed_moss.png' },
  { name: 'Mature Umbrascale Egg - White/Light Grey', price: 449.99, hue: '#2500', image: 'egg_2500_unnamed_white_light_grey.png' },
  { name: 'Mature Umbrascale Egg - Spring Breeze', price: 499.99, hue: '#2767', image: 'egg_2767_spring_breeze.png' }
];

const ETHEREAL_STATUETTES = [
  { name: 'Ethereal Juvenile Umbrascale Statuette - Slimes #6', price: 69.99, hue: '#2206', image: 'statuette_2206_slimes_6.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Birds #18', price: 69.99, hue: '#2118', image: 'statuette_2118_birds_18.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Dark Red', price: 69.99, hue: '#1157', image: 'statuette_1157_dark_red.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Royal Red', price: 69.99, hue: '#2772', image: 'statuette_2772_royal_red.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Bloodwood', price: 69.99, hue: '#1194', image: 'statuette_1194_bloodwood.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Unnamed Dark Red', price: 69.99, hue: '#2749', image: 'statuette_2749_unnamed_dark_red.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Umbrascale Purple', price: 69.99, hue: '#2783', image: 'statuette_2783_event_umbrascale_purple.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Umbrascale Blue', price: 69.99, hue: '#2784', image: 'statuette_2784_event_umbrascale_blue.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Umbrascale Red', price: 69.99, hue: '#2785', image: 'statuette_2785_umbrascale_red.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Default Red', price: 79.99, hue: '#0', image: 'statuette_0_default_red_dragon.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Shogun Steel', price: 169.99, hue: '#2764', image: 'statuette_2764_shogun_shadowed_steel.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Gargoyle Skin', price: 215.99, hue: '#1755', image: 'statuette_1755_gargoyle_skin_hue_01.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Blue Grey', price: 314.99, hue: '#2715', image: 'statuette_2715_blue_grey.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Decayed Moss', price: 359.99, hue: '#2768', image: 'statuette_2768_decayed_moss.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - White/Light Grey', price: 449.99, hue: '#2500', image: 'statuette_2500_unnamed_white_light_grey.png' },
  { name: 'Ethereal Juvenile Umbrascale Statuette - Spring Breeze', price: 499.99, hue: '#2767', image: 'statuette_2767_spring_breeze.png' }
];

const COMPETITOR_BASE_URL = 'https://www.uostock.com';
const IMAGE_PATH = '/admin/itemImages/dragons/';

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

// Fetch image from URL and return as buffer
async function fetchImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*',
        'Referer': COMPETITOR_BASE_URL
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        fetchImage(response.headers.location).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch image: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Upload buffer to Cloudinary
async function uploadToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'uoking/umbrascale-dragons',
        public_id: publicId,
        resource_type: 'image',
        overwrite: true
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

// Create category
async function createCategory(name, description) {
  const slug = generateSlug(name);

  // Check if category already exists
  const existing = await pool.query('SELECT id FROM categories WHERE slug = $1', [slug]);
  if (existing.rows.length > 0) {
    console.log(`  Category "${name}" already exists, using existing...`);
    return existing.rows[0].id;
  }

  const result = await pool.query(`
    INSERT INTO categories (name, slug, description, is_active, sort_order)
    VALUES ($1, $2, $3, true, 0)
    RETURNING id
  `, [name, slug, description]);

  console.log(`  Created category: ${name}`);
  return result.rows[0].id;
}

// Create product
async function createProduct(productData, categoryId, imageUrl) {
  const slug = generateSlug(productData.name);

  // Check if product already exists
  const existing = await pool.query('SELECT id FROM products WHERE slug = $1', [slug]);
  if (existing.rows.length > 0) {
    console.log(`    Product "${productData.name}" already exists, skipping...`);
    return null;
  }

  const description = `Hue: ${productData.hue}`;

  const result = await pool.query(`
    INSERT INTO products (name, slug, description, price, image_url, status, requires_shard, requires_character_name)
    VALUES ($1, $2, $3, $4, $5, 'active', true, true)
    RETURNING id
  `, [productData.name, slug, description, productData.price, imageUrl || '']);

  const productId = result.rows[0].id;

  // Link to category
  await pool.query(`
    INSERT INTO product_categories (product_id, category_id, sort_order, is_primary)
    VALUES ($1, $2, 0, true)
  `, [productId, categoryId]);

  return productId;
}

// Main import function
async function importProducts() {
  console.log('=== Umbrascale Dragons Import ===\n');

  try {
    // Create categories
    console.log('Creating categories...');
    const eggsCategory = await createCategory(
      'Mature Umbrascale Eggs',
      'Hatchable Umbrascale Dragon eggs. Can be hatched as a trainable pet or converted to a statuette.'
    );
    const statuettesCategory = await createCategory(
      'Ethereal Umbrascale Statuettes',
      'Ethereal Umbrascale vanity mounts. Requires only 1 follower slot and cannot be killed.'
    );

    console.log('\nImporting Mature Umbrascale Eggs...');
    let successCount = 0;
    let failCount = 0;

    for (const egg of MATURE_EGGS) {
      try {
        process.stdout.write(`  Processing: ${egg.name}...`);

        // Try to fetch and upload image
        let imageUrl = '';
        try {
          const imageBuffer = await fetchImage(`${COMPETITOR_BASE_URL}${IMAGE_PATH}${egg.image}`);
          const publicId = generateSlug(egg.name);
          imageUrl = await uploadToCloudinary(imageBuffer, publicId);
          process.stdout.write(' [image OK]');
        } catch (imgError) {
          process.stdout.write(' [image FAILED]');
        }

        const productId = await createProduct(egg, eggsCategory, imageUrl);
        if (productId) {
          console.log(' CREATED');
          successCount++;
        } else {
          console.log(' SKIPPED (exists)');
        }
      } catch (error) {
        console.log(` FAILED: ${error.message}`);
        failCount++;
      }
    }

    console.log('\nImporting Ethereal Statuettes...');

    for (const statuette of ETHEREAL_STATUETTES) {
      try {
        process.stdout.write(`  Processing: ${statuette.name}...`);

        // Try to fetch and upload image
        let imageUrl = '';
        try {
          const imageBuffer = await fetchImage(`${COMPETITOR_BASE_URL}${IMAGE_PATH}${statuette.image}`);
          const publicId = generateSlug(statuette.name);
          imageUrl = await uploadToCloudinary(imageBuffer, publicId);
          process.stdout.write(' [image OK]');
        } catch (imgError) {
          process.stdout.write(' [image FAILED]');
        }

        const productId = await createProduct(statuette, statuettesCategory, imageUrl);
        if (productId) {
          console.log(' CREATED');
          successCount++;
        } else {
          console.log(' SKIPPED (exists)');
        }
      } catch (error) {
        console.log(` FAILED: ${error.message}`);
        failCount++;
      }
    }

    console.log('\n=== Import Complete ===');
    console.log(`Created: ${successCount} products`);
    console.log(`Failed: ${failCount} products`);

  } catch (error) {
    console.error('Import error:', error);
  } finally {
    await pool.end();
  }
}

// Run import
importProducts();
