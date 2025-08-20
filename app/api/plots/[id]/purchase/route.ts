import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { purchasePlot, getPlotById } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const plotId = params.id

    // Get plot details first to validate it exists
    const plot = await getPlotById(plotId)
    if (!plot) {
      return NextResponse.json(
        { error: 'Plot not found' },
        { status: 404 }
      )
    }

    // Attempt to purchase the plot
    const purchasedPlot = await purchasePlot(plotId, session.user.id)

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${plot.name} for ${plot.points_price} points!`,
      plot: purchasedPlot
    })

  } catch (error) {
    console.error('Error purchasing plot:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plot = await getPlotById(params.id)
    
    if (!plot) {
      return NextResponse.json(
        { error: 'Plot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ plot })

  } catch (error) {
    console.error('Error fetching plot:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
