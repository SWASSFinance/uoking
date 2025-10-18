import { NextRequest, NextResponse } from 'next/server'

// Try to import canvas, fallback to alternative if not available
let createCanvas: any, loadImage: any
try {
  const canvas = require('canvas')
  createCanvas = canvas.createCanvas
  loadImage = canvas.loadImage
} catch (error) {
  console.error('Canvas library not available:', error)
  // We'll handle this in the function
}

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
  try {
    console.log('Image generation request started')
    
    // Check if canvas is available
    if (!createCanvas || !loadImage) {
      console.error('Canvas library not available in production')
      return NextResponse.json({ 
        error: 'Image generation not available in production environment. Canvas library requires native dependencies.' 
      }, { status: 503 })
    }
    
    const { searchParams } = new URL(request.url)
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

    // Create canvas
    console.log('Creating canvas:', { width, height })
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    console.log('Canvas created successfully')

    // Load the map image
    console.log('Loading image:', `public${config.imageUrl}`)
    const mapImage = await loadImage(`public${config.imageUrl}`)
    console.log('Image loaded successfully:', { width: mapImage.width, height: mapImage.height })
    
    // Draw the map image to fill the entire canvas (no letterboxing)
    ctx.drawImage(mapImage, 0, 0, width, height)

    // Add marker if coordinates are provided
    if (coordinates) {
      // Convert UO coordinates directly to canvas coordinates
      // UO coordinates: (0,0) is top-left, (maxX,maxY) is bottom-right
      // Canvas coordinates: (0,0) is top-left, (width,height) is bottom-right
      
      const markerX = (coordinates.x / config.maxX) * width
      const markerY = (coordinates.y / config.maxY) * height

      // Draw thin crossing lines marker
      ctx.strokeStyle = '#ffd700'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      // Horizontal line
      ctx.moveTo(markerX - 15, markerY)
      ctx.lineTo(markerX + 15, markerY)
      
      // Vertical line
      ctx.moveTo(markerX, markerY - 15)
      ctx.lineTo(markerX, markerY + 15)
      
      ctx.stroke()

      // Add coordinate text with smart positioning
      const text = `${coordinates.x}, ${coordinates.y}`
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 3
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      
      // Smart text positioning - avoid edges
      let textX = markerX
      let textY = markerY - 25
      
      // Check if too close to top edge
      if (markerY < 50) {
        textY = markerY + 25 // Move text below marker
      }
      
      // Check if too close to left edge
      if (markerX < 100) {
        textX = markerX + 50 // Move text to the right
        ctx.textAlign = 'left'
      }
      // Check if too close to right edge
      else if (markerX > width - 100) {
        textX = markerX - 50 // Move text to the left
        ctx.textAlign = 'right'
      }
      
      // Draw text outline
      ctx.strokeText(text, textX, textY)
      // Draw text fill
      ctx.fillText(text, textX, textY)
    }

    // Convert canvas to PNG buffer
    console.log('Converting canvas to PNG buffer')
    const buffer = canvas.toBuffer('image/png')
    console.log('PNG buffer created, size:', buffer.length)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })

  } catch (error) {
    console.error('Error generating map image:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
