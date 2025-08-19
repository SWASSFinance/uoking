import { NextRequest, NextResponse } from 'next/server'
import { getMapById, getPlotsByMapId } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [map, plots] = await Promise.all([
      getMapById(params.id),
      getPlotsByMapId(params.id)
    ])
    
    if (!map) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      map,
      plots 
    })
  } catch (error) {
    console.error('Error fetching map:', error)
    return NextResponse.json(
      { error: 'Failed to fetch map' },
      { status: 500 }
    )
  }
}
