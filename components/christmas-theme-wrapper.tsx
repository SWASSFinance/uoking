'use client'

import { useEffect } from 'react'
import { useChristmasTheme } from '@/hooks/use-christmas-theme'

/**
 * Wrapper component that automatically applies Christmas theme
 * during December and removes it on January 1st
 * This ensures the class is updated on the client side after hydration
 */
export function ChristmasThemeWrapper({ children }: { children: React.ReactNode }) {
  const isChristmas = useChristmasTheme()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const html = document.documentElement
    
    if (isChristmas) {
      // Add Christmas class to html element
      html.classList.add('christmas')
    } else {
      // Remove Christmas class on January 1st
      html.classList.remove('christmas')
    }
  }, [isChristmas])

  return <>{children}</>
}

