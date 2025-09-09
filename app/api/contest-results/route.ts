import { NextRequest, NextResponse } from 'next/server'
import { getContestWinners, query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get all contest winners
    const winners = await getContestWinners(100)

    // Calculate stats
    const totalWinners = winners.length
    const totalPrizeMoney = winners.reduce((sum, winner) => sum + winner.prize_amount, 0)
    
    // Count unique contest periods
    const uniquePeriods = new Set(winners.map(winner => winner.contest_period))
    const totalContests = uniquePeriods.size

    return NextResponse.json({
      success: true,
      winners,
      stats: {
        totalWinners,
        totalPrizeMoney,
        totalContests
      }
    })

  } catch (error) {
    console.error('Error fetching contest results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contest results' },
      { status: 500 }
    )
  }
}
