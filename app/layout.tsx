import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Toaster } from '@/components/ui/toaster'
import { GoogleMapsLoader } from '@/components/google-maps-loader'
import { LazyMusicPlayer } from '@/components/lazy-music-player'
import './globals.css'

// Configure fonts with display swap for better performance
const geistSans = GeistSans
const geistMono = GeistMono

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#d97706" />
      </head>
      <body className="antialiased bg-gradient-to-br from-amber-50 via-white to-orange-50 min-h-screen font-sans" suppressHydrationWarning>
        <GoogleMapsLoader>
          <Providers>
            <ErrorBoundary>
              {children}
              <Toaster />
              <LazyMusicPlayer />
            </ErrorBoundary>
          </Providers>
        </GoogleMapsLoader>
      </body>
    </html>
  )
}

declare global {
  interface Window {
    google: {
      maps: {
        Map: any
        LatLngBounds: any
        LatLng: any
        GroundOverlay: any
        InfoWindow: any
        MapTypeId: any
        ImageMapType: any
        Size: any
        StyledMapType: any
        Marker: any
        Point: any
        event: any
        marker: {
          AdvancedMarkerElement: any
        }
      }
    }
  }
}
