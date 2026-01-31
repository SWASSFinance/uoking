#!/usr/bin/env node

/**
 * Sync PVP Suits products from competitor (uowts.com)
 * Scrapes product listings, syncs to database, uploads images to Cloudinary
 * 
 * Run this script daily via cron to keep products up-to-date
 * 
 * IMPORTANT: Run create-pvp-suits-category.js first to get the category ID,
 * then update PVP_SUITS_CATEGORY_ID below
 */

const { Pool } = require('pg');
const { v2: cloudinary } = require('cloudinary');
const https = require('https');
const http = require('http');
const cheerio = require('cheerio');

// ===== CONFIGURATION =====
const PVP_SUITS_CATEGORY_ID = 'b3fb7231-6ca8-44c0-97f2-b95220682356';
const COMPETITOR_BASE_URL = 'https://uowts.com';
const CATEGORY_PAGE_URL = 'https://uowts.com/items/pvp-suites';

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

// ===== UTILITY FUNCTIONS =====

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

// Fetch HTML from URL
async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        const redirectUrl = response.headers.location.startsWith('http') 
          ? response.headers.location 
          : `${COMPETITOR_BASE_URL}${response.headers.location}`;
        fetchHTML(redirectUrl).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch: ${response.statusCode}`));
        return;
      }

      let html = '';
      response.on('data', chunk => html += chunk);
      response.on('end', () => resolve(html));
      response.on('error', reject);
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
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
        folder: 'uoking/pvp-suits',
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

// Parse HTML to extract product URLs from category page
function extractProductUrls(html) {
  const $ = cheerio.load(html);
  const products = [];
  const seen = new Set();
  
  // Look for product links in WooCommerce product listings
  // For uowts.com, products are under /items/ path
  const selectors = [
    'a.woocommerce-LoopProduct-link',
    'h2.woocommerce-loop-product__title a',
    'a[href*="/items/pvp-"]',
    'a[href*="/product/pvp-"]',
    '.products a',
    '.product a'
  ];
  
  selectors.forEach(selector => {
    $(selector).each((i, elem) => {
      let url = $(elem).attr('href');
      
      if (!url) return;
      
      // Skip non-product URLs
      if (url.includes('add-to-cart') || 
          url.includes('/cart') || 
          url.includes('/checkout') ||
          url.includes('/my-account') ||
          url.includes('/shop') ||
          url === '#' ||
          url === '') {
        return;
      }
      
      // Must be an item or product page (contains pvp- but NOT the category page itself)
      if (!url.includes('/items/pvp-') && !url.includes('/product/pvp-')) {
        return;
      }
      
      // Skip if it's the category page itself (/items/pvp-suites or /items/pvp-suites/)
      const normalizedUrl = url.replace(/\/$/, '');
      if (normalizedUrl === `${COMPETITOR_BASE_URL}/items/pvp-suites` ||
          normalizedUrl === CATEGORY_PAGE_URL) {
        return;
      }
      
      // Convert relative URLs to absolute
      if (!url.startsWith('http')) {
        url = url.startsWith('/') ? `${COMPETITOR_BASE_URL}${url}` : `${COMPETITOR_BASE_URL}/${url}`;
      }
      
      // Normalize URL (remove trailing slash and query params)
      url = url.replace(/\/$/, '').split('?')[0].split('#')[0];
      
      // Only add unique URLs
      if (!seen.has(url)) {
        seen.add(url);
        products.push(url);
      }
    });
  });
  
  // If no products found with selectors, try extracting from all links
  if (products.length === 0) {
    // Look for any links in the HTML that point to pvp product pages
    $('a').each((i, elem) => {
      let url = $(elem).attr('href');
      if (!url) return;
      
      // Check if it's a PVP product URL
      if ((url.includes('/items/pvp-') || url.includes('/product/pvp-')) && 
          !url.includes('add-to-cart') && 
          !url.includes('?') &&
          !url.includes('#')) {
        
        if (!url.startsWith('http')) {
          url = url.startsWith('/') ? `${COMPETITOR_BASE_URL}${url}` : `${COMPETITOR_BASE_URL}/${url}`;
        }
        
        url = url.replace(/\/$/, '');
        
        // Skip if it's the category page itself
        if (url === CATEGORY_PAGE_URL || url === `${CATEGORY_PAGE_URL}/`) {
          return;
        }
        
        if (!seen.has(url)) {
          seen.add(url);
          products.push(url);
        }
      }
    });
  }
  
  // Filter out the category page URL itself if it got through
  return products.filter(url => {
    const normalized = url.replace(/\/$/, '');
    return normalized !== CATEGORY_PAGE_URL && 
           !normalized.endsWith('/pvp-suites') &&
           !normalized.endsWith('/pvp-suites/');
  });
  
  return products;
}

// Scrape product details from product page
async function scrapeProductDetails(productUrl) {
  try {
    const html = await fetchHTML(productUrl);
    const $ = cheerio.load(html);
    
    const product = {
      sourceUrl: productUrl,
      name: '',
      price: 0,
      description: '',
      shortDescription: '',
      images: []
    };

    // Extract product name from title element or h1
    const $title = $('.product_title, h1.product-title, h1.entry-title').first();
    if ($title.length) {
      product.name = $title.text()
        .replace(/\s*–\s*UOWTS\.COM/i, '')
        .replace(/\s*\|\s*UOWTS\.COM/i, '')
        .replace(/\s*-\s*UOWTS\.COM/i, '')
        .trim();
    } else {
      // Fallback to page title
      const pageTitle = $('title').text();
      if (pageTitle) {
        product.name = pageTitle
          .split('–')[0]
          .split('|')[0]
          .trim();
      }
    }

    // Extract price from WooCommerce price elements
    const $price = $('.woocommerce-Price-amount bdi, .price .amount bdi, .price ins .amount').first();
    if ($price.length) {
      const priceText = $price.text().replace(/[^0-9.]/g, '');
      product.price = parseFloat(priceText) || 0;
    } else {
      // Fallback: search for any price pattern
      const priceMatch = html.match(/\$(\d+(?:\.\d{2})?)/);
      if (priceMatch) {
        product.price = parseFloat(priceMatch[1]);
      }
    }

    // Extract short description
    const $shortDesc = $('.woocommerce-product-details__short-description').first();
    if ($shortDesc.length) {
      product.shortDescription = $shortDesc.text()
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200);
    }

    // IMPORTANT: ONLY extract images from the DESCRIPTION tab, NOT the product gallery
    // The product gallery has watermarked images with the competitor's logo
    const $fullDesc = $('#tab-description, .woocommerce-Tabs-panel--description, .woocommerce-Tabs-panel[role="tabpanel"]').first();
    if ($fullDesc.length) {
      // Get the full HTML content (preserves images, line breaks, etc.)
      let descHtml = $fullDesc.html() || '';
      
      // Extract all images from description content ONLY
      const descImagesFound = [];
      $fullDesc.find('img').each((i, elem) => {
        let imageUrl = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-large_image');
        
        if (!imageUrl) return;
        
        // Skip tiny thumbnails, icons, and crucially - the watermarked product covers
        if (imageUrl.includes('-50x50') || imageUrl.includes('-100x100') || 
            imageUrl.includes('icon') || imageUrl.includes('placeholder') ||
            imageUrl.includes('suite') || imageUrl.includes('cover')) {
          return;
        }
        
        // Get full-size image URL by removing size suffixes
        imageUrl = imageUrl.replace(/-\d+x\d+\.(jpg|jpeg|png|gif|webp)/i, '.$1');
        
        // Convert relative URLs to absolute
        if (!imageUrl.startsWith('http')) {
          imageUrl = imageUrl.startsWith('/') ? `${COMPETITOR_BASE_URL}${imageUrl}` : `${COMPETITOR_BASE_URL}/${imageUrl}`;
        }
        
        descImagesFound.push(imageUrl);
        
        if (!product.images.includes(imageUrl)) {
          product.images.push(imageUrl);
        }
      });
      
      // Debug: Log what images were found
      if (descImagesFound.length > 0) {
        console.log(`\n  Found ${descImagesFound.length} description image(s):`);
        descImagesFound.forEach((url, idx) => {
          console.log(`    [${idx + 1}] ${url}`);
        });
      } else {
        console.log(`\n  WARNING: No images found in description!`);
      }
      
      // Clean up the HTML description
      // Convert relative image URLs to absolute in the HTML
      descHtml = descHtml.replace(/src=["']([^"']+)["']/gi, (match, url) => {
        if (url.startsWith('http')) return match;
        const absoluteUrl = url.startsWith('/') ? `${COMPETITOR_BASE_URL}${url}` : `${COMPETITOR_BASE_URL}/${url}`;
        return `src="${absoluteUrl}"`;
      });
      
      // Clean up some whitespace but preserve structure
      descHtml = descHtml
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim();
      
      product.description = descHtml;
      
      // Create a plain text version for short description if needed
      if (!product.shortDescription) {
        product.shortDescription = $fullDesc.text()
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 200);
      }
    } else if (product.shortDescription) {
      product.description = product.shortDescription;
    }

    // Validate product has minimum required data
    if (!product.name) {
      throw new Error('Failed to extract product name');
    }
    
    if (product.price === 0) {
      throw new Error('Failed to extract product price');
    }

    return product;
  } catch (error) {
    console.error(`  ❌ Error scraping ${productUrl}: ${error.message}`);
    return null;
  }
}

// Create or update product in database
async function upsertProduct(productData, categoryId) {
  const slug = generateSlug(productData.name);

  // Check if product exists by slug
  const existing = await pool.query(
    'SELECT id, price FROM products WHERE slug = $1',
    [slug]
  );

  if (existing.rows.length > 0) {
    const existingProduct = existing.rows[0];
    const existingPrice = parseFloat(existingProduct.price);
    
    // Only update if price changed
    if (existingPrice !== productData.price) {
      await pool.query(`
        UPDATE products 
        SET price = $1,
            description = $2,
            short_description = $3,
            image_url = $4,
            updated_at = NOW()
        WHERE id = $5
      `, [
        productData.price,
        productData.description || '',
        productData.shortDescription || '',
        productData.imageUrl || '',
        existingProduct.id
      ]);
      
      return { id: existingProduct.id, action: 'updated', oldPrice: existingPrice, newPrice: productData.price };
    }
    
    return { id: existingProduct.id, action: 'unchanged' };
  }

  // Create new product
  const result = await pool.query(`
    INSERT INTO products (
      name, slug, description, short_description, price, 
      image_url, status, requires_shard, requires_character_name
    )
    VALUES ($1, $2, $3, $4, $5, $6, 'active', true, true)
    RETURNING id
  `, [
    productData.name,
    slug,
    productData.description || '',
    productData.shortDescription || '',
    productData.price,
    productData.imageUrl || ''
  ]);

  const productId = result.rows[0].id;

  // Link to category
  await pool.query(`
    INSERT INTO product_categories (product_id, category_id, sort_order, is_primary)
    VALUES ($1, $2, 0, true)
    ON CONFLICT (product_id, category_id) DO NOTHING
  `, [productId, categoryId]);

  return { id: productId, action: 'created' };
}

// Remove products that are no longer on the competitor's site
async function removeOrphanedProducts(categoryId, scrapedSlugs) {
  // Get all current products in this category
  const result = await pool.query(`
    SELECT p.id, p.slug, p.name
    FROM products p
    JOIN product_categories pc ON p.id = pc.product_id
    WHERE pc.category_id = $1
  `, [categoryId]);

  const removed = [];
  
  for (const product of result.rows) {
    if (!scrapedSlugs.includes(product.slug)) {
      // Product no longer exists on competitor's site - remove it
      await pool.query('DELETE FROM product_categories WHERE product_id = $1', [product.id]);
      await pool.query('DELETE FROM products WHERE id = $1', [product.id]);
      removed.push(product.name);
    }
  }

  return removed;
}

// Main sync function
async function syncPVPSuits() {
  console.log('=== PVP Suits Sync ===');
  console.log(`Source: ${CATEGORY_PAGE_URL}`);
  console.log(`Target Category ID: ${PVP_SUITS_CATEGORY_ID}\n`);

  // Validate category exists in database
  const categoryCheck = await pool.query(
    'SELECT id, name FROM categories WHERE id = $1',
    [PVP_SUITS_CATEGORY_ID]
  );
  
  if (categoryCheck.rows.length === 0) {
    console.error('❌ ERROR: Category ID not found in database!');
    console.error(`   Category ID: ${PVP_SUITS_CATEGORY_ID}`);
    console.error('   Run create-pvp-suits-category.js first to create the category.\n');
    process.exit(1);
  }
  
  console.log(`✓ Category found: ${categoryCheck.rows[0].name}\n`);

  const stats = {
    created: 0,
    updated: 0,
    unchanged: 0,
    removed: 0,
    failed: 0,
    errors: []
  };

  try {
    // Step 1: Scrape category page for product URLs
    console.log('📄 Scraping category page for product URLs...');
    const categoryHTML = await fetchHTML(CATEGORY_PAGE_URL);
    const productUrls = extractProductUrls(categoryHTML);
    
    console.log(`  ✓ Found ${productUrls.length} product URLs\n`);

    if (productUrls.length === 0) {
      console.log('⚠️  No products found on category page. Check if site structure changed.');
      return;
    }

    const scrapedProducts = [];
    const scrapedSlugs = [];

    // Step 2: Scrape each product page
    console.log('🔍 Scraping product details...\n');
    
    for (let i = 0; i < productUrls.length; i++) {
      const url = productUrls[i];
      process.stdout.write(`  [${i + 1}/${productUrls.length}] Scraping ${url}...`);
      
      try {
        const productDetails = await scrapeProductDetails(url);
        
        if (!productDetails || !productDetails.name || productDetails.price === 0) {
          console.log(' FAILED (missing data)');
          stats.failed++;
          continue;
        }

        // Upload ALL description images to Cloudinary and replace URLs in description
        let mainImageUrl = '';
        const imageUrlMap = new Map(); // Map original URL -> Cloudinary URL
        
        if (productDetails.images.length > 0) {
          process.stdout.write(` [uploading ${productDetails.images.length} image(s)...]`);
          
          for (let imgIdx = 0; imgIdx < productDetails.images.length; imgIdx++) {
            try {
              const originalUrl = productDetails.images[imgIdx];
              const imageBuffer = await fetchImage(originalUrl);
              const publicId = `${generateSlug(productDetails.name)}-${imgIdx}`;
              const cloudinaryUrl = await uploadToCloudinary(imageBuffer, publicId);
              
              imageUrlMap.set(originalUrl, cloudinaryUrl);
              
              // First image becomes the main product image
              if (imgIdx === 0) {
                mainImageUrl = cloudinaryUrl;
              }
            } catch (imgError) {
              console.error(`\n    ⚠️  Failed to upload image ${imgIdx}: ${imgError.message}`);
            }
          }
          
          // Replace all image URLs in description HTML with Cloudinary URLs
          let updatedDescription = productDetails.description;
          imageUrlMap.forEach((cloudinaryUrl, originalUrl) => {
            // Replace both the original URL and any size-variant URLs
            const baseUrl = originalUrl.replace(/-\d+x\d+\.(jpg|jpeg|png|gif|webp)/i, '.$1');
            updatedDescription = updatedDescription.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), cloudinaryUrl);
            updatedDescription = updatedDescription.replace(new RegExp(baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), cloudinaryUrl);
          });
          
          productDetails.description = updatedDescription;
          console.log(` [${imageUrlMap.size} uploaded]`);
        } else {
          console.log(' [no images]');
        }

        scrapedProducts.push({
          ...productDetails,
          imageUrl: mainImageUrl
        });
        
        scrapedSlugs.push(generateSlug(productDetails.name));

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.log(` FAILED: ${error.message}`);
        stats.failed++;
        stats.errors.push(`${url}: ${error.message}`);
      }
    }

    // Step 3: Sync products to database
    console.log(`\n💾 Syncing ${scrapedProducts.length} products to database...\n`);

    for (const product of scrapedProducts) {
      try {
        const result = await upsertProduct(product, PVP_SUITS_CATEGORY_ID);
        
        if (result.action === 'created') {
          console.log(`  ✅ CREATED: ${product.name} - $${product.price}`);
          stats.created++;
        } else if (result.action === 'updated') {
          console.log(`  🔄 UPDATED: ${product.name} - $${result.oldPrice} → $${result.newPrice}`);
          stats.updated++;
        } else {
          console.log(`  ⏭️  UNCHANGED: ${product.name} - $${product.price}`);
          stats.unchanged++;
        }
      } catch (error) {
        console.log(`  ❌ FAILED: ${product.name} - ${error.message}`);
        stats.failed++;
        stats.errors.push(`${product.name}: ${error.message}`);
      }
    }

    // Step 4: Remove products that no longer exist on competitor's site
    console.log('\n🗑️  Checking for orphaned products...');
    const removedProducts = await removeOrphanedProducts(PVP_SUITS_CATEGORY_ID, scrapedSlugs);
    
    if (removedProducts.length > 0) {
      console.log(`  ✓ Removed ${removedProducts.length} products:`);
      removedProducts.forEach(name => console.log(`    - ${name}`));
      stats.removed = removedProducts.length;
    } else {
      console.log('  ✓ No orphaned products found');
    }

    // Summary
    console.log('\n=== Sync Complete ===');
    console.log(`Created: ${stats.created}`);
    console.log(`Updated: ${stats.updated}`);
    console.log(`Unchanged: ${stats.unchanged}`);
    console.log(`Removed: ${stats.removed}`);
    console.log(`Failed: ${stats.failed}`);

    if (stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      stats.errors.forEach(error => console.log(`  - ${error}`));
    }

  } catch (error) {
    console.error('❌ Sync error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run sync
syncPVPSuits().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
