# Atlantic Event Rares Import System 🎭

This system allows you to scrape Atlantic event rares data from the [Stratics Wiki](https://wiki.stratics.com/) and store it in your database with Cloudinary image hosting.

## Overview

The system consists of several components:

1. **Database Table**: `event_items` table to store event rare data
2. **Scraper**: Extracts data from HTML files
3. **Image Uploader**: Downloads images and uploads to Cloudinary
4. **API Endpoints**: REST API for managing event items
5. **Import Script**: Orchestrates the entire process

## Quick Start

### 1. Create the Database Table

First, create the `event_items` table:

```bash
node add-event-items-table.js
```

### 2. Run a Dry Run

Test the scraping process without affecting the database:

```bash
node import-atlantic-event-rares.js --dry-run
```

This will:
- Parse the `atlanticeventrares.html` file
- Extract all event items and their details
- Show statistics about what would be imported
- Save scraped data to `scraped-event-items.json`

### 3. Full Import Process

Run the complete import process:

```bash
node import-atlantic-event-rares.js
```

This will:
1. Scrape data from the HTML file
2. Insert items into the database
3. Download images from wiki.stratics.com
4. Upload images to Cloudinary
5. Update database with Cloudinary URLs
6. Show final statistics

## File Structure

```
uoking/
├── atlanticeventrares.html          # Source HTML file
├── add-event-items-table.sql        # Database table creation
├── add-event-items-table.js         # Table creation script
├── scrape-atlantic-event-rares.js   # HTML scraper
├── upload-event-item-images.js      # Image upload utility
├── import-atlantic-event-rares.js   # Main import script
├── scraped-event-items.json         # Scraped data (generated)
└── app/api/admin/event-items/       # API endpoints
    ├── route.ts                     # List/Create items
    └── [id]/route.ts               # Get/Update/Delete item
```

## Database Schema

The `event_items` table includes:

- **Basic Info**: `name`, `slug`, `description`
- **Event Details**: `season_number`, `season_name`, `event_year`, `event_type`
- **Shard Info**: `shard` (defaults to 'Atlantic')
- **Images**: `original_image_url`, `cloudinary_url`, `cloudinary_public_id`
- **Item Details**: `item_type`, `hue_number`, `graphic_number`
- **Status**: `status`, `rarity_level`
- **Timestamps**: `created_at`, `updated_at`

## API Endpoints

### List Event Items
```
GET /api/admin/event-items?page=1&limit=20&season=8&shard=Atlantic&itemType=Mask&status=active&search=mesanna
```

### Get Single Item
```
GET /api/admin/event-items/{id}
```

### Create Item
```
POST /api/admin/event-items
```

### Update Item
```
PUT /api/admin/event-items/{id}
```

### Delete Item
```
DELETE /api/admin/event-items/{id}
```

## Configuration

### Environment Variables

Make sure these are set in your `.env` file:

```env
POSTGRES_URL=your_postgres_connection_string
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Cloudinary Setup

The system automatically:
- Downloads images from `https://wiki.stratics.com/images/...`
- Uploads them to Cloudinary in the `uoking/event-items` folder
- Stores the Cloudinary URL and public ID in the database
- Handles image cleanup when items are deleted

## Usage Examples

### Scrape Only (No Database)
```bash
node scrape-atlantic-event-rares.js
```

### Upload Images Only
```bash
node upload-event-item-images.js
```

### Get Import Statistics
```javascript
const { getImportStats } = require('./import-atlantic-event-rares');
const stats = await getImportStats();
console.log(stats);
```

## Data Extraction

The scraper extracts the following information from the HTML:

- **Item Name**: From the link text
- **Season**: From the section headers (Season 8, Season 9, etc.)
- **Image URL**: From the `src` attribute of `<img>` tags
- **Item Type**: Determined from the image alt text patterns
- **Hue/Graphic Numbers**: Extracted from alt text when present
- **Event Year**: Mapped from season numbers (approximate)

## Item Types Detected

The system automatically categorizes items as:
- `Mask` - Various mask types
- `Plant` - Decorative plants
- `Bear` - Teddy bear items
- `Paints` - Finger paint items
- `Lantern` - Jack O' Lantern items
- `Rose` - Rose items
- `Pumpkin` - Pumpkin items
- `Hammer` - Smith hammer items
- `Replica` - Replica items
- `Decoration` - Other decorative items

## Error Handling

The system includes comprehensive error handling:

- **Duplicate Prevention**: Skips items that already exist
- **Image Download Failures**: Continues processing other items
- **Cloudinary Upload Failures**: Logs errors but continues
- **Database Errors**: Logs specific error messages
- **Network Timeouts**: Retries with delays between requests

## Monitoring and Statistics

After import, you can view:

- Total items imported
- Items with/without images
- Success rates for image uploads
- Breakdown by season and item type
- Image completion percentage

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure `POSTGRES_URL` is correct
2. **Cloudinary Credentials**: Verify API keys are valid
3. **Image Downloads**: Check network connectivity to wiki.stratics.com
4. **File Permissions**: Ensure write access for temp files

### Debug Mode

Add `console.log` statements to the scraper to debug parsing issues:

```javascript
// In scrape-atlantic-event-rares.js
console.log('Processing row:', row);
console.log('Extracted data:', { altText, imageSrc, itemName });
```

### Manual Image Upload

If automatic upload fails, you can manually upload a single image:

```javascript
const { uploadSingleImage } = require('./upload-event-item-images');
const result = await uploadSingleImage(
  'https://wiki.stratics.com/images/1/14/UO-Item-3224-0.png',
  'A Fan Plant'
);
```

## Future Enhancements

Potential improvements:
- Support for other shards (not just Atlantic)
- Batch image processing with progress bars
- Web interface for managing event items
- Automatic season/year detection
- Integration with existing product catalog
- Export functionality for other formats

## Support

For issues or questions:
1. Check the console output for error messages
2. Verify all environment variables are set
3. Test with the dry run first
4. Check database connectivity
5. Verify Cloudinary credentials
