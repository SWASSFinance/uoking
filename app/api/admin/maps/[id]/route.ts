import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { 
  getMapById, 
  deleteMap,
  query 
} from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email || !session?.user?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }

    const map = await getMapById(params.id)
    
    if (!map) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ map })
  } catch (error) {
    console.error('Error fetching map:', error)
    return NextResponse.json(
      { error: 'Failed to fetch map' },
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
    
    if (!session?.user?.email || !session?.user?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }

    const deletedMap = await deleteMap(params.id)
    
    if (!deletedMap) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Map deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting map:', error)
    return NextResponse.json(
      { error: 'Failed to delete map' },
      { status: 500 }
    )
  }
}
