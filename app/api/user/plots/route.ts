import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { getUserOwnedPlots } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const plots = await getUserOwnedPlots(session.user.id)

    return NextResponse.json({
      plots
    })

  } catch (error) {
    console.error('Error fetching user plots:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ) 
  }
}
