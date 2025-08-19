import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Toaster } from '@/components/ui/toaster'
import { ClientOnly } from '@/components/ui/client-only'
import { MusicPlayer } from '@/components/music-player'
import './globals.css'

export const metadata: Metadata = {
  title: 'UOKing - Premium Ultima Online Items & Gold',
  description: 'Your trusted source for premium Ultima Online items, gold, and services. Fast delivery, competitive prices, and 24/7 support.',
  keywords: 'Ultima Online, UO, gold, items, equipment, scrolls, suits, gaming',
  authors: [{ name: 'UOKing' }],
  creator: 'UOKing',
  publisher: 'UOKing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://uoking.com'),
  openGraph: {
    title: 'UOKing - Premium Ultima Online Items & Gold',
    description: 'Your trusted source for premium Ultima Online items, gold, and services.',
    url: 'https://uoking.com',
    siteName: 'UOKing',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UOKing - Premium Ultima Online Items & Gold',
    description: 'Your trusted source for premium Ultima Online items, gold, and services.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#d97706" />
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        />
      </head>
      <body className="antialiased bg-gradient-to-br from-amber-50 via-white to-orange-50 min-h-screen" suppressHydrationWarning>
        <ClientOnly>
          <Providers>
            <ErrorBoundary>
              {children}
              <Toaster />
              <MusicPlayer />
            </ErrorBoundary>
          </Providers>
        </ClientOnly>
      </body>
    </html>
  )
}
