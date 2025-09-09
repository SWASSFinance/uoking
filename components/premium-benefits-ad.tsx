"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Percent, 
  Gift, 
  Trophy, 
  Star,
  X,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

interface PremiumBenefitsAdProps {
  className?: string
  variant?: 'banner' | 'card' | 'modal'
  showCloseButton?: boolean
  onClose?: () => void
}

export function PremiumBenefitsAd({ 
  className = "", 
  variant = 'card',
  showCloseButton = false,
  onClose 
}: PremiumBenefitsAdProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  const benefits = [
    {
      icon: Percent,
      title: "Automatic Discounts",
      description: "Get 10% off all orders automatically",
      color: "text-purple-600"
    },
    {
      icon: Gift,
      title: "Enhanced Deals",
      description: "25% off deal of the day (vs 15% for regular users)",
      color: "text-amber-600"
    },
    {
      icon: Trophy,
      title: "Bi-Weekly Contests",
      description: "Win $50 cashback every 2 weeks",
      color: "text-green-600"
    },
    {
      icon: Star,
      title: "Premium Styling",
      description: "Special borders and premium account badge",
      color: "text-pink-600"
    }
  ]

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upgrade to Premium</h3>
              <p className="text-sm text-gray-600">Get exclusive discounts and benefits</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Link href="/account">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Link>
            </Button>
            {showCloseButton && (
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Premium Account Benefits</h2>
                  <p className="text-gray-600">Unlock exclusive features and savings</p>
                </div>
              </div>
              {showCloseButton && (
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center ${benefit.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Upgrade Cost</h3>
                  <p className="text-sm text-gray-600">One-time upgrade using your points</p>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-lg">
                  <Crown className="h-4 w-4 mr-2" />
                  2000 Points
                </Badge>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button asChild className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Link href="/account">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Link>
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Maybe Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default card variant
  return (
    <Card className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Premium Account</h3>
              <p className="text-sm text-gray-600">Unlock exclusive benefits</p>
            </div>
          </div>
          {showCloseButton && (
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-6 h-6 bg-white rounded-full flex items-center justify-center ${benefit.color}`}>
                  <IconComponent className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">{benefit.title}</p>
                  <p className="text-xs text-gray-600">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-600">Upgrade for </span>
            <span className="font-semibold text-purple-600">2000 points</span>
          </div>
          <Button asChild size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Link href="/account">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
