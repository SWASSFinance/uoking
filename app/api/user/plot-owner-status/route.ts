import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { isUserPlotOwner } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const isPlotOwner = await isUserPlotOwner(session.user.id)

    return NextResponse.json({ 
      isPlotOwner,
      message: isPlotOwner 
        ? 'You are a plot owner and can create trading posts' 
        : 'You need to own at least one plot to create trading posts'
    })
  } catch (error) {
    console.error('Error checking plot owner status:', error)
    return NextResponse.json(
      { error: 'Failed to check plot owner status' },
      { status: 500 }
    )
  }
}

