# Cloudinary Image Upload Setup

## Step 1: Get Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier)
2. Go to Dashboard → Settings → Access Keys
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

## Step 2: Add Environment Variables

Add this to your `.env` file:

```env
CLOUDINARY_URL=cloudinary://827585767246395:q4JyvKJGRoyoI0AJ3fxgR8p8nNA@dngclyzkj
```

**Note**: The script is already configured with your credentials, so you can run it immediately!

## Step 3: Prepare Your Images

1. Create a folder called `product-images` in your project root
2. Put all your 1500 product images in this folder
3. Make sure image filenames are similar to your product names/slugs

## Step 4: Run the Upload Script

```bash
node upload-images-to-cloudinary.js
```

## What the Script Does

1. **Reads your database** - Gets all products with existing image_urls
2. **Matches images to products** - Uses product names/slugs to find matching image files
3. **Uploads to Cloudinary** - Uploads each image with product slug as the public_id
4. **Updates database** - Automatically updates image_url field with Cloudinary URLs
5. **Reports results** - Shows how many were uploaded, skipped, or had errors

## Expected Output

```
🚀 Starting automated image upload to Cloudinary...
📦 Found 1500 products with images to process
📁 Found 1500 image files in directory
📤 Uploading: Magic Sword -> magic-sword.png
✅ Uploaded: Magic Sword -> https://res.cloudinary.com/your-cloud/image/upload/products/magic-sword.jpg
...
🎉 Upload Complete!
✅ Successfully uploaded: 1450 images
⚠️  Skipped (no image found): 50 products
❌ Errors: 0 products
```

## Benefits

- **Automatic optimization** - Images are compressed and converted to WebP
- **Global CDN** - Fast loading worldwide
- **Predictable URLs** - `https://res.cloudinary.com/your-cloud/image/upload/products/product-slug.jpg`
- **Transformations** - Can resize on-the-fly: `/w_300,h_300/products/product-slug.jpg`

## Troubleshooting

- **No images found**: Check that your image filenames match product names/slugs
- **Rate limiting**: Script includes 100ms delays between uploads
- **Missing credentials**: Verify your Cloudinary environment variables 