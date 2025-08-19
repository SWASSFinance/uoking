const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dngclyzkj',
  api_key: process.env.CLOUDINARY_API_KEY || '827585767246395',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'q4JyvKJGRoyoI0AJ3fxgR8p8nNA'
});

async function createUploadPreset() {
  try {
    console.log('🔧 Creating Cloudinary upload preset...');
    
    const result = await cloudinary.api.create_upload_preset({
      name: 'uoking_maps',
      folder: 'uoking/maps',
      allowed_formats: 'jpg,jpeg,png,gif,pdf,zip,rar',
      max_file_size: 104857600, // 100MB in bytes
      unsigned: true, // This allows client-side uploads
      resource_type: 'auto'
    });
    
    console.log('✅ Upload preset created successfully!');
    console.log('Preset name:', result.name);
    console.log('Folder:', result.folder);
    console.log('Max file size:', result.max_file_size, 'bytes');
    console.log('Unsigned:', result.unsigned);
    
    console.log('\n📝 Update your frontend code to use this preset:');
    console.log('upload_preset: "uoking_maps"');
    
  } catch (error) {
    console.error('❌ Error creating upload preset:', error);
    
    if (error.error && error.error.message === 'Upload preset already exists') {
      console.log('ℹ️  Preset already exists. You can use "uoking_maps" in your code.');
    } else {
      console.log('💡 Make sure your Cloudinary credentials are correct.');
    }
  }
}

createUploadPreset();
