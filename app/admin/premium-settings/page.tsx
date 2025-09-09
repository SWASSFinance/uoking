"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Settings, 
  Save, 
  RefreshCw,
  Users,
  Gift,
  Percent,
  Trophy,
  Calendar,
  DollarSign
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PremiumSettings {
  premium_discount_percentage: number
  deal_of_day_regular_discount: number
  deal_of_day_premium_discount: number
  contest_prize_amount: number
  contest_winners_count: number
  contest_enabled: boolean
}

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

export default function PremiumSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<PremiumSettings>({
    premium_discount_percentage: 10,
    deal_of_day_regular_discount: 15,
    deal_of_day_premium_discount: 25,
    contest_prize_amount: 50,
    contest_winners_count: 2,
    contest_enabled: true
  })
  const [contestWinners, setContestWinners] = useState<ContestWinner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingWinners, setIsLoadingWinners] = useState(false)

  useEffect(() => {
    loadSettings()
    loadContestWinners()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/premium-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast({
        title: "Error",
        description: "Failed to load premium settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadContestWinners = async () => {
    setIsLoadingWinners(true)
    try {
      const response = await fetch('/api/admin/contest-winners')
      if (response.ok) {
        const data = await response.json()
        setContestWinners(data.winners)
      }
    } catch (error) {
      console.error('Error loading contest winners:', error)
      toast({
        title: "Error",
        description: "Failed to load contest winners",
        variant: "destructive",
      })
    } finally {
      setIsLoadingWinners(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/premium-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Premium settings have been updated successfully.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Save Failed",
          description: error.error || "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRunContest = async () => {
    if (!confirm('Are you sure you want to run the contest now? This will select winners and award prizes.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/run-contest', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Contest Completed",
          description: `Selected ${data.winners.length} winners for period ${data.contest_period}. Total prize: $${data.total_prize_amount}`,
        })
        loadContestWinners()
      } else {
        const error = await response.json()
        toast({
          title: "Contest Failed",
          description: error.error || "Failed to run contest",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while running the contest",
        variant: "destructive",
      })
    }
  }

  const updateSetting = (key: keyof PremiumSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading premium settings...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Crown className="h-8 w-8 mr-3 text-purple-600" />
              Premium Settings
            </h1>
            <p className="text-gray-600">Manage premium user features and contest settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Discount Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="premium_discount" className="text-sm font-medium">
                      Premium User Discount (%)
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="premium_discount"
                        type="number"
                        min="0"
                        max="100"
                        value={settings.premium_discount_percentage}
                        onChange={(e) => updateSetting('premium_discount_percentage', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">% off all orders</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deal_regular" className="text-sm font-medium">
                      Deal of the Day - Regular Users (%)
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="deal_regular"
                        type="number"
                        min="0"
                        max="100"
                        value={settings.deal_of_day_regular_discount}
                        onChange={(e) => updateSetting('deal_of_day_regular_discount', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">% off</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deal_premium" className="text-sm font-medium">
                      Deal of the Day - Premium Users (%)
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="deal_premium"
                        type="number"
                        min="0"
                        max="100"
                        value={settings.deal_of_day_premium_discount}
                        onChange={(e) => updateSetting('deal_of_day_premium_discount', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">% off</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Contest Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Contest Enabled</Label>
                      <p className="text-sm text-gray-500">Enable bi-weekly premium user contest</p>
                    </div>
                    <Switch
                      checked={settings.contest_enabled}
                      onCheckedChange={(checked) => updateSetting('contest_enabled', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="prize_amount" className="text-sm font-medium">
                      Prize Amount ($)
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <Input
                        id="prize_amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.contest_prize_amount}
                        onChange={(e) => updateSetting('contest_prize_amount', parseFloat(e.target.value) || 0)}
                        className="w-32"
                      />
                      <span className="text-sm text-gray-500">per winner</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="winners_count" className="text-sm font-medium">
                      Number of Winners
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <Input
                        id="winners_count"
                        type="number"
                        min="1"
                        max="10"
                        value={settings.contest_winners_count}
                        onChange={(e) => updateSetting('contest_winners_count', parseInt(e.target.value) || 1)}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">premium users</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      onClick={handleRunContest}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Run Contest Now
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Manually trigger the bi-weekly contest
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save All Settings"}
              </Button>
            </div>

            {/* Contest Winners Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2" />
                      Contest Winners History
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={loadContestWinners}
                      disabled={isLoadingWinners}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingWinners ? 'animate-spin' : ''}`} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingWinners ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Loading winners...</p>
                    </div>
                  ) : contestWinners.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No contest winners yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contestWinners.map((winner) => (
                        <div key={winner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Crown className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {winner.first_name} {winner.last_name}
                              </p>
                              <p className="text-sm text-gray-500">{winner.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-purple-100 text-purple-800 mb-1">
                              {winner.contest_period}
                            </Badge>
                            <p className="text-sm font-medium text-green-600">
                              ${winner.prize_amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(winner.awarded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
