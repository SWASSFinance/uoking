'use client'

import { useEffect, useState } from 'react'

export function DragonAnimation() {
  const [variant, setVariant] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly select a variant (1-5)
      const randomVariant = Math.floor(Math.random() * 5) + 1
      setVariant(randomVariant)
    }, 12000) // Change every 12 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div className={`dragon-animation dragon-variant-${variant}`}>
        <img 
          src="/uo/dragonleft.gif" 
          alt="Dragon" 
          className="w-32 h-32 md:w-24 md:h-24 sm:w-20 sm:h-20 object-contain"
          style={{ display: 'block' }}
        />
      </div>
    </div>
  )
}
