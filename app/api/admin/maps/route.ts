import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { 
  getAllMaps, 
  uploadMap, 
  createMapTable,
  query 
} from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session?.user?.isAdmin) {
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
    
    if (!session?.user?.email || !session?.user?.isAdmin) {
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

    // Parse JSON data
    const body = await request.json()
    const { name, description, mapFileUrl, mapFileSize } = body

    if (!name || !mapFileUrl) {
      return NextResponse.json(
        { error: 'Name and map file URL are required' },
        { status: 400 }
      )
    }

    // Save to database
    const map = await uploadMap(
      name,
      description || '',
      mapFileUrl,
      mapFileSize || 0,
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
