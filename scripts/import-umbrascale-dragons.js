#!/usr/bin/env node

/**
 * Import Umbrascale Dragons products from competitor
 * Creates categories and products with images from uostock.com
 */

const { Pool } = require('pg');
const { v2: cloudinary } = require('cloudinary');
const https = require('https');
const http = require('http');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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

// Image layering configuration
const BACKGROUND_IMAGE_PATH = path.join(__dirname, '..', 'container.png'); // Path to background image
const USE_BACKGROUND_LAYER = true; // Set to false to skip layering
const TEMP_IMAGE_FOLDER = path.join(__dirname, '..', 'temp-images'); // Temporary folder for processed images

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

// Layer item image on top of background image
async function layerImageOnBackground(itemImageBuffer, outputPath) {
  try {
    // Ensure temp folder exists
    if (!fs.existsSync(TEMP_IMAGE_FOLDER)) {
      fs.mkdirSync(TEMP_IMAGE_FOLDER, { recursive: true });
    }

    // Check if background image exists
    if (!fs.existsSync(BACKGROUND_IMAGE_PATH)) {
      console.warn(`  ⚠️  Background image not found at ${BACKGROUND_IMAGE_PATH}, skipping layering`);
      return itemImageBuffer;
    }

    // Load background and item images
    const background = sharp(BACKGROUND_IMAGE_PATH);
    const itemImage = sharp(itemImageBuffer);

    // Get dimensions
    const bgMetadata = await background.metadata();
    const itemMetadata = await itemImage.metadata();

    const bgWidth = bgMetadata.width;
    const bgHeight = bgMetadata.height;
    const itemWidth = itemMetadata.width;
    const itemHeight = itemMetadata.height;

    // Calculate position: center horizontally, offset Y by 20% downward
    const x = Math.floor((bgWidth - itemWidth) / 2);
    const y = Math.floor((bgHeight - itemHeight) / 2 + (bgHeight * 0.2));

    // Composite the item image on the background
    const compositeBuffer = await background
      .composite([
        {
          input: await itemImage.toBuffer(),
          left: x,
          top: y
        }
      ])
      .png()
      .toBuffer();

    // Save to temp file if output path provided
    if (outputPath) {
      fs.writeFileSync(outputPath, compositeBuffer);
    }

    return compositeBuffer;
  } catch (error) {
    console.warn(`  ⚠️  Error layering image: ${error.message}, using original`);
    return itemImageBuffer;
  }
}

