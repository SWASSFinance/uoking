import { NextRequest, NextResponse } from 'next/server'
import { createCanvas, loadImage, registerFont } from 'canvas'
import path from 'path'

const MAP_CONFIGS: Record<string, { name: string; imageUrl: string; maxX: number; maxY: number }> = {
  telmur: {
    name: "Ter Mur",
    imageUrl: "/uo/telmur.jpg",
    maxX: 1885,
    maxY: 5485
  },
  malas: {
    name: "Malas",
    imageUrl: "/uo/malas.png",
    maxX: 2546,
    maxY: 2056
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
    maxX: 2300,
    maxY: 1600
  },
  tokuno: {
    name: "Tokuno",
    imageUrl: "/uo/tokuno.png",
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
    // Calculate proper bounds based on image aspect ratio for Ilshenar
    const mapConfig = MAP_CONFIGS[mapType]
    const imageAspectRatio = mapConfig.maxX / mapConfig.maxY // 2300/1600 = 1.4375
    const mapHeight = 5 // Total height in map units
    const mapWidth = mapHeight * imageAspectRatio // 5 * 1.4375 = 7.1875
    const centerLat = 6.5
    const centerLng = -5
    
    mapBounds = { 
      minLat: centerLat - mapHeight/2, 
      maxLat: centerLat + mapHeight/2, 
      minLng: centerLng - mapWidth/2, 
      maxLng: centerLng + mapWidth/2 
    }
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
    // Calculate proper bounds based on image aspect ratio for Ilshenar
    const mapConfig = MAP_CONFIGS[mapType]
    const imageAspectRatio = mapConfig.maxX / mapConfig.maxY // 2300/1600 = 1.4375
    const mapHeight = 5 // Total height in map units
    const mapWidth = mapHeight * imageAspectRatio // 5 * 1.4375 = 7.1875
    const centerLat = 6.5
    const centerLng = -5
    
    mapBounds = { 
      minLat: centerLat - mapHeight/2, 
      maxLat: centerLat + mapHeight/2, 
      minLng: centerLng - mapWidth/2, 
      maxLng: centerLng + mapWidth/2 
    }
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
    
    // Register the uploaded font for consistent text rendering
    try {
      registerFont(path.join(process.cwd(), 'public/fonts/arial.ttf'), { family: 'Arial' })
      console.log('Font registered successfully')
    } catch (error) {
      console.log('Font registration failed, using default fonts:', error)
    }
    const mapParam = searchParams.get('map')
    const xParam = searchParams.get('x')
    const yParam = searchParams.get('y')
    const zoom = parseFloat(searchParams.get('zoom') || '1')
    const width = parseInt(searchParams.get('width') || '800')
    const height = parseInt(searchParams.get('height') || '600')

    console.log('Request params:', { mapParam, xParam, yParam, zoom, width, height })

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

    // Load and resize the map image using Canvas
    console.log('Loading image with Canvas:', `public${config.imageUrl}`)
    const imagePath = path.join(process.cwd(), 'public', config.imageUrl.replace('/uo/', 'uo/'))
    
    // Load the map image
    const mapImage = await loadImage(imagePath)
    console.log('Image loaded successfully:', { 
      width: mapImage.width, 
      height: mapImage.height,
      configMaxX: config.maxX,
      configMaxY: config.maxY,
      aspectRatio: mapImage.width / mapImage.height,
      configAspectRatio: config.maxX / config.maxY
    })
    
    // Create canvas
    console.log('Creating canvas:', { width, height })
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    console.log('Canvas created successfully')

    // Apply zoom if coordinates are provided
    if (coordinates && zoom > 1) {
      console.log('Applying zoom:', { zoom })
      
      // Calculate crop area around the marker
      const markerX = Math.round((coordinates.x / config.maxX) * mapImage.width)
      const markerY = Math.round((coordinates.y / config.maxY) * mapImage.height)
      
      // Calculate crop dimensions based on zoom level
      const cropWidth = Math.round(mapImage.width / zoom)
      const cropHeight = Math.round(mapImage.height / zoom)
      
      // Calculate crop position (center on marker)
      const cropLeft = Math.max(0, Math.min(markerX - cropWidth / 2, mapImage.width - cropWidth))
      const cropTop = Math.max(0, Math.min(markerY - cropHeight / 2, mapImage.height - cropHeight))
      
      console.log('Zoom calculations:', { 
        zoom, 
        markerX, 
        markerY, 
        cropWidth, 
        cropHeight, 
        cropLeft, 
        cropTop
      })
      
      // Draw cropped portion of the image
      ctx.drawImage(
        mapImage,
        cropLeft, cropTop, cropWidth, cropHeight,  // Source rectangle (crop)
        0, 0, width, height  // Destination rectangle (fill canvas)
      )
    } else {
      // Draw the full map image
      ctx.drawImage(mapImage, 0, 0, width, height)
    }

    // Add marker if coordinates are provided
    if (coordinates) {
      // Calculate marker position
      let markerX, markerY
      
      if (zoom > 1) {
        // When zoomed, marker is centered
        markerX = Math.round(width / 2)
        markerY = Math.round(height / 2)
      } else {
        // Normal positioning for zoom = 1
        markerX = Math.round((coordinates.x / config.maxX) * width)
        markerY = Math.round((coordinates.y / config.maxY) * height)
      }
      
      console.log('Adding marker at:', { markerX, markerY })

      // Draw thin crossing lines marker
      ctx.strokeStyle = '#ffd700'
      ctx.lineWidth = 3
      ctx.beginPath()
      
      // Horizontal line
      ctx.moveTo(markerX - 15, markerY)
      ctx.lineTo(markerX + 15, markerY)
      
      // Vertical line
      ctx.moveTo(markerX, markerY - 15)
      ctx.lineTo(markerX, markerY + 15)
      
      ctx.stroke()

      // Add coordinate text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${coordinates.x}, ${coordinates.y}`, markerX, markerY - 25)

      // Add map name
      ctx.font = 'bold 18px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(config.name, 20, 30)
    }

    // Convert canvas to PNG buffer
    console.log('Converting canvas to PNG buffer')
    const buffer = canvas.toBuffer('image/png')
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
