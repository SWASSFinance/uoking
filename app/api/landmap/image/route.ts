import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const MAP_CONFIGS: Record<string, { name: string; imageUrl: string; maxX: number; maxY: number }> = {
  telmur: {
    name: "Ter Mur",
    imageUrl: "/uo/Ter_mur_map.jpg",
    maxX: 4200,
    maxY: 4200
  },
  malas: {
    name: "Malas",
    imageUrl: "/uo/malas.png",
    maxX: 5120,
    maxY: 4096
  },
  felucca: {
    name: "Felucca",
    imageUrl: "/uo/felucca.png",
    maxX: 7168,
    maxY: 4096
  },
  trammel: {
    name: "Trammel",
    imageUrl: "/uo/trammel.png",
    maxX: 7168,
    maxY: 4096
  },
  ilshenar: {
    name: "Ilshenar",
    imageUrl: "/uo/ilshenar.png",
    maxX: 5120,
    maxY: 4096
  }
}

// Coordinate conversion functions based on the UO map system
// This uses the proper UO coordinate system where 0,0 is top-left and maxX,maxY is bottom-right
function convertCoordY(gameY: number, maxY: number, mapType: string): number {
  // Get map-specific bounds
  let mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
  
  if (mapType === 'malas') {
    mapBounds = { minLat: 4, maxLat: 8, minLng: -7, maxLng: -2 }
  } else if (mapType === 'felucca' || mapType === 'trammel') {
    // Calculate proper bounds based on image aspect ratio
    const imageAspectRatio = 7168 / 4096 // 1.75
    const mapHeight = 10 // Total height in map units
    const mapWidth = mapHeight * imageAspectRatio // 17.5
    const centerLat = 5
    const centerLng = -2
    
    mapBounds = { 
      minLat: centerLat - mapHeight/2, 
      maxLat: centerLat + mapHeight/2, 
      minLng: centerLng - mapWidth/2, 
      maxLng: centerLng + mapWidth/2 
    }
  } else if (mapType === 'ilshenar') {
    mapBounds = { minLat: 4, maxLat: 9, minLng: -7, maxLng: -3 }
  } else {
    // Ter Mur
    mapBounds = { minLat: -2, maxLat: 4, minLng: -8, maxLng: -3 }
  }
  
  // Convert game Y (0 to maxY) to map latitude
  // In UO coordinates, Y=0 is top, Y=maxY is bottom
  // In map coordinates, higher lat is north, lower lat is south
  const normalizedY = gameY / maxY  // 0 to 1
  const mapY = mapBounds.maxLat - (normalizedY * (mapBounds.maxLat - mapBounds.minLat))
  
  return mapY
}

function convertCoordX(gameX: number, maxX: number, mapType: string): number {
  // Get map-specific bounds
  let mapBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
  
  if (mapType === 'malas') {
    mapBounds = { minLat: 4, maxLat: 8, minLng: -7, maxLng: -2 }
  } else if (mapType === 'felucca' || mapType === 'trammel') {
    // Calculate proper bounds based on image aspect ratio
    const imageAspectRatio = 7168 / 4096 // 1.75
    const mapHeight = 10 // Total height in map units
    const mapWidth = mapHeight * imageAspectRatio // 17.5
    const centerLat = 5
    const centerLng = -2
    
    mapBounds = { 
      minLat: centerLat - mapHeight/2, 
      maxLat: centerLat + mapHeight/2, 
      minLng: centerLng - mapWidth/2, 
      maxLng: centerLng + mapWidth/2 
    }
  } else if (mapType === 'ilshenar') {
    mapBounds = { minLat: 4, maxLat: 9, minLng: -7, maxLng: -3 }
  } else {
    // Ter Mur
    mapBounds = { minLat: -2, maxLat: 4, minLng: -8, maxLng: -3 }
  }
  
  // Convert game X (0 to maxX) to map longitude
  // In UO coordinates, X=0 is left, X=maxX is right
  // In map coordinates, higher lng is east, lower lng is west
  const normalizedX = gameX / maxX  // 0 to 1
  const mapX = mapBounds.minLng + (normalizedX * (mapBounds.maxLng - mapBounds.minLng))
  
  return mapX
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  try {
    console.log('Image generation request started')
    const mapParam = searchParams.get('map')
    const xParam = searchParams.get('x')
    const yParam = searchParams.get('y')
    const width = parseInt(searchParams.get('width') || '800')
    const height = parseInt(searchParams.get('height') || '600')

    console.log('Request params:', { mapParam, xParam, yParam, width, height })

    if (!mapParam) {
      return NextResponse.json({ error: 'Map parameter is required' }, { status: 400 })
    }

    const config = MAP_CONFIGS[mapParam]
    if (!config) {
      return NextResponse.json({ error: `Unknown map: ${mapParam}` }, { status: 400 })
    }

    // Parse coordinates
    let coordinates: { x: number; y: number } | null = null
    if (xParam && yParam) {
      const x = parseInt(xParam)
      const y = parseInt(yParam)
      
      if (isNaN(x) || isNaN(y)) {
        return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
      }

      if (x < 0 || x > config.maxX || y < 0 || y > config.maxY) {
        return NextResponse.json({ error: `Coordinates out of bounds. X must be 0-${config.maxX}, Y must be 0-${config.maxY}` }, { status: 400 })
      }

      coordinates = { x, y }
    }

    // Load and resize the map image using Sharp
    console.log('Loading image with Sharp:', `public${config.imageUrl}`)
    const imagePath = path.join(process.cwd(), 'public', config.imageUrl.replace('/uo/', 'uo/'))
    
    let image = sharp(imagePath)
      .resize(width, height, { 
        fit: 'fill' // Fill the entire canvas (no letterboxing)
      })

    // Add marker if coordinates are provided
    if (coordinates) {
      const markerX = Math.round((coordinates.x / config.maxX) * width)
      const markerY = Math.round((coordinates.y / config.maxY) * height)
      
      console.log('Adding marker at:', { markerX, markerY })

      // Create SVG overlay for marker
      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <!-- Horizontal line -->
          <line x1="${markerX - 15}" y1="${markerY}" x2="${markerX + 15}" y2="${markerY}" 
                stroke="#ffd700" stroke-width="2"/>
          <!-- Vertical line -->
          <line x1="${markerX}" y1="${markerY - 15}" x2="${markerX}" y2="${markerY + 15}" 
                stroke="#ffd700" stroke-width="2"/>
          <!-- Text -->
          <text x="${markerX}" y="${markerY - 25}" 
                text-anchor="middle" 
                fill="white" 
                font-family="Arial" 
                font-size="14" 
                font-weight="bold">${coordinates.x}, ${coordinates.y}</text>
        </svg>
      `

      // Apply SVG overlay
      image = image.composite([{
        input: Buffer.from(svg),
        top: 0,
        left: 0
      }])
    }

    // Generate PNG buffer
    console.log('Generating PNG with Sharp')
    const buffer = await image.png().toBuffer()
    console.log('PNG buffer created, size:', buffer.length)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })

  } catch (error) {
    console.error('Error generating map image:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Return detailed error information
    const errorDetails = {
      error: 'Failed to generate image',
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      requestParams: {
        map: searchParams.get('map'),
        x: searchParams.get('x'),
        y: searchParams.get('y'),
        width: searchParams.get('width'),
        height: searchParams.get('height')
      }
    }
    
    return NextResponse.json(errorDetails, { status: 500 })
  }
}
