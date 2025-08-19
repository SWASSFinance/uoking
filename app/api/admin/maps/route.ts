import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { 
  getAllMaps, 
  uploadMap, 
  createMapTable,
  query 
} from '@/lib/db'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session?.user?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }

    // Ensure map tables exist
    await createMapTable()
    
    // Get all maps
    const maps = await getAllMaps()

    return NextResponse.json({ maps })
  } catch (error) {
    console.error('Error fetching maps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maps' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session?.user?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }

    // Get user ID
    const userResult = await query('SELECT id FROM users WHERE email = $1', [session.user.email])
    if (!userResult.rows.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    const userId = userResult.rows[0].id

    // Parse form data
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const mapFile = formData.get('mapFile') as File

    if (!name || !mapFile) {
      return NextResponse.json(
        { error: 'Name and map file are required' },
        { status: 400 }
      )
    }

    // Check file size (100MB limit)
    if (mapFile.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 100MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await mapFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'maps',
          public_id: `map_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    }) as any

    // Save to database
    const map = await uploadMap(
      name,
      description || '',
      uploadResult.secure_url,
      mapFile.size,
      userId
    )

    return NextResponse.json({ 
      success: true, 
      map,
      message: 'Map uploaded successfully' 
    })
  } catch (error) {
    console.error('Error uploading map:', error)
    return NextResponse.json(
      { error: 'Failed to upload map' },
      { status: 500 }
    )
  }
}
