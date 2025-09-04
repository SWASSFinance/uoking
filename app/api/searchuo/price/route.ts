import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName } = body

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    // Clean the product name by removing common words that might interfere with search
    const cleanProductName = productName
      .replace(/\b(of|the|and|or|but|in|on|at|to|for|with|by|from|up|about|into|through|during|before|after|above|below|between|among|under|over|around|near|far|here|there|where|when|why|how|what|who|which|that|this|these|those|a|an|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|must|can|shall)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim()

    console.log('Original product name:', productName)
    console.log('Cleaned product name:', cleanProductName)

    // Search SearchUO for the product
    const searchUrl = 'https://www.searchuo.com/storesearch.php'
    const formData = new URLSearchParams()
    formData.append('storesearch', cleanProductName)

    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`SearchUO request failed: ${response.status}`)
    }

    const html = await response.text()
    
    // Debug: Log a portion of the HTML to see what we're getting
    console.log('SearchUO HTML Response (first 2000 chars):', html.substring(0, 2000))
    
    // Find the position of searchrowone to see the context
    const searchrowoneIndex = html.indexOf('searchrowone')
    if (searchrowoneIndex !== -1) {
      console.log('Found searchrowone at position:', searchrowoneIndex)
      console.log('Context around searchrowone:', html.substring(searchrowoneIndex - 100, searchrowoneIndex + 1000))
    }
    
    // Find the position of searchrowprice to see the context
    const searchrowpriceIndex = html.indexOf('searchrowprice')
    if (searchrowpriceIndex !== -1) {
      console.log('Found searchrowprice at position:', searchrowpriceIndex)
      console.log('Context around searchrowprice:', html.substring(searchrowpriceIndex - 100, searchrowpriceIndex + 200))
    }
    
    // Look for various possible search result patterns
    let searchResultHtml = ''
    let searchResultsMatch = null
    
    // Try different patterns for search results
    const patterns = [
      /<div id="searchrowone">(.*?)<div style="clear:both;"><\/div><\/div>/s,
      /<div class="searchrowone">(.*?)<div style="clear:both;"><\/div><\/div>/s,
      /<div id="searchrowone"[^>]*>(.*?)<div style="clear:both;"><\/div><\/div>/s,
      /<div class="search-result">(.*?)<\/div>/s,
      /<div class="item-result">(.*?)<\/div>/s,
      /<tr class="search-row">(.*?)<\/tr>/s
    ]
    
    for (const pattern of patterns) {
      searchResultsMatch = html.match(pattern)
      if (searchResultsMatch) {
        searchResultHtml = searchResultsMatch[1]
        console.log('Found search results with pattern:', pattern.toString())
        break
      }
    }
    
    if (!searchResultsMatch) {
      console.log('No search result container found in HTML')
      console.log('HTML contains searchrowone:', html.includes('searchrowone'))
      console.log('HTML contains searchrowprice:', html.includes('searchrowprice'))
      console.log('HTML contains Price:', html.includes('Price:'))
      
      // Try to find any price pattern in the entire HTML
      const anyPriceMatch = html.match(/\$([0-9.]+)/)
      if (anyPriceMatch) {
        console.log('Found price in HTML:', anyPriceMatch[1])
      }
      
      // Try a more direct approach - look for the price span directly (handle both single and double quotes)
      let directPriceMatch = html.match(/<span id='searchrowprice'>\$([0-9.]+)<\/span>/)
      if (!directPriceMatch) {
        directPriceMatch = html.match(/<span id="searchrowprice">\$([0-9.]+)<\/span>/)
      }
      
      // Look for product links specifically (not navigation links) - handle both single and double quotes
      let productLinks = html.match(/<a href='\/uoitems\.php\?product=\d+'>([^<]+)<\/a>/g)
      if (!productLinks) {
        productLinks = html.match(/<a href="\/uoitems\.php\?product=\d+">([^<]+)<\/a>/g)
      }
      
      let directItemMatch = null
      if (productLinks && productLinks.length > 0) {
        const firstProductLink = productLinks[0]
        directItemMatch = firstProductLink.match(/<a href='\/uoitems\.php\?product=\d+'>([^<]+)<\/a>/)
        if (!directItemMatch) {
          directItemMatch = firstProductLink.match(/<a href="\/uoitems\.php\?product=\d+">([^<]+)<\/a>/)
        }
      }
      
      if (directPriceMatch && directItemMatch) {
        console.log('Found direct matches!')
        
        // Extract item details from the context around the price - get more complete details
        const priceContext = html.substring(searchrowpriceIndex - 200, searchrowpriceIndex + 1000)
        
        // Try multiple patterns to get the complete item details
        let detailsMatch = priceContext.match(/<\/b><BR>\s*([^<]+)</)
        if (!detailsMatch) {
          detailsMatch = priceContext.match(/<\/span><\/b><BR>\s*([^<]+)</)
        }
        if (!detailsMatch) {
          detailsMatch = priceContext.match(/Price:.*?<\/span><\/b><BR>\s*([^<]+)</)
        }
        
        let itemDetails = detailsMatch ? detailsMatch[1].trim() : null
        
        console.log('Initial item details:', itemDetails)
        
        // If we found details, try to get more complete information
        if (itemDetails) {
          // Look for additional details that might be on the next line
          const extendedContext = html.substring(searchrowpriceIndex - 200, searchrowpriceIndex + 1500)
          const extendedMatch = extendedContext.match(/<\/b><BR>\s*([^<]+)<BR>/)
          if (extendedMatch && extendedMatch[1].trim().length > itemDetails.length) {
            itemDetails = extendedMatch[1].trim()
            console.log('Extended item details:', itemDetails)
          }
        }
        
        console.log('Final item details:', itemDetails)
        
        // Format the item details to be more readable
        if (itemDetails) {
          // Split by common stat patterns and clean up
          itemDetails = itemDetails
            .replace(/([A-Z][a-z]+)\s+(\d+)/g, '$1 $2') // Add space between words and numbers
            .replace(/(\d+)\s*%/g, '$1%') // Clean up percentage formatting
            .trim()
        }
        
        // Try to find the item image
        const imageMatch = html.match(/<img[^>]*alt='([^']*)[^>]*src='([^']*)'/)
        const imageUrl = imageMatch ? `https://www.searchuo.com${imageMatch[2]}` : null
        
        return NextResponse.json({
          success: true,
          found: true,
          price: parseFloat(directPriceMatch[1]),
          itemName: directItemMatch[1],
          imageUrl: imageUrl,
          itemDetails: itemDetails,
          source: 'SearchUO',
          searchTerm: productName,
          cleanedSearchTerm: cleanProductName,
          method: 'direct'
        })
      }
      
      return NextResponse.json({
        success: true,
        found: false,
        message: `No results found for "${productName}" on SearchUO`,
        searchTerm: productName,
        cleanedSearchTerm: cleanProductName,
        debug: {
          hasSearchrowone: html.includes('searchrowone'),
          hasSearchrowprice: html.includes('searchrowprice'),
          hasPrice: html.includes('Price:'),
          htmlLength: html.length,
          htmlSample: html.substring(0, 1000),
          directPriceMatch: directPriceMatch,
          directItemMatch: directItemMatch,
          productLinks: productLinks
        }
      })
    }
    
    console.log('Search result HTML:', searchResultHtml)
    
    // Parse the HTML to extract price from the first result - try multiple patterns
    let priceMatch = searchResultHtml.match(/<span id="searchrowprice">\$([0-9.]+)<\/span>/)
    if (!priceMatch) {
      priceMatch = searchResultHtml.match(/Price:\s*<[^>]*>\$([0-9.]+)<\/[^>]*>/)
    }
    if (!priceMatch) {
      priceMatch = searchResultHtml.match(/\$([0-9.]+)/)
    }
    
    let itemNameMatch = searchResultHtml.match(/<a href="[^"]*">([^<]+)<\/a>/)
    if (!itemNameMatch) {
      itemNameMatch = searchResultHtml.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/)
    }
    
    let itemImageMatch = searchResultHtml.match(/<img alt="([^"]*)" src="([^"]*)"/)
    if (!itemImageMatch) {
      itemImageMatch = searchResultHtml.match(/<img src="([^"]*)" alt="([^"]*)"/)
    }
    
    console.log('Price match:', priceMatch)
    console.log('Item name match:', itemNameMatch)
    console.log('Image match:', itemImageMatch)
    
    if (priceMatch && itemNameMatch) {
      const price = priceMatch[1]
      const itemName = itemNameMatch[1]
      const imageUrl = itemImageMatch ? `https://www.searchuo.com${itemImageMatch[2]}` : null
      
      // Extract item details from the description
      const detailsMatch = searchResultHtml.match(/<div id="searchrowdetails">.*?<br>(.*?)<br>/s)
      const itemDetails = detailsMatch ? detailsMatch[1].trim() : null
      
      return NextResponse.json({
        success: true,
        found: true,
        price: parseFloat(price),
        itemName,
        imageUrl,
        itemDetails,
        source: 'SearchUO',
        searchTerm: productName
      })
    } else {
      return NextResponse.json({
        success: true,
        found: false,
        message: `No results found for "${productName}" on SearchUO`,
        searchTerm: productName,
        debug: {
          hasPriceMatch: !!priceMatch,
          hasItemNameMatch: !!itemNameMatch,
          priceMatch: priceMatch,
          itemNameMatch: itemNameMatch
        }
      })
    }

  } catch (error) {
    console.error('Error fetching SearchUO price:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch price from SearchUO', 
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}
