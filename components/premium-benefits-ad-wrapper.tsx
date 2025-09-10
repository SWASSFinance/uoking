"use client"

import { useState, useEffect } from 'react'
import { PremiumBenefitsAd } from './premium-benefits-ad'

interface PremiumBenefitsAdWrapperProps {
  className?: string
  variant?: 'banner' | 'card' | 'modal'
  showCloseButton?: boolean
  onClose?: () => void
}

interface UserProfile {
  account_rank?: number
}

export function PremiumBenefitsAdWrapper({ 
  className = "", 
  variant = 'banner',
  showCloseButton = false,
  onClose 
}: PremiumBenefitsAdWrapperProps) {
  const [isPremiumUser, setIsPremiumUser] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const profile: UserProfile = await response.json()
          setIsPremiumUser(profile.account_rank === 1)
        } else {
          // If not authenticated or error, show the ad
          setIsPremiumUser(false)
        }
      } catch (error) {
        console.error('Error checking premium status:', error)
        // On error, show the ad to be safe
        setIsPremiumUser(false)
      } finally {
        setLoading(false)
      }
    }

    checkPremiumStatus()
  }, [])

  // Show loading state briefly to prevent flash
  if (loading) {
    return null
  }

  // Don't show the ad if user is already premium
  if (isPremiumUser) {
    return null
  }

  // Show the ad for non-premium users
  return (
    <PremiumBenefitsAd 
      className={className}
      variant={variant}
      showCloseButton={showCloseButton}
      onClose={onClose}
    />
  )
}
