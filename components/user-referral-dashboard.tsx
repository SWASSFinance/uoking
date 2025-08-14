"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  DollarSign, 
  Copy, 
  Share2, 
  Gift,
  TrendingUp,
  Clock
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ReferralStats {
  total_referrals: number
  total_earnings: number
  referral_code: string
  active_referrals: number
}

interface CashbackBalance {
  balance: number
  total_earned: number
  total_used: number
}

export function UserReferralDashboard({ userId }: { userId: string }) {
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null)
  const [cashbackBalance, setCashbackBalance] = useState<CashbackBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const [referralResponse, cashbackResponse] = await Promise.all([
        fetch(`/api/user/referral-stats?userId=${userId}`),
        fetch(`/api/user/cashback-balance?userId=${userId}`)
      ])

      if (referralResponse.ok) {
        const referralData = await referralResponse.json()
        setReferralStats(referralData.stats)
      }

      if (cashbackResponse.ok) {
        const cashbackData = await cashbackResponse.json()
        setCashbackBalance(cashbackData.balance)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = async () => {
    if (!referralStats?.referral_code) return

    const referralLink = `${window.location.origin}/signup?ref=${referralStats.referral_code}`
    
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast({
        title: "Referral link copied!",
        description: "Share this link with your friends to earn rewards.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareReferralLink = async () => {
    if (!referralStats?.referral_code) return

    const referralLink = `${window.location.origin}/signup?ref=${referralStats.referral_code}`
    const text = `Join UOKing and get amazing Ultima Online items! Use my referral code: ${referralStats.referral_code}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join UOKing',
          text: text,
          url: referralLink,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback to copying
      copyReferralLink()
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Referral & Rewards</h2>
        <Badge variant="secondary" className="flex items-center">
          <Gift className="h-4 w-4 mr-1" />
          Earn Rewards
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Stats */}
        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Your Referrals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {referralStats?.total_referrals || 0}
                </div>
                <div className="text-sm text-gray-600">Total Referrals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${referralStats?.total_earnings?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>

            {referralStats?.referral_code && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Your Referral Code
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={referralStats.referral_code}
                    readOnly
                    className="font-mono text-center bg-white"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyReferralLink}
                    className={copied ? 'bg-green-100 text-green-700' : ''}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={shareReferralLink}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>How it works:</strong> Share your referral link with friends. 
                When they make their first purchase, you both earn rewards!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cashback Balance */}
        <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Cashback Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${cashbackBalance?.balance?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-600">Available Balance</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  ${cashbackBalance?.total_earned?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-600">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  ${cashbackBalance?.total_used?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-600">Total Used</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Earn Rate:</span>
                <span className="font-medium">5% on all orders</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Referral Bonus:</span>
                <span className="font-medium">2.5% on referrals</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Expiry:</span>
                <span className="font-medium">365 days</span>
              </div>
            </div>

            <div className="bg-green-100 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Use your cashback:</strong> Apply your balance during checkout 
                to save money on your next purchase!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            How the Referral System Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Share Your Link</h3>
              <p className="text-sm text-gray-600">
                Share your unique referral link with friends and family
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">They Sign Up</h3>
              <p className="text-sm text-gray-600">
                When they sign up using your link, you're connected
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-gray-600">
                When they make their first purchase, you both earn cashback!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 