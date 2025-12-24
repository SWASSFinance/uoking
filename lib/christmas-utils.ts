/**
 * Server-side utility to check if it's Christmas season
 * Use this in server components
 */
export function isChristmasSeason(): boolean {
  const now = new Date()
  const month = now.getMonth() // 0-11, where 11 is December (month 12)
  return month === 11 // December (month 12)
}

