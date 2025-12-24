"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { ChristmasThemeWrapper } from "@/components/christmas-theme-wrapper"
import { memo } from "react"

// Memoize providers to prevent unnecessary re-renders
const Providers = memo(function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        storageKey="uoking-theme"
      >
        <ChristmasThemeWrapper>
          <CartProvider>
            {children}
          </CartProvider>
        </ChristmasThemeWrapper>
      </ThemeProvider>
    </SessionProvider>
  )
})

export { Providers } 