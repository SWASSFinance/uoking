"use client"

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
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
  const { data: session, status } = useSession()
  const [isPremiumUser, setIsPremiumUser] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const hasChecked = useRef(false)

  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') {
      return
    }

    // Prevent duplicate checks (React strict mode causes double renders)
    if (hasChecked.current) {
      return
    }

    // If user is not logged in, don't make API call - just show the ad
    if (!session?.user?.email) {
      setIsPremiumUser(false)
      setLoading(false)
      return
    }

    // Only check premium status if user is logged in
    hasChecked.current = true

    const checkPremiumStatus = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const profile: UserProfile = await response.json()
          setIsPremiumUser(profile.account_rank === 1)
        } else {
          // Any error - show the ad
          setIsPremiumUser(false)
        }
      } catch (error) {
        // Network errors - silently handle
        setIsPremiumUser(false)
      } finally {
        setLoading(false)
      }
    }

    checkPremiumStatus()
  }, [session, status])

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

