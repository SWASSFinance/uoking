"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

import Link from 'next/link'

interface Banner {
  id: string
  title: string
  subtitle: string
  description: string
  video_url: string
  image_url: string
  button_text: string
  button_url: string
  position: string
  is_active: boolean
  sort_order: number
}

interface VideoBannerProps {
  banners: Banner[]
}

export function VideoBanner({ banners }: VideoBannerProps) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  const currentBanner = banners[currentBannerIndex]

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
      }, 8000) // Change banner every 8 seconds

      return () => clearInterval(interval)
    }
  }, [banners.length])

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return ''
    // Convert various YouTube URL formats to embed URL
    return url
      .replace('youtu.be/', 'youtube.com/embed/')
      .replace('watch?v=', 'embed/')
      .replace('youtube.com/', 'youtube.com/embed/')
  }

  if (!currentBanner) {
    return null
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-black">
      {/* YouTube Video Background */}
      {currentBanner.video_url && (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={`${getYouTubeEmbedUrl(currentBanner.video_url)}?autoplay=1&mute=0&loop=1&playlist=${currentBanner.video_url.split('/').pop()}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            title="YouTube video player"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Fallback Image */}
      {!currentBanner.video_url && currentBanner.image_url && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${currentBanner.image_url})` }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            {currentBanner.title}
          </h1>
          {currentBanner.subtitle && (
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 drop-shadow-lg">
              {currentBanner.subtitle}
            </h2>
          )}
          {currentBanner.description && (
            <p className="text-lg md:text-xl mb-8 drop-shadow-lg max-w-2xl mx-auto">
              {currentBanner.description}
            </p>
          )}
          {currentBanner.button_text && currentBanner.button_url && (
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-4"
              asChild
            >
              <Link href={currentBanner.button_url}>
                {currentBanner.button_text}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Banner Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBannerIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 