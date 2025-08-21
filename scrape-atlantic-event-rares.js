const fs = require('fs');
const path = require('path');

// Utility function to create URL-friendly slugs
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
}

// Function to extract season number from season name
function extractSeasonNumber(seasonName) {
  const match = seasonName.match(/Season\s+(\d+)/i);
  return match ? parseInt(match[1]) : null;
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

// Main scraping function
function scrapeAtlanticEventRares() {
  try {
    console.log('🔍 Starting Atlantic event rares scraping...');
    
    // Read the HTML file
    const htmlContent = fs.readFileSync('./atlanticeventrares.html', 'utf8');
    
    const eventItems = [];
    
    // Find all major sections (h2 headers)
    const sectionHeaders = htmlContent.match(/<h2><span class="mw-headline" id="[^"]+">[^<]+<\/span><\/h2>/g);
    console.log('Section headers found:', sectionHeaders);
    console.log(`Found ${sectionHeaders ? sectionHeaders.length : 0} major sections`);
    
    if (sectionHeaders) {
      sectionHeaders.forEach((header, sectionIndex) => {
        // Extract section name
        const sectionNameMatch = header.match(/>([^<]+)</);
        const sectionName = sectionNameMatch ? sectionNameMatch[1] : `Section ${sectionIndex + 1}`;
        console.log(`Processing section: ${sectionName}`);
        
        // Find the content for this section
        const sectionStart = htmlContent.indexOf(header);
        const nextHeader = sectionHeaders[sectionIndex + 1];
        const sectionEnd = nextHeader ? htmlContent.indexOf(nextHeader) : htmlContent.length;
        const sectionContent = htmlContent.substring(sectionStart, sectionEnd);
        
                 // Find all season/year headers in this section
         const seasonHeaders = sectionContent.match(/<h3><span class="mw-headline" id="(\d+|[^"]+)">([^<]+)<\/span><\/h3>/g);
         
         if (seasonHeaders) {
           console.log(`  Found ${seasonHeaders.length} seasons/years in ${sectionName}`);
           
           seasonHeaders.forEach((seasonHeader, seasonIndex) => {
             // Extract season/year info
             const seasonMatch = seasonHeader.match(/id="([^"]+)">([^<]+)</);
             const seasonId = seasonMatch ? seasonMatch[1] : null;
             const seasonName = seasonMatch ? seasonMatch[2] : null;
             
             // Try to extract season number if it's a number
             let seasonNumber = null;
             if (seasonId && /^\d+$/.test(seasonId)) {
               seasonNumber = parseInt(seasonId);
             } else if (seasonName && seasonName.match(/Season (\d+)/)) {
               const match = seasonName.match(/Season (\d+)/);
               seasonNumber = match ? parseInt(match[1]) : null;
             }
            
            // Find the content for this season
            const seasonStart = sectionContent.indexOf(seasonHeader);
            const nextSeasonHeader = seasonHeaders[seasonIndex + 1];
            const seasonEnd = nextSeasonHeader ? sectionContent.indexOf(nextSeasonHeader) : sectionContent.length;
            const seasonContent = sectionContent.substring(seasonStart, seasonEnd);
            
            // Find all table rows in this season
            const tableRows = seasonContent.match(/<tr>[\s\S]*?<\/tr>/g);
            
            if (tableRows) {
              console.log(`    Processing ${tableRows.length} table rows in ${seasonName}`);
              
              tableRows.forEach(row => {
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
                  
                  // Create the event item object
                  const eventItem = {
                    name: itemName,
                    slug: createSlug(itemName),
                    description: `${itemName} from ${seasonName} on Atlantic shard`,
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
          });
        } else {
          // If no season headers, look for items directly in the section
          console.log(`  No seasons found in ${sectionName}, looking for items directly`);
          
          const tableRows = sectionContent.match(/<tr>[\s\S]*?<\/tr>/g);
          
          if (tableRows) {
            console.log(`    Processing ${tableRows.length} table rows directly in ${sectionName}`);
            
            tableRows.forEach(row => {
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
                
                // Create the event item object
                const eventItem = {
                  name: itemName,
                  slug: createSlug(itemName),
                  description: `${itemName} from ${sectionName} on Atlantic shard`,
                  seasonNumber: null,
                  seasonName: null,
                  eventYear: null,
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
  const items = scrapeAtlanticEventRares();
  console.log(`\n📊 Summary:`);
  console.log(`- Total items scraped: ${items.length}`);
  console.log(`- Seasons found: ${[...new Set(items.map(item => item.seasonName))].join(', ')}`);
  console.log(`- Item types: ${[...new Set(items.map(item => item.itemType))].join(', ')}`);
}

module.exports = { scrapeAtlanticEventRares };
