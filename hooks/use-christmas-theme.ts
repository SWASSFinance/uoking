'use client'

import { useMemo } from 'react'

/**
 * Checks if the current date is during Christmas season
 * Christmas season is from December 1st to December 31st
 * Returns to normal on January 1st
 * 
 * Can be forced on by setting ?christmas=true in URL or CHRISTMAS_MODE env var
 */
export function useChristmasTheme(): boolean {
  return useMemo(() => {
    // Check for test mode via URL parameter or environment variable
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('christmas') === 'true') {
        return true
      }
    }
    
    // Check environment variable (for testing)
    if (process.env.NEXT_PUBLIC_CHRISTMAS_MODE === 'true') {
      return true
    }
    
    const now = new Date()
    const month = now.getMonth() // 0-11, where 11 is December
    
    // Christmas season: December 1st to December 31st
    // Returns to normal on January 1st (month 0, day 1)
    return month === 11 // December
  }, [])
}

/**
 * Server-side function to check if it's Christmas season
 * Use this in server components
 */
export function isChristmasSeason(): boolean {
  // Check environment variable (for testing)
  if (process.env.NEXT_PUBLIC_CHRISTMAS_MODE === 'true') {
    return true
  }
  
  const now = new Date()
  const month = now.getMonth()
  return month === 11 // December
}

