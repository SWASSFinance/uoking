"use client"

import { VolumeX } from "lucide-react"

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

interface BannerSectionProps {
  banners: Banner[]
}

export function BannerSection({ banners }: BannerSectionProps) {
  return (
    <section className="relative h-[1000px] flex items-center justify-center">
      {/* Sound Enable Button */}
      <button
        id="enable-sound-btn"
        className="absolute top-4 right-4 z-40 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors drop-shadow-lg"
        onClick={() => {
          // This will be handled by the VideoBanner component
          const event = new CustomEvent('enableVideoSound')
          window.dispatchEvent(event)
        }}
      >
        <VolumeX className="h-5 w-5" />
        <span>Enable Sound</span>
      </button>

      <div className="text-center text-white z-30 relative">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
          Welcome to UO KING
        </h1>
     
        {banners.length > 0 && banners[0]?.button_text && (
          <a
            href={banners[0].button_url || '#'}
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors drop-shadow-lg"
          >
            {banners[0].button_text}
          </a>
        )}
      </div>
    </section>
  )
} 