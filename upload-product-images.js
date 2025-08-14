const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dngclyzkj',
  api_key: '827585767246395',
  api_secret: 'q4JyvKJGRoyoI0AJ3fxgR8p8nNA'
});

// Configure database
const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

async function uploadProductImages() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Resetting database image URLs...');
    
    // Reset all image_urls to empty
    await client.query(`
      UPDATE products 
      SET image_url = NULL, updated_at = NOW()
      WHERE image_url LIKE '%cloudinary%'
    `);
    
    console.log('✅ Database reset complete');
    
    console.log('🚀 Starting product image upload to Cloudinary...');
    
    // Get all products from database that have image_urls
    const productsResult = await client.query(`
      SELECT id, name, slug, image_url 
      FROM products 
      WHERE image_url IS NOT NULL AND image_url != ''
      ORDER BY name
    `);
    
    const products = productsResult.rows;
    console.log(`📦 Found ${products.length} products with images to process`);
    
    // Create images directory path
    const imagesDir = path.join(__dirname, 'product-images');
    
    if (!fs.existsSync(imagesDir)) {
      console.error(`❌ Images directory not found: ${imagesDir}`);
      console.log('Please create a folder called "product-images" in your project root and put all your images there');
      return;
    }
    
    const imageFiles = fs.readdirSync(imagesDir);
    console.log(`📁 Found ${imageFiles.length} image files in directory:`);
    imageFiles.forEach(file => console.log(`  - ${file}`));
    
    // Create a mapping of filenames (case-insensitive) to actual filenames
    const imageFileMap = {};
    imageFiles.forEach(file => {
      const nameWithoutExt = path.parse(file).name.toLowerCase();
      imageFileMap[nameWithoutExt] = file;
      imageFileMap[file.toLowerCase()] = file;
      imageFileMap[file] = file;
    });
    
    // Track which images we've already uploaded to Cloudinary
    const uploadedImages = new Map(); // filename -> cloudinary_url
    let uploadedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        // Extract filename from the existing image_url in database
        let imageFile = null;
        
        if (product.image_url) {
          // Extract filename from image_url (e.g., "/images/sword.png" -> "sword.png")
          const urlParts = product.image_url.split('/');
          imageFile = urlParts[urlParts.length - 1];
          
          // Remove any query parameters or fragments
          imageFile = imageFile.split('?')[0].split('#')[0];
        }
        
        if (!imageFile) {
          console.log(`⚠️  No image filename found for: ${product.name} (${product.slug})`);
          skippedCount++;
          continue;
        }
        
        // Find the actual image file in our folder (case-insensitive)
        const actualImageFile = imageFileMap[imageFile.toLowerCase()] || 
                               imageFileMap[imageFile] || 
                               imageFileMap[path.parse(imageFile).name.toLowerCase()];
        
        if (!actualImageFile) {
          console.log(`⚠️  Image file not found in folder: ${imageFile} for ${product.name}`);
          skippedCount++;
          continue;
        }
        
        let cloudinaryUrl = uploadedImages.get(actualImageFile);
        
        // If we haven't uploaded this image yet, upload it now
        if (!cloudinaryUrl) {
          const imagePath = path.join(imagesDir, actualImageFile);
          
          console.log(`📤 Uploading image file: ${actualImageFile} (first time)`);
          
          // Upload to Cloudinary with the image filename as public_id
          const uploadResult = await cloudinary.uploader.upload(imagePath, {
            public_id: `products/${path.parse(actualImageFile).name}`,
            folder: 'products',
            overwrite: true,
            resource_type: 'image'
          });
          
          cloudinaryUrl = uploadResult.secure_url;
          uploadedImages.set(actualImageFile, cloudinaryUrl);
          
          console.log(`✅ Uploaded: ${actualImageFile} -> ${cloudinaryUrl}`);
        } else {
          console.log(`♻️  Reusing existing upload for: ${product.name} -> ${actualImageFile}`);
        }
        
        // Update database with Cloudinary URL
        await client.query(`
          UPDATE products 
          SET image_url = $1, updated_at = NOW()
          WHERE id = $2
        `, [cloudinaryUrl, product.id]);
        
        console.log(`✅ Updated: ${product.name} -> ${cloudinaryUrl}`);
        uploadedCount++;
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        console.error(`❌ Error processing ${product.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Upload Complete!');
    console.log(`✅ Successfully processed: ${uploadedCount} products`);
    console.log(`📁 Unique images uploaded to Cloudinary: ${uploadedImages.size}`);
    console.log(`⚠️  Skipped (no image found): ${skippedCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);
    
    console.log('\n📊 Image Usage Summary:');
    for (const [imageFile, cloudinaryUrl] of uploadedImages) {
      const productsUsingThisImage = products.filter(product => {
        if (product.image_url) {
          const urlParts = product.image_url.split('/');
          const dbImageFile = urlParts[urlParts.length - 1].split('?')[0].split('#')[0];
          return dbImageFile.toLowerCase() === imageFile.toLowerCase() || 
                 path.parse(dbImageFile).name.toLowerCase() === path.parse(imageFile).name.toLowerCase();
        }
        return false;
      }).length;
      
      if (productsUsingThisImage > 0) {
        console.log(`  - ${imageFile}: used by ${productsUsingThisImage} products`);
      }
    }
    
    if (skippedCount > 0) {
      console.log('\n📋 Products without matching images:');
      const productsWithoutImages = products.filter(product => {
        if (!product.image_url) return true;
        
        const urlParts = product.image_url.split('/');
        const dbImageFile = urlParts[urlParts.length - 1].split('?')[0].split('#')[0];
        
        return !imageFileMap[dbImageFile.toLowerCase()] && 
               !imageFileMap[dbImageFile] && 
               !imageFileMap[path.parse(dbImageFile).name.toLowerCase()];
      });
      
      productsWithoutImages.forEach(product => {
        console.log(`  - ${product.name} (${product.slug})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
uploadProductImages().catch(console.error); 