import { NextRequest, NextResponse } from 'next/server'
import { selectContestWinners } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel cron request
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Running bi-weekly contest...')
    
    const result = await selectContestWinners()

    console.log(`Contest completed: ${result.winners.length} winners selected for period ${result.contest_period}`)

    return NextResponse.json({
      success: true,
      message: `Contest completed successfully for period ${result.contest_period}`,
      ...result
    })

  } catch (error) {
    console.error('Error running scheduled contest:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to run scheduled contest' },
      { status: 500 }
    )
  }
}