// Create category image from up to 5 product images evenly spaced
async function createCategoryImage(productImageUrls, categoryName) {
  try {
    // Check if background image exists
    if (!fs.existsSync(BACKGROUND_IMAGE_PATH)) {
      console.warn(`  ⚠️  Background image not found, cannot create category image`);
      return null;
    }

    if (!productImageUrls || productImageUrls.length === 0) {
      console.warn(`  ⚠️  No product images provided for category image`);
      return null;
    }

    // Load background
    const background = sharp(BACKGROUND_IMAGE_PATH);
    const bgMetadata = await background.metadata();
    const bgWidth = bgMetadata.width;
    const bgHeight = bgMetadata.height;

    // Fetch and prepare up to 5 product images
    const imageInputs = [];
    const imageCount = Math.min(5, productImageUrls.length);

    for (let i = 0; i < imageCount; i++) {
      try {
        // Fetch image from URL (could be Cloudinary or other URL)
        const imageBuffer = await fetchImage(productImageUrls[i]);
        const itemImage = sharp(imageBuffer);
        const itemMetadata = await itemImage.metadata();
        const itemWidth = itemMetadata.width;
        const itemHeight = itemMetadata.height;

        // Calculate Y position (center vertically, offset by 20% downward)
        const y = Math.floor((bgHeight - itemHeight) / 2 + (bgHeight * 0.2));

        // Calculate X positions: images positioned evenly relative to center
        let x;
        if (imageCount === 1) {
          // Single image: center
          x = Math.floor((bgWidth - itemWidth) / 2);
        } else if (imageCount === 2) {
          // Two images: spaced evenly with gap
          const totalWidth = itemWidth * 2 + 10; // 2 images + 10px gap
          const startX = Math.floor((bgWidth - totalWidth) / 2);
          x = startX + (i * (itemWidth + 10));
        } else if (imageCount === 3) {
          // Three images: center point of each image positioned
          const centerPoint = bgWidth / 2;
          if (i === 0) {
            // Left image: center point 10px left of center
            x = Math.floor(centerPoint - itemWidth / 2 - 10);
          } else if (i === 1) {
            // Center image: center point at center
            x = Math.floor(centerPoint - itemWidth / 2);
          } else {
            // Right image: center point 10px right of center
            x = Math.floor(centerPoint - itemWidth / 2 + 10);
          }
        } else if (imageCount === 4) {
          // Four images: evenly spaced
          const spacing = 15; // spacing between center points
          const centerPoint = bgWidth / 2;
          // Positions: -1.5, -0.5, +0.5, +1.5 spacings from center
          const offset = (i - 1.5) * spacing;
          x = Math.floor(centerPoint - itemWidth / 2 + offset);
        } else {
          // Five images: evenly spaced
          const spacing = 20; // spacing between center points
          const centerPoint = bgWidth / 2;
          // Positions: -2, -1, 0, +1, +2 spacings from center
          const offset = (i - 2) * spacing;
          x = Math.floor(centerPoint - itemWidth / 2 + offset);
        }

        imageInputs.push({
          input: await itemImage.toBuffer(),
          left: Math.max(0, x),  // Ensure x is not negative
          top: y
        });
        console.log(`    ✓ Image ${i + 1} positioned at (${x}, ${y})`);
      } catch (error) {
        console.warn(`  ⚠️  Could not fetch product image ${i + 1} from ${productImageUrls[i]}: ${error.message}`);
      }
    }

    if (imageInputs.length === 0) {
      console.warn(`  ⚠️  No valid product images to create category image`);
      return null;
    }

    console.log(`  Compositing ${imageInputs.length} images on background...`);
    
    // Composite all images on the background
    const categoryImageBuffer = await background
      .composite(imageInputs)
      .png()
      .toBuffer();

    console.log(`  Uploading category image to Cloudinary...`);
    
    // Upload to Cloudinary
    const publicId = `category-${generateSlug(categoryName)}`;
    const imageUrl = await uploadToCloudinary(categoryImageBuffer, publicId);

    console.log(`  ✓ Category image uploaded: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error(`  ❌ Error creating category image: ${error.message}`);
    console.error(`  Stack: ${error.stack}`);
    return null;
  }
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
async function createCategory(name, description, categoryImageUrl = null) {
  const slug = generateSlug(name);

  // Check if category already exists
  const existing = await pool.query('SELECT id FROM categories WHERE slug = $1', [slug]);
  if (existing.rows.length > 0) {
    console.log(`  Category "${name}" already exists, using existing...`);
    
    // Update category image if provided
    if (categoryImageUrl) {
      await pool.query(`
        UPDATE categories 
        SET image_url = $1, updated_at = NOW()
        WHERE id = $2
      `, [categoryImageUrl, existing.rows[0].id]);
      console.log(`  Updated category image for "${name}"`);
    }
    
    return existing.rows[0].id;
  }

  const result = await pool.query(`
    INSERT INTO categories (name, slug, description, image_url, is_active, sort_order)
    VALUES ($1, $2, $3, $4, true, 0)
    RETURNING id
  `, [name, slug, description, categoryImageUrl || '']);

  console.log(`  Created category: ${name}`);
  return result.rows[0].id;
}

// Create or update product
async function createProduct(productData, categoryId, imageUrl) {
  const slug = generateSlug(productData.name);

  // Check if product already exists
  const existing = await pool.query('SELECT id FROM products WHERE slug = $1', [slug]);
  
  const description = `Hue: ${productData.hue}`;

  if (existing.rows.length > 0) {
    // Product exists - update it (especially the image)
    const productId = existing.rows[0].id;
    
    // Update product with new image and any other changes
    await pool.query(`
      UPDATE products 
      SET description = $1, 
          price = $2, 
          image_url = $3,
          updated_at = NOW()
      WHERE id = $4
    `, [description, productData.price, imageUrl || '', productId]);
    
    // Check if category link exists, create if not
    const categoryLink = await pool.query(
      'SELECT id FROM product_categories WHERE product_id = $1 AND category_id = $2',
      [productId, categoryId]
    );
    
    if (categoryLink.rows.length === 0) {
      await pool.query(`
        INSERT INTO product_categories (product_id, category_id, sort_order, is_primary)
        VALUES ($1, $2, 0, true)
      `, [productId, categoryId]);
    }
    
    return { id: productId, isUpdate: true };
  }

  // Product doesn't exist - create it
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

  return { id: productId, isUpdate: false };
}

// Main import function
async function importProducts() {
  console.log('=== Umbrascale Dragons Import ===\n');
  
  // Check background image if layering is enabled
  if (USE_BACKGROUND_LAYER) {
    if (!fs.existsSync(BACKGROUND_IMAGE_PATH)) {
      console.warn(`⚠️  WARNING: Background image not found at: ${BACKGROUND_IMAGE_PATH}`);
      console.warn('   Place your container.png file in the project root directory.');
      console.warn('   Or update BACKGROUND_IMAGE_PATH in the script.\n');
    } else {
      console.log(`✓ Background image found: ${BACKGROUND_IMAGE_PATH}\n`);
    }
  }

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
    const eggImageUrls = []; // Store ORIGINAL uostock image URLs for category image

    for (const egg of MATURE_EGGS) {
      try {
        process.stdout.write(`  Processing: ${egg.name}...`);

        // Try to fetch, layer, and upload image
        let imageUrl = '';
        const originalImageUrl = `${COMPETITOR_BASE_URL}${IMAGE_PATH}${egg.image}`;
        try {
          let imageBuffer = await fetchImage(originalImageUrl);
          
          // Layer image on background if enabled
          if (USE_BACKGROUND_LAYER) {
            const tempPath = path.join(TEMP_IMAGE_FOLDER, `${generateSlug(egg.name)}.png`);
            imageBuffer = await layerImageOnBackground(imageBuffer, tempPath);
            process.stdout.write(' [layered]');
          }
          
          const publicId = generateSlug(egg.name);
          imageUrl = await uploadToCloudinary(imageBuffer, publicId);
          process.stdout.write(' [image OK]');
          
          // Store ORIGINAL uostock URL for category image (up to 5, no container.png yet)
          if (eggImageUrls.length < 5) {
            eggImageUrls.push(originalImageUrl);
          }
        } catch (imgError) {
          process.stdout.write(' [image FAILED]');
        }

        const result = await createProduct(egg, eggsCategory, imageUrl);
        if (result) {
          console.log(result.isUpdate ? ' UPDATED' : ' CREATED');
          successCount++;
        } else {
          console.log(' SKIPPED');
        }
      } catch (error) {
        console.log(` FAILED: ${error.message}`);
        failCount++;
      }
    }

    // Create category image for eggs using ORIGINAL uostock images
    console.log(`\n📸 Category image: Found ${eggImageUrls.length} original product images from uostock`);
    
    if (eggImageUrls.length > 0) {
      console.log(`\nCreating category image for Mature Umbrascale Eggs using ${eggImageUrls.length} images on 1 container.png (evenly spaced)...`);
      const categoryImageUrl = await createCategoryImage(eggImageUrls, 'Mature Umbrascale Eggs');
      if (categoryImageUrl) {
        await pool.query(`
          UPDATE categories 
          SET image_url = $1, updated_at = NOW()
          WHERE id = $2
        `, [categoryImageUrl, eggsCategory]);
        console.log('  ✓ Category image created and updated');
      } else {
        console.log('  ✗ Failed to create category image');
      }
    } else {
      console.log('  ⚠️  No product images available to create category image');
    }

    console.log('\nImporting Ethereal Statuettes...');
    const statuetteImageUrls = []; // Store ORIGINAL uostock image URLs for category image

    for (const statuette of ETHEREAL_STATUETTES) {
      try {
        process.stdout.write(`  Processing: ${statuette.name}...`);

        // Try to fetch, layer, and upload image
        let imageUrl = '';
        const originalImageUrl = `${COMPETITOR_BASE_URL}${IMAGE_PATH}${statuette.image}`;
        try {
          let imageBuffer = await fetchImage(originalImageUrl);
          
          // Layer image on background if enabled
          if (USE_BACKGROUND_LAYER) {
            const tempPath = path.join(TEMP_IMAGE_FOLDER, `${generateSlug(statuette.name)}.png`);
            imageBuffer = await layerImageOnBackground(imageBuffer, tempPath);
            process.stdout.write(' [layered]');
          }
          
          const publicId = generateSlug(statuette.name);
          imageUrl = await uploadToCloudinary(imageBuffer, publicId);
          process.stdout.write(' [image OK]');
          
          // Store ORIGINAL uostock URL for category image (up to 5, no container.png yet)
          if (statuetteImageUrls.length < 5) {
            statuetteImageUrls.push(originalImageUrl);
          }
        } catch (imgError) {
          process.stdout.write(' [image FAILED]');
        }

        const result = await createProduct(statuette, statuettesCategory, imageUrl);
        if (result) {
          console.log(result.isUpdate ? ' UPDATED' : ' CREATED');
          successCount++;
        } else {
          console.log(' SKIPPED');
        }
      } catch (error) {
        console.log(` FAILED: ${error.message}`);
        failCount++;
      }
    }

    // Create category image for statuettes using ORIGINAL uostock images
    console.log(`\n📸 Category image: Found ${statuetteImageUrls.length} original product images from uostock`);
    
    if (statuetteImageUrls.length > 0) {
      console.log(`\nCreating category image for Ethereal Umbrascale Statuettes using ${statuetteImageUrls.length} images on 1 container.png (evenly spaced)...`);
      const categoryImageUrl = await createCategoryImage(statuetteImageUrls, 'Ethereal Umbrascale Statuettes');
      if (categoryImageUrl) {
        await pool.query(`
          UPDATE categories 
          SET image_url = $1, updated_at = NOW()
          WHERE id = $2
        `, [categoryImageUrl, statuettesCategory]);
        console.log('  ✓ Category image created and updated');
      } else {
        console.log('  ✗ Failed to create category image');
      }
    } else {
      console.log('  ⚠️  No product images available to create category image');
    }

    console.log('\n=== Import Complete ===');
    console.log(`Created: ${successCount} products`);
    console.log(`Failed: ${failCount} products`);

    // Cleanup temp images if they exist
    if (USE_BACKGROUND_LAYER && fs.existsSync(TEMP_IMAGE_FOLDER)) {
      try {
        const files = fs.readdirSync(TEMP_IMAGE_FOLDER);
        files.forEach(file => {
          fs.unlinkSync(path.join(TEMP_IMAGE_FOLDER, file));
        });
        fs.rmdirSync(TEMP_IMAGE_FOLDER);
        console.log('\nCleaned up temporary images');
      } catch (cleanupError) {
        console.warn('\nCould not clean up temp images:', cleanupError.message);
      }
    }

  } catch (error) {
    console.error('Import error:', error);
  } finally {
    await pool.end();
  }
}

// Run import
importProducts();
