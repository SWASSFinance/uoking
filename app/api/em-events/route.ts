import { NextRequest, NextResponse } from 'next/server'

interface Event {
  title: string
  time: string
  summary: string
  desc: string
}

// Get user's timezone from IP
async function getUserTimezone(ip: string): Promise<string> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    return data.timezone || 'UTC'
  } catch (error) {
    console.log('Could not detect timezone, using UTC')
    return 'UTC'
  }
}

// Parse HTML and extract events
function parseEvents(html: string): Event[] {
  const events: Event[] = []
  
  // Simple regex-based parsing (more robust than DOM parsing in Node.js)
  const eventBlocks = html.match(/<div[^>]*class="[^"]*type-tribe_events[^"]*"[^>]*>.*?<\/div>/gs)
  
  if (!eventBlocks) {
    return events
  }

  for (const block of eventBlocks) {
    try {
      // Extract title
      const titleMatch = block.match(/<h2[^>]*class="[^"]*tribe-events-list-event-title[^"]*"[^>]*>\s*<a[^>]*>([^<]+)<\/a>/)
      const title = titleMatch ? titleMatch[1].trim() : 'No Title'

      // Extract time
      const timeMatch = block.match(/<span[^>]*class="[^"]*tribe-event-date-start[^"]*"[^>]*>([^<]+)<\/span>/)
      const time = timeMatch ? timeMatch[1].trim() : ''

      // Extract timezone
      const timezoneMatch = block.match(/<span[^>]*class="[^"]*timezone[^"]*"[^>]*>([^<]+)<\/span>/)
      let timezone = timezoneMatch ? timezoneMatch[1].trim() : 'UTC'
      
      // Handle KST specifically
      if (timezone === 'KST') {
        timezone = 'Asia/Seoul'
      }

      // Extract location
      const locationMatch = block.match(/<div[^>]*class="[^"]*tribe-events-venue-details[^"]*"[^>]*>([^<]+)<\/div>/)
      const location = locationMatch ? locationMatch[1].trim() : 'No Location'

      // Extract description
      const descMatch = block.match(/<div[^>]*class="[^"]*tribe-events-list-event-description[^"]*"[^>]*>\s*<p[^>]*>([^<]+)<\/p>/)
      const description = descMatch ? descMatch[1].trim() : 'No Description'

      // Convert time to UTC
      let utcTime = time
      if (time && timezone) {
        try {
          // Normalize the time string
          const fullDateTime = time.replace(/[@,]/g, '') // Remove @ and ,
          
          // Parse the date (assuming format like "December 15 7:00 pm")
          const dateTime = new Date(fullDateTime + ' ' + new Date().getFullYear())
          
          if (!isNaN(dateTime.getTime())) {
            // Convert to UTC
            const utcDate = new Date(dateTime.toLocaleString('en-US', { timeZone: timezone }))
            utcTime = utcDate.toISOString()
          }
        } catch (error) {
          console.log('Error converting time:', error)
          utcTime = time
        }
      }

      events.push({
        title,
        time: utcTime,
        summary: location,
        desc: description
      })
    } catch (error) {
      console.log('Error parsing event block:', error)
    }
  }

  return events
}

export async function GET(request: NextRequest) {
  try {
    // Get user's IP for timezone detection
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1'
    
    // Fetch events from uo.com
    const response = await fetch('https://uo.com/events/list/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`)
    }

    const html = await response.text()
    
    // Parse events from HTML
    const events = parseEvents(html)

    // Sort events by time (upcoming first)
    events.sort((a, b) => {
      const timeA = new Date(a.time).getTime()
      const timeB = new Date(b.time).getTime()
      return timeA - timeB
    })

    return NextResponse.json({
      success: true,
      events,
      total: events.length,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching EM events:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch events',
        events: [],
        total: 0
      },
      { status: 500 }
    )
  }
}
