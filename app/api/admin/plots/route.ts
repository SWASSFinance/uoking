import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { 
  createPlot,
  query 
} from '@/lib/db'

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

    const body = await request.json()
    const { mapId, name, description, latitude, longitude, pointsPrice } = body

    if (!mapId || !name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Map ID, name, latitude, and longitude are required' },
        { status: 400 }
      )
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      )
    }

    const plot = await createPlot(
      mapId,
      name,
      description || '',
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(pointsPrice) || 0,
      userId
    )

    return NextResponse.json({ 
      success: true, 
      plot,
      message: 'Plot created successfully' 
    })
  } catch (error) {
    console.error('Error creating plot:', error)
    return NextResponse.json(
      { error: 'Failed to create plot' },
      { status: 500 }
    )
  }
}
