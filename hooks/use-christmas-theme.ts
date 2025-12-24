'use client'

import { useMemo } from 'react'

/**
 * Checks if the current date is during Christmas season
 * Christmas season is from December 1st to December 31st (month 12)
 * Returns to normal on January 1st
 */
export function useChristmasTheme(): boolean {
  return useMemo(() => {
    const now = new Date()
    const month = now.getMonth() // 0-11, where 11 is December (month 12)
    
    // Christmas season: December (month 12, index 11) - December 1st to December 31st
    // Returns to normal on January 1st (month 1, index 0)
    return month === 11 // December (month 12)
  }, [])
}

