# PVP Suits Sync Scripts

Automated daily sync of PVP Suits products from uowts.com competitor.

## Setup Instructions

### Step 1: Create the Category

Run this script once to create the "PVP Suits" category:

```bash
node scripts/create-pvp-suits-category.js
```

This will output a Category ID. **Copy this ID!**

### Step 2: Update Sync Script

Open `scripts/sync-pvp-suits.js` and replace this line:

```javascript
const PVP_SUITS_CATEGORY_ID = 'REPLACE_WITH_CATEGORY_ID';
```

With your actual category ID:

```javascript
const PVP_SUITS_CATEGORY_ID = 'abc123-your-id-here';
```

### Step 3: Test the Sync

Run the sync script manually to test:

```bash
node scripts/sync-pvp-suits.js
```

This will:
- ✅ Scrape https://uowts.com/items/pvp-suites for product URLs
- ✅ Scrape each product page for name, price, images, description
- ✅ Upload images to Cloudinary (folder: uoking/pvp-suits)
- ✅ Insert new products into database
- ✅ Update existing products if price changed
- ✅ Remove products that no longer exist on competitor's site

### Step 4: Set Up Daily Cron Job

#### On Linux/Mac (crontab):

```bash
# Edit crontab
crontab -e

# Add this line to run daily at 3 AM
0 3 * * * cd /path/to/uoking && node scripts/sync-pvp-suits.js >> logs/pvp-suits-sync.log 2>&1
```

#### On Windows (Task Scheduler):

1. Open Task Scheduler
2. Create Basic Task
3. Name: "UO King - Sync PVP Suits"
4. Trigger: Daily at 3:00 AM
5. Action: Start a program
   - Program: `node.exe`
   - Arguments: `scripts/sync-pvp-suits.js`
   - Start in: `C:\Users\willa\uoking\uoking`

#### Using Node Cron (Alternative):

Install node-cron:
```bash
npm install node-cron
```

Create `scripts/cron-runner.js`:
```javascript
const cron = require('node-cron');
const { exec } = require('child_process');

// Run daily at 3 AM
cron.schedule('0 3 * * *', () => {
  console.log('Running PVP Suits sync...');
  exec('node scripts/sync-pvp-suits.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
});

console.log('Cron scheduler started. PVP Suits will sync daily at 3 AM.');
```

## What the Sync Does

### On First Run:
- Scrapes all products from competitor
- Creates products in database
- Uploads images to Cloudinary

### On Subsequent Runs:
- **New products** → Inserted into database
- **Existing products** → Only updated if price changed
- **Missing products** → Removed from database (sold out on competitor site)

## Sync Logic

1. **Fetch category page** → Extract all product URLs
2. **For each product URL** → Scrape details (name, price, images, description)
3. **Compare with database**:
   - If product doesn't exist → INSERT
   - If product exists + price changed → UPDATE
   - If product exists + price same → SKIP
4. **Remove orphans** → Delete products in DB that aren't on competitor's site anymore

## Output Example

```
=== PVP Suits Sync ===
Source: https://uowts.com/items/pvp-suites
Target Category ID: abc123-your-id

📄 Scraping category page for product URLs...
  ✓ Found 3 product URLs

🔍 Scraping product details...

  [1/3] Scraping https://uowts.com/product/pvp-bushi-archer-with-sword-suite-1/... [image OK]
  [2/3] Scraping https://uowts.com/product/pvp-bushi-parry-deathstriker-1/... [image OK]
  [3/3] Scraping https://uowts.com/product/pvp-wrestle-mystic-parry-mage-1/... [image OK]

💾 Syncing 3 products to database...

  ✅ CREATED: PVP Bushi Archer with Sword #1 - $199.99
  ✅ CREATED: PVP Bushi Parry Deathstriker #1 - $199.99
  ✅ CREATED: PVP Wrestle Mystic Parry Mage #1 - $199.99

🗑️  Checking for orphaned products...
  ✓ No orphaned products found

=== Sync Complete ===
Created: 3
Updated: 0
Unchanged: 0
Removed: 0
Failed: 0
```

## Troubleshooting

### "PVP_SUITS_CATEGORY_ID not set"
- Run `create-pvp-suits-category.js` first
- Copy the category ID and update `sync-pvp-suits.js`

### "No products found on category page"
- Competitor may have changed their HTML structure
- Check the selectors in `extractProductUrls()` function
- Manually visit https://uowts.com/items/pvp-suites to verify page still exists

### Images not uploading
- Check Cloudinary credentials in script
- Check image URLs are accessible
- Images are uploaded to folder: `uoking/pvp-suits`

### Products not updating
- Price must change for update to trigger
- If you want to force update all products, delete them from DB and re-run

## Manual Operations

### Force Re-sync All Products
```bash
# Remove all PVP Suits products from database
# Then run sync to re-import everything
node scripts/sync-pvp-suits.js
```

### Check Current Products
```sql
SELECT p.name, p.price, p.image_url 
FROM products p
JOIN product_categories pc ON p.id = pc.product_id
WHERE pc.category_id = 'YOUR_CATEGORY_ID';
```
