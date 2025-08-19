"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const pathname = usePathname()
  const isHomepage = pathname === "/"

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0
      } else {
        audioRef.current.volume = volume
      }
    }
  }, [isMuted, volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        // If on homepage, also mute the video
        if (isHomepage) {
          window.dispatchEvent(new CustomEvent('muteVideo'))
        }
      } else {
        audioRef.current.play()
        // If on homepage, also unmute the video
        if (isHomepage) {
          window.dispatchEvent(new CustomEvent('unmuteVideo'))
        }
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // If on homepage, also control video mute state
    if (isHomepage) {
      if (!isMuted) {
        window.dispatchEvent(new CustomEvent('muteVideo'))
      } else {
        window.dispatchEvent(new CustomEvent('unmuteVideo'))
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
      // If on homepage, also mute the video
      if (isHomepage) {
        window.dispatchEvent(new CustomEvent('muteVideo'))
      }
    } else if (isMuted) {
      setIsMuted(false)
      // If on homepage, also unmute the video
      if (isHomepage) {
        window.dispatchEvent(new CustomEvent('unmuteVideo'))
      }
    }
  }

  const handleAudioEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        onEnded={handleAudioEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="relative">
        {/* Main toggle button */}
        <Button
          onClick={togglePlay}
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full shadow-lg transition-all duration-300",
            isPlaying 
              ? "bg-amber-600 hover:bg-amber-700 text-white" 
              : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
          )}
          onMouseEnter={() => setShowControls(true)}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>

        {/* Controls panel */}
        {showControls && (
          <div 
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-48"
            onMouseLeave={() => setShowControls(false)}
          >
            <div className="space-y-3">
              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-8 w-8"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
              
              {/* Status text */}
              <div className="text-xs text-gray-500 text-center">
                {isPlaying ? "Now Playing" : "Paused"}
                {isHomepage && (
                  <div className="text-xs text-amber-600 mt-1">
                    + Video Sound
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
