"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Volume2 } from 'lucide-react'
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
  const [isPlaying, setIsPlaying] = useState(true) // Start playing immediately
  const [showPlayButton, setShowPlayButton] = useState(false) // Don't show play button initially
  const [hasUserInteracted, setHasUserInteracted] = useState(true) // Assume user has interacted
  const [isMuted, setIsMuted] = useState(true) // Start muted
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const currentBanner = banners[currentBannerIndex]

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
      }, 8000) // Change banner every 8 seconds

      return () => clearInterval(interval)
    }
  }, [banners.length])

  // Listen for sound enable event
  useEffect(() => {
    const handleEnableSound = () => {
      setIsMuted(false)
      setHasUserInteracted(true)
      
      // Try to enable audio context if needed
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new (window as any).AudioContext()
        if (audioContext.state === 'suspended') {
          audioContext.resume()
        }
      }

      // Update button text
      const button = document.getElementById('enable-sound-btn')
      if (button) {
        button.innerHTML = `
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
          </svg>
          <span>Sound On</span>
        `
      }
    }

    window.addEventListener('enableVideoSound', handleEnableSound)
    return () => window.removeEventListener('enableVideoSound', handleEnableSound)
  }, [])

  const getYouTubeEmbedUrl = (url: string, muted: boolean = true) => {
    if (!url) return ''
    
    // Extract video ID from various YouTube URL formats
    let videoId = ''
    
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]
    }
    
    // Remove any additional parameters
    if (videoId.includes('&')) {
      videoId = videoId.split('&')[0]
    }
    
    // Use muted state from component
    const muteParam = muted ? '&mute=1' : '&mute=0'
    return `https://www.youtube.com/embed/${videoId}?autoplay=1${muteParam}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&version=3&playerapiid=ytplayer&iv_load_policy=3&disablekb=1&fs=0&color=white&theme=dark&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
  }

  const handlePlayWithSound = () => {
    setIsPlaying(true)
    setShowPlayButton(false)
    setHasUserInteracted(true)
    
    // Try to enable audio context if needed
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window as any).AudioContext()
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
    }
  }

  // Auto-start video after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true)
      setShowPlayButton(false)
    }, 1000) // Start after 1 second

    return () => clearTimeout(timer)
  }, [])

  if (!currentBanner) {
    return null
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* YouTube Video Background */}
      {currentBanner.video_url && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div 
            className="w-full h-full"
            style={{
              transform: 'scale(1.1)',
              transformOrigin: 'center center'
            }}
          >
            <iframe
              ref={iframeRef}
              key={`${currentBanner.video_url}-${isMuted}`}
              src={getYouTubeEmbedUrl(currentBanner.video_url, isMuted)}
              title="YouTube video player"
              className="w-full h-full"
              style={{
                pointerEvents: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Invisible overlay to block YouTube interactions */}
          <div 
            className="absolute inset-0 z-10"
            style={{ pointerEvents: 'none' }}
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

      {/* Banner Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
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