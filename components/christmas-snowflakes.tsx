'use client'

import { useEffect, useState } from 'react'
import { useChristmasTheme } from '@/hooks/use-christmas-theme'

/**
 * Animated snowflakes component for Christmas theme
 * Only renders during December
 */
export function ChristmasSnowflakes() {
  const isChristmas = useChristmasTheme()
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])

  useEffect(() => {
    if (!isChristmas) return

    // Create 50 snowflakes with random positions and timings
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10, // 10-20 seconds
    }))

    setSnowflakes(flakes)
  }, [isChristmas])

  if (!isChristmas || snowflakes.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="christmas-snowflake"
          style={{
            left: `${flake.left}%`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  )
}

