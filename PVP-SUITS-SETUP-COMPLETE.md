# ✅ PVP Suits Auto-Sync Setup Complete!

## 📦 What Was Created

### 1. **PVP Suits Category**
- **Category Name:** PVP Suits
- **Category ID:** `b3fb7231-6ca8-44c0-97f2-b95220682356`
- **Slug:** `pvp-suits`
- **URL:** https://uoking.com/UO/pvp-suits

### 2. **Scripts Created**

#### `scripts/create-pvp-suits-category.js`
- Creates the PVP Suits category
- Outputs the category ID for use in sync script
- Safe to run multiple times (checks if exists first)

#### `scripts/sync-pvp-suits.js` ⭐ **MAIN SCRIPT**
- Scrapes https://uowts.com/items/pvp-suites daily
- Syncs products to your database
- Uploads images to Cloudinary
- **Smart updates:**
  - ✅ Creates new products
  - ✅ Updates products only if price changed
  - ✅ Removes products that were sold/removed from competitor
  - ✅ Skips unchanged products

#### `scripts/run-pvp-suits-sync.bat`
- Windows batch file for Task Scheduler
- Automatically logs to `logs/pvp-suits-sync.log`

## 🎉 First Sync Already Complete!

**Products Imported:**
1. ✅ PVP Bushi Archer with Sword #1 - $199.99
2. ✅ PVP Bushi Parry Deathstriker #1 - $199.99
3. ✅ PVP Wrestle Mystic Parry Mage #1 - $199.99

**Images:** Uploaded to Cloudinary folder `uoking/pvp-suits`

**Descriptions:** Full HTML preserved with images, line breaks, and formatting

**Status:** All products are live on your site at `/UO/pvp-suits`

### 📸 How Description Images Work:

1. **Extracts images from description tab** (not the watermarked product cover)
2. **First image** becomes the main product image
3. **All images** uploaded to Cloudinary (no competitor links)
4. **HTML formatting** preserved (paragraphs, line breaks, links)
5. **Images in description** replaced with your Cloudinary URLs
6. **Lightbox support** maintained for clickable images

## 🔄 Daily Auto-Sync Setup (Choose One)

### Option A: Windows Task Scheduler (Recommended for Windows)

1. **Open Task Scheduler** (Win + R → `taskschd.msc`)

2. **Create Basic Task:**
   - Name: `UO King - Sync PVP Suits`
   - Description: `Daily sync of PVP Suits products from competitor`
   - Trigger: **Daily at 3:00 AM**

3. **Action: Start a Program**
   - Program/script: `cmd.exe`
   - Arguments: `/c "cd /d C:\Users\willa\uoking\uoking && scripts\run-pvp-suits-sync.bat"`
   - Start in: `C:\Users\willa\uoking\uoking`

4. **Settings:**
   - ✅ Allow task to run on demand
   - ✅ Run task as soon as possible after scheduled start is missed
   - ✅ Stop task if it runs longer than 1 hour

### Option B: Node-Cron (Cross-platform)

Install node-cron:
```bash
npm install node-cron
```

Create `scripts/cron-runner.js`:
```javascript
const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

// Run daily at 3 AM
cron.schedule('0 3 * * *', () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Running PVP Suits sync...`);
  
  exec('node scripts/sync-pvp-suits.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`[${timestamp}] Error:`, error);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
});

console.log('✓ Cron scheduler started');
console.log('  PVP Suits will sync daily at 3:00 AM');
console.log('  Press Ctrl+C to stop');
```

Run the cron runner (keep it running):
```bash
node scripts/cron-runner.js
```

Or use PM2 to keep it running:
```bash
npm install -g pm2
pm2 start scripts/cron-runner.js --name "pvp-suits-cron"
pm2 save
pm2 startup
```

## 🧪 Testing the Sync

### Test Manual Run:
```bash
node scripts/sync-pvp-suits.js
```

### Test What Happens When Price Changes:
1. Competitor changes price: $199.99 → $179.99
2. Next sync run will show: `🔄 UPDATED: Product Name - $199.99 → $179.99`
3. Your database automatically updated!

### Test What Happens When Product Removed:
1. Competitor removes/sells out a product
2. Next sync run will show: `🗑️ Removed 1 products: Product Name`
3. Your database automatically cleaned up!

## 📊 Monitoring

### View Sync Logs:
```bash
type logs\pvp-suits-sync.log
```

### Check Current PVP Suits Products:
```sql
SELECT p.name, p.price, p.image_url, p.created_at, p.updated_at
FROM products p
JOIN product_categories pc ON p.id = pc.product_id
WHERE pc.category_id = 'b3fb7231-6ca8-44c0-97f2-b95220682356'
ORDER BY p.name;
```

### View Category on Your Site:
https://uoking.com/UO/pvp-suits

## 🛠️ Manual Operations

### Force Re-import Everything:
```sql
-- Delete all PVP Suits products
DELETE FROM products WHERE id IN (
  SELECT product_id FROM product_categories 
  WHERE category_id = 'b3fb7231-6ca8-44c0-97f2-b95220682356'
);
```

Then run:
```bash
node scripts/sync-pvp-suits.js
```

### Update Single Product:
Just wait for next daily sync, or run manually:
```bash
node scripts/sync-pvp-suits.js
```

### Change Sync Frequency:
Edit the cron schedule:
- `0 3 * * *` = Daily at 3 AM
- `0 */6 * * *` = Every 6 hours
- `0 0 * * 0` = Weekly on Sunday at midnight
- `*/30 * * * *` = Every 30 minutes

## 🎯 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│ DAILY SYNC PROCESS                                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 1. Fetch https://uowts.com/items/pvp-suites                │
│    └─> Extract 3 product URLs                               │
│                                                              │
│ 2. For each product URL:                                    │
│    ├─> Scrape name, price, images, description              │
│    ├─> Download images                                      │
│    └─> Upload to Cloudinary                                 │
│                                                              │
│ 3. Compare with your database:                              │
│    ├─> New product? → INSERT                                │
│    ├─> Price changed? → UPDATE                              │
│    ├─> Price same? → SKIP                                   │
│    └─> No longer on site? → DELETE                          │
│                                                              │
│ 4. Done! Your site is up-to-date                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

- ✅ **Fully Automated** - Set it and forget it
- ✅ **Smart Updates** - Only updates what changed
- ✅ **Auto Cleanup** - Removes sold-out products
- ✅ **Image Upload** - Automatic Cloudinary upload
- ✅ **Error Handling** - Continues on failures
- ✅ **Detailed Logging** - Track every sync
- ✅ **Fast** - ~15 seconds per sync

## 🚀 You're All Set!

Your PVP Suits category will now stay automatically synced with the competitor!

Visit your new category:
**https://uoking.com/UO/pvp-suits**

---

**Need help?** Check `scripts/README-PVP-SUITS.md` for detailed documentation.
