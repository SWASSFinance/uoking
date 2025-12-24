'use client'

import { useMemo } from 'react'

/**
 * Checks if the current date is during Christmas season
 * Christmas season is from December 1st to December 31st
 * Returns to normal on January 1st
 */
export function useChristmasTheme(): boolean {
  return useMemo(() => {
    const now = new Date()
    const month = now.getMonth() // 0-11, where 11 is December
    const day = now.getDate()
    
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
  const now = new Date()
  const month = now.getMonth()
  return month === 11 // December
}

