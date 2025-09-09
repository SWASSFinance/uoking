"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Crown, 
  Calendar,
  DollarSign,
  Users,
  RefreshCw
} from "lucide-react"

interface ContestWinner {
  id: number
  user_id: string
  contest_period: string
  prize_amount: number
  awarded_at: string
  first_name: string
  last_name: string
  email: string
}

export default function ContestResultsPage() {
  const [winners, setWinners] = useState<ContestWinner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalWinners: 0,
    totalPrizeMoney: 0,
    totalContests: 0
  })

  useEffect(() => {
    loadContestResults()
  }, [])

  const loadContestResults = async () => {
    try {
      const response = await fetch('/api/contest-results')
      if (response.ok) {
        const data = await response.json()
        setWinners(data.winners)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading contest results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatContestPeriod = (period: string) => {
    const [year, week] = period.split('-')
    return `Week ${week}, ${year}`
  }

  const groupWinnersByPeriod = () => {
    const grouped: Record<string, ContestWinner[]> = {}
    winners.forEach(winner => {
      if (!grouped[winner.contest_period]) {
        grouped[winner.contest_period] = []
      }
      grouped[winner.contest_period].push(winner)
    })
    return grouped
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading contest results...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const groupedWinners = groupWinnersByPeriod()
  const contestPeriods = Object.keys(groupedWinners).sort().reverse()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-yellow-500 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">Premium Contest Results</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Bi-weekly contests for premium users with cashback prizes
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Winners</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.totalWinners}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Prize Money</p>
                    <p className="text-2xl font-bold text-green-600">${stats.totalPrizeMoney}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contests Held</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalContests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contest Results */}
          {contestPeriods.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-12 text-center">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contest Results Yet</h3>
                <p className="text-gray-600">
                  Contest results will appear here once the first bi-weekly contest is completed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {contestPeriods.map((period) => (
                <Card key={period} className="bg-white/80 backdrop-blur-sm border border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                        {formatContestPeriod(period)}
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        {groupedWinners[period].length} Winner{groupedWinners[period].length !== 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedWinners[period].map((winner) => (
                        <div key={winner.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <Crown className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {winner.first_name} {winner.last_name}
                              </p>
                              <p className="text-sm text-gray-600">Premium User</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ${winner.prize_amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(winner.awarded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* How It Works */}
          <Card className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-purple-600" />
                How the Premium Contest Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contest Details</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Contests run every 2 weeks automatically</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Only premium users are eligible to win</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Winners are selected randomly</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Prizes are added to your cashback balance</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">How to Participate</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Upgrade your account to premium (2000 points)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>No additional action required</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>You're automatically entered each contest</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Check back here for results!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
