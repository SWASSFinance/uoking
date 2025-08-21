const fs = require('fs');

// Utility function to create URL-friendly slugs
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
}

// Function to extract item details from image alt text and item name
function extractItemDetails(altText, itemName) {
  const details = {
    itemType: null,
    hueNumber: null,
    graphicNumber: null
  };

  // Extract hue number if present
  const hueMatch = altText.match(/Hue_(\d+)/i);
  if (hueMatch) {
    details.hueNumber = parseInt(hueMatch[1]);
  }

  // Extract graphic number if present
  const graphicMatch = altText.match(/Graphic_(\d+)/i);
  if (graphicMatch) {
    details.graphicNumber = parseInt(graphicMatch[1]);
  }

  // Determine item type based on name patterns (check both alt text and item name)
  const searchText = `${altText} ${itemName}`.toLowerCase();
  
  if (searchText.includes('mask')) {
    details.itemType = 'Mask';
  } else if (searchText.includes('plant')) {
    details.itemType = 'Plant';
  } else if (searchText.includes('bear')) {
    details.itemType = 'Bear';
  } else if (searchText.includes('paints')) {
    details.itemType = 'Paints';
  } else if (searchText.includes('lantern')) {
    details.itemType = 'Lantern';
  } else if (searchText.includes('rose')) {
    details.itemType = 'Rose';
  } else if (searchText.includes('pumpkin')) {
    details.itemType = 'Pumpkin';
  } else if (searchText.includes('hammr') || searchText.includes('hammer')) {
    details.itemType = 'Hammer';
  } else if (searchText.includes('replica')) {
    details.itemType = 'Replica';
  } else if (searchText.includes('head')) {
    details.itemType = 'Trophy';
  } else if (searchText.includes('feet')) {
    details.itemType = 'Trophy';
  } else if (searchText.includes('recognition')) {
    details.itemType = 'Trophy';
  } else if (searchText.includes('beat')) {
    details.itemType = 'Trophy';
  } else if (searchText.includes('winner')) {
    details.itemType = 'Trophy';
  } else {
    details.itemType = 'Decoration';
  }

  return details;
}

// Function to determine event year based on season
function getEventYear(seasonNumber) {
  // Approximate mapping - you may need to adjust based on actual UO timeline
  const seasonToYear = {
    8: 2010,
    9: 2011,
    10: 2012,
    11: 2013,
    12: 2014,
    13: 2015,
    14: 2016,
    15: 2017,
    16: 2018,
    17: 2019,
    18: 2020,
    19: 2021,
    20: 2022,
    21: 2023,
    22: 2024,
    23: 2025
  };
  
  return seasonToYear[seasonNumber] || null;
}

// Simple scraping function that finds all items directly
function scrapeAllItems() {
  try {
    console.log('🔍 Starting simple Atlantic items scraping...');
    
    // Read the HTML file
    const htmlContent = fs.readFileSync('./atlanticeventrares.html', 'utf8');
    
    const eventItems = [];
    
    // Find all table rows that contain items
    const tableRows = htmlContent.match(/<tr>[\s\S]*?<\/tr>/g);
    
    if (tableRows) {
      console.log(`Found ${tableRows.length} table rows`);
      
      tableRows.forEach((row, index) => {
        // Extract image information
        const imgMatch = row.match(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/);
        const nameMatch = row.match(/<a[^>]*title="[^"]*">([^<]+)<\/a>/);
        
        if (imgMatch && nameMatch) {
          const altText = imgMatch[1];
          const imageSrc = imgMatch[2];
          let itemName = nameMatch[1].trim().replace(/\s*$/, ''); // Remove trailing spaces
          
          // Clean up HTML entities
          itemName = itemName.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
          
          // Skip if it's the "ImageNotAvailable" placeholder
          if (altText === 'ImageNotAvailable.png') {
            return;
          }
          
          // Extract item details
          const itemDetails = extractItemDetails(altText, itemName);
          
          // Try to determine section and season from context
          let sectionName = 'Atlantic Items';
          let seasonNumber = null;
          let seasonName = null;
          
          // Look for context around this row
          const rowIndex = htmlContent.indexOf(row);
          const beforeRow = htmlContent.substring(Math.max(0, rowIndex - 2000), rowIndex);
          
          // Check for section headers
          const sectionMatch = beforeRow.match(/<h2[^>]*>.*?<span[^>]*>([^<]+)<\/span>/);
          if (sectionMatch) {
            sectionName = sectionMatch[1];
          }
          
          // Check for season/year headers
          const seasonMatch = beforeRow.match(/<h3[^>]*>.*?<span[^>]*>([^<]+)<\/span>/);
          if (seasonMatch) {
            const seasonText = seasonMatch[1];
            if (seasonText.match(/Season (\d+)/)) {
              const match = seasonText.match(/Season (\d+)/);
              seasonNumber = match ? parseInt(match[1]) : null;
              seasonName = seasonText;
            } else if (seasonText.match(/^\d{4}$/)) {
              // It's a year
              seasonNumber = parseInt(seasonText);
              seasonName = seasonText;
            }
          }
          
          // Create the event item object
          const eventItem = {
            name: itemName,
            slug: createSlug(itemName),
            description: `${itemName} from ${sectionName} on Atlantic shard`,
            seasonNumber: seasonNumber,
            seasonName: seasonName,
            eventYear: getEventYear(seasonNumber),
            eventType: sectionName,
            shard: 'Atlantic',
            originalImageUrl: `https://wiki.stratics.com${imageSrc}`,
            cloudinaryUrl: null, // Will be set after upload
            cloudinaryPublicId: null, // Will be set after upload
            itemType: itemDetails.itemType,
            hueNumber: itemDetails.hueNumber,
            graphicNumber: itemDetails.graphicNumber,
            status: 'active',
            rarityLevel: 'rare'
          };
          
          eventItems.push(eventItem);
        }
      });
    }
    
    console.log(`✅ Scraped ${eventItems.length} event items from HTML`);
    
    // Save the scraped data to a JSON file for review
    fs.writeFileSync('./scraped-event-items.json', JSON.stringify(eventItems, null, 2));
    console.log('💾 Scraped data saved to scraped-event-items.json');
    
    return eventItems;
    
  } catch (error) {
    console.error('❌ Error scraping event items:', error);
    return [];
  }
}

// Run the scraper
if (require.main === module) {
  const items = scrapeAllItems();
  console.log(`\n📊 Summary:`);
  console.log(`- Total items scraped: ${items.length}`);
  
  // Group by section
  const sections = {};
  items.forEach(item => {
    if (!sections[item.eventType]) {
      sections[item.eventType] = [];
    }
    sections[item.eventType].push(item);
  });
  
  console.log(`- Sections found: ${Object.keys(sections).join(', ')}`);
  Object.keys(sections).forEach(section => {
    console.log(`  ${section}: ${sections[section].length} items`);
  });
  
  // Group by item type
  const itemTypes = {};
  items.forEach(item => {
    if (!itemTypes[item.itemType]) {
      itemTypes[item.itemType] = 0;
    }
    itemTypes[item.itemType]++;
  });
  
  console.log(`- Item types: ${Object.keys(itemTypes).join(', ')}`);
  Object.keys(itemTypes).forEach(type => {
    console.log(`  ${type}: ${itemTypes[type]} items`);
  });
}

module.exports = { scrapeAllItems };
