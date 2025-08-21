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
  const hueMatch = altText.match(/(\d+)\.png$/);
  if (hueMatch) {
    details.hueNumber = parseInt(hueMatch[1]);
  }

  // Extract graphic number if present
  const graphicMatch = altText.match(/UO-Item-(\d+)/);
  if (graphicMatch) {
    details.graphicNumber = parseInt(graphicMatch[1]);
  }

  // Determine item type based on name patterns
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
  } else if (searchText.includes('hammer')) {
    details.itemType = 'Hammer';
  } else if (searchText.includes('replica')) {
    details.itemType = 'Replica';
  } else if (searchText.includes('head') || searchText.includes('trophy') || searchText.includes('recognition') || searchText.includes('winner')) {
    details.itemType = 'Trophy';
  } else if (searchText.includes('sword') || searchText.includes('weapon') || searchText.includes('axe')) {
    details.itemType = 'Weapon';
  } else if (searchText.includes('robe') || searchText.includes('armor') || searchText.includes('tunic') || searchText.includes('leggings')) {
    details.itemType = 'Armor';
  } else if (searchText.includes('necklace') || searchText.includes('jewelry')) {
    details.itemType = 'Jewelry';
  } else if (searchText.includes('candle') || searchText.includes('torch')) {
    details.itemType = 'Light';
  } else {
    details.itemType = 'Decoration';
  }

  return details;
}

// Function to determine section from context
function determineSection(htmlContent, matchIndex) {
  // Look backwards from the match to find the most recent h2 header
  const beforeMatch = htmlContent.substring(0, matchIndex);
  const sectionMatches = beforeMatch.match(/<h2[^>]*>.*?<span[^>]*>([^<]+)<\/span>.*?<\/h2>/g);
  
  if (sectionMatches && sectionMatches.length > 0) {
    const lastSection = sectionMatches[sectionMatches.length - 1];
    const sectionMatch = lastSection.match(/<span[^>]*>([^<]+)<\/span>/);
    return sectionMatch ? sectionMatch[1] : 'Atlantic Items';
  }
  
  return 'Atlantic Items';
}

// Function to determine season/year from context
function determineSeason(htmlContent, matchIndex) {
  // Look backwards from the match to find the most recent h3 header
  const beforeMatch = htmlContent.substring(Math.max(0, matchIndex - 3000), matchIndex);
  const seasonMatches = beforeMatch.match(/<h3[^>]*>.*?<span[^>]*>([^<]+)<\/span>.*?<\/h3>/g);
  
  if (seasonMatches && seasonMatches.length > 0) {
    const lastSeason = seasonMatches[seasonMatches.length - 1];
    const seasonMatch = lastSeason.match(/<span[^>]*>([^<]+)<\/span>/);
    if (seasonMatch) {
      const seasonText = seasonMatch[1];
      
      // Check if it's a season number
      if (seasonText.match(/Season (\d+)/)) {
        const match = seasonText.match(/Season (\d+)/);
        return {
          seasonNumber: match ? parseInt(match[1]) : null,
          seasonName: seasonText
        };
      }
      
      // Check if it's a year
      if (seasonText.match(/^\d{4}$/)) {
        return {
          seasonNumber: parseInt(seasonText),
          seasonName: seasonText
        };
      }
      
      // Return as-is for other formats
      return {
        seasonNumber: null,
        seasonName: seasonText
      };
    }
  }
  
  return {
    seasonNumber: null,
    seasonName: null
  };
}

// Main scraping function that explodes at table cell pattern
function explodeScraper() {
  try {
    console.log('🔍 Starting explode scraper for Atlantic items...');
    
    // Read the HTML file
    const htmlContent = fs.readFileSync('./atlanticeventrares.html', 'utf8');
    
    const eventItems = [];
    
    // Split by the table cell pattern
    const chunks = htmlContent.split(/<td><span style="padding-right: 1em;" class="verticalcenterimg">/);
    
    console.log(`Found ${chunks.length} chunks to process`);
    
    // Track processed items to avoid duplicates
    const processedItems = new Set();
    
    chunks.forEach((chunk, index) => {
      if (index === 0) return; // Skip the first chunk (before any table cells)
      
      // Find the end of this table row
      const endMatch = chunk.match(/<\/td><\/tr>/);
      if (!endMatch) return; // Skip if no proper end found
      
      const endIndex = chunk.indexOf('</td></tr>');
      const itemChunk = chunk.substring(0, endIndex);
      
      // Extract image information
      const imgMatch = itemChunk.match(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/);
      
              // Extract title and link text
        const titleMatch = itemChunk.match(/title="UO:([^"]+)"/);
        const linkMatch = itemChunk.match(/>([^<]+?)<\/a>/);
        
        if (imgMatch && titleMatch && linkMatch) {
          const altText = imgMatch[1];
          const imageSrc = imgMatch[2];
          const titleContent = titleMatch[1];
          let itemName = linkMatch[1].trim().replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
          
          // Skip if it's the "ImageNotAvailable" placeholder
          if (altText === 'ImageNotAvailable.png') {
            console.log(`⚠️  Skipping ImageNotAvailable for: ${itemName}`);
            return;
          }
          
          // Skip if we've already processed this item
          if (processedItems.has(itemName)) {
            return;
          }
          
          processedItems.add(itemName);
        
        // Extract item details
        const itemDetails = extractItemDetails(altText, itemName);
        
        // Determine section and season from context
        const matchIndex = htmlContent.indexOf(chunk);
        const sectionName = determineSection(htmlContent, matchIndex);
        const seasonInfo = determineSeason(htmlContent, matchIndex);
        
        // Create the event item object
        const eventItem = {
          name: itemName,
          slug: createSlug(itemName),
          description: `${itemName} from ${sectionName} on Atlantic shard`,
          seasonNumber: seasonInfo.seasonNumber,
          seasonName: seasonInfo.seasonName,
          eventYear: seasonInfo.seasonNumber && seasonInfo.seasonNumber > 1990 ? seasonInfo.seasonNumber : null,
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
        
        if (index <= 5) {
          console.log(`Item ${index}: ${itemName} (${sectionName} - ${seasonInfo.seasonName || 'No season'})`);
        }
      } else {
        console.log(`⚠️  Could not parse chunk ${index}: missing image, title, or link`);
      }
    });
    
    console.log(`✅ Scraped ${eventItems.length} event items from ${chunks.length - 1} chunks`);
    
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
  const items = explodeScraper();
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
  
  console.log(`\n📂 Items by Section:`);
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
  
  console.log(`\n🎭 Items by Type:`);
  Object.keys(itemTypes).sort().forEach(type => {
    console.log(`  ${type}: ${itemTypes[type]} items`);
  });
  
  // Group by season
  const seasons = {};
  items.forEach(item => {
    const key = item.seasonName || 'Unknown';
    if (!seasons[key]) {
      seasons[key] = 0;
    }
    seasons[key]++;
  });
  
  console.log(`\n📅 Items by Season/Year:`);
  Object.keys(seasons).sort().forEach(season => {
    console.log(`  ${season}: ${seasons[season]} items`);
  });
}

module.exports = { explodeScraper };
