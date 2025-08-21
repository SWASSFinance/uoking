const { Pool } = require('pg');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const https = require('https');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dngclyzkj',
  api_key: process.env.CLOUDINARY_API_KEY || '827585767246395',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'q4JyvKJGRoyoI0AJ3fxgR8p8nNA'
});

// Function to download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to upload image to Cloudinary
async function uploadToCloudinary(imagePath, itemName) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'uoking/event-items',
      public_id: `atlantic-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      overwrite: true,
      resource_type: 'image'
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error(`❌ Error uploading to Cloudinary: ${error.message}`);
    throw error;
  }
}

// Function to process event items and upload their images
async function uploadEventItemImages() {
  const pool = new Pool({ 
    connectionString: process.env.POSTGRES_URL 
  });

  try {
    console.log('🖼️ Starting event item image upload process...');
    
    // Create temp directory for downloads
    const tempDir = './temp-images';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Get all event items that don't have Cloudinary URLs yet
    const result = await pool.query(`
      SELECT id, name, original_image_url, cloudinary_url 
      FROM event_items 
      WHERE cloudinary_url IS NULL 
      AND original_image_url IS NOT NULL
      ORDER BY season_number, name
    `);
    
    const items = result.rows;
    console.log(`📸 Found ${items.length} items needing image upload`);
    
    if (items.length === 0) {
      console.log('✅ All event items already have Cloudinary URLs');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of items) {
      try {
        console.log(`\n🔄 Processing: ${item.name}`);
        
        // Extract filename from URL
        const urlParts = item.original_image_url.split('/');
        const filename = urlParts[urlParts.length - 1];
        const tempFilePath = path.join(tempDir, filename);
        
        // Download the image
        console.log(`⬇️ Downloading from: ${item.original_image_url}`);
        await downloadImage(item.original_image_url, tempFilePath);
        
        // Upload to Cloudinary
        console.log(`☁️ Uploading to Cloudinary...`);
        const uploadResult = await uploadToCloudinary(tempFilePath, item.name);
        
        // Update database with Cloudinary URL
        await pool.query(`
          UPDATE event_items 
          SET cloudinary_url = $1, cloudinary_public_id = $2, updated_at = NOW()
          WHERE id = $3
        `, [uploadResult.url, uploadResult.publicId, item.id]);
        
        console.log(`✅ Successfully uploaded: ${item.name}`);
        console.log(`   Cloudinary URL: ${uploadResult.url}`);
        
        successCount++;
        
        // Clean up temp file
        fs.unlinkSync(tempFilePath);
        
        // Add a small delay to avoid overwhelming the servers
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing ${item.name}:`, error.message);
        errorCount++;
        
        // Clean up temp file if it exists
        const tempFilePath = path.join(tempDir, item.original_image_url.split('/').pop());
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    }
    
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
    
    console.log(`\n📊 Upload Summary:`);
    console.log(`✅ Successful uploads: ${successCount}`);
    console.log(`❌ Failed uploads: ${errorCount}`);
    console.log(`📈 Success rate: ${((successCount / items.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Error in upload process:', error);
  } finally {
    await pool.end();
  }
}

// Function to upload a single image (for testing)
async function uploadSingleImage(imageUrl, itemName) {
  try {
    console.log(`🖼️ Testing single image upload for: ${itemName}`);
    
    const tempDir = './temp-images';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const filename = imageUrl.split('/').pop();
    const tempFilePath = path.join(tempDir, filename);
    
    // Download
    await downloadImage(imageUrl, tempFilePath);
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(tempFilePath, itemName);
    
    // Clean up
    fs.unlinkSync(tempFilePath);
    fs.rmdirSync(tempDir);
    
    console.log(`✅ Test upload successful: ${result.url}`);
    return result;
    
  } catch (error) {
    console.error('❌ Test upload failed:', error);
    throw error;
  }
}

// Run the upload process
if (require.main === module) {
  uploadEventItemImages();
}

module.exports = { uploadEventItemImages, uploadSingleImage };
