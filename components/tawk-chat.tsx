"use client"

import { useEffect } from 'react'

export function TawkChat() {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      var Tawk_API = Tawk_API || {}
      var Tawk_LoadStart = new Date()
      
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://embed.tawk.to/5cb81740d6e05b735b432c41/default'
      script.charset = 'UTF-8'
      script.setAttribute('crossorigin', '*')
      
      document.head.appendChild(script)
    }
  }, [])

  return null
}
