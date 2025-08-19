import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { 
  updatePlot,
  deletePlot
} from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, latitude, longitude, pointsPrice } = body

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Name, latitude, and longitude are required' },
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

    const plot = await updatePlot(
      params.id,
      name,
      description || '',
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(pointsPrice) || 0
    )

    if (!plot) {
      return NextResponse.json(
        { error: 'Plot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      plot,
      message: 'Plot updated successfully' 
    })
  } catch (error) {
    console.error('Error updating plot:', error)
    return NextResponse.json(
      { error: 'Failed to update plot' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }

    const deletedPlot = await deletePlot(params.id)
    
    if (!deletedPlot) {
      return NextResponse.json(
        { error: 'Plot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Plot deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting plot:', error)
    return NextResponse.json(
      { error: 'Failed to delete plot' },
      { status: 500 }
    )
  }
}
