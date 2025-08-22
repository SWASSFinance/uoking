"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

// Global audio manager that exists outside React lifecycle
class AudioManager {
  private audio: HTMLAudioElement | null = null
  private listeners: Set<(isPlaying: boolean) => void> = new Set()
  private volumeListeners: Set<(volume: number) => void> = new Set()
  private muteListeners: Set<(isMuted: boolean) => void> = new Set()
  
  private state = {
    isPlaying: false,
    volume: 0.5,
    isMuted: false,
    isInitialized: false
  }

  constructor() {
    this.initialize()
  }

  private initialize() {
    if (this.audio) return

    this.audio = new Audio('/music.mp3')
    this.audio.loop = true
    this.audio.preload = 'auto'
    
    // Load saved state
    try {
      const savedVolume = localStorage.getItem('music-volume')
      const savedMuted = localStorage.getItem('music-muted')
      const savedPlaying = localStorage.getItem('music-playing')
      
      if (savedVolume) {
        this.state.volume = parseFloat(savedVolume)
        this.audio.volume = this.state.volume
      }
      if (savedMuted) {
        this.state.isMuted = savedMuted === 'true'
        if (this.state.isMuted) {
          this.audio.volume = 0
        }
      }
      if (savedPlaying === 'true') {
        this.state.isPlaying = true
        this.audio.play().catch(() => {
          // Auto-play might be blocked, that's okay
        })
      }
      
      this.state.isInitialized = true
    } catch (error) {
      console.error('Error loading music state:', error)
    }

    // Set up event listeners
    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true
      this.notifyListeners()
      this.saveState()
    })

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false
      this.notifyListeners()
      this.saveState()
    })

    this.audio.addEventListener('ended', () => {
      if (this.audio && this.audio.currentTime >= this.audio.duration) {
        this.audio.currentTime = 0
        this.audio.play().catch(() => {})
      }
    })
  }

  private saveState() {
    try {
      localStorage.setItem('music-volume', this.state.volume.toString())
      localStorage.setItem('music-muted', this.state.isMuted.toString())
      localStorage.setItem('music-playing', this.state.isPlaying.toString())
    } catch (error) {
      console.error('Error saving music state:', error)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state.isPlaying))
  }

  private notifyVolumeListeners() {
    this.volumeListeners.forEach(listener => listener(this.state.volume))
  }

  private notifyMuteListeners() {
    this.muteListeners.forEach(listener => listener(this.state.isMuted))
  }

  // Public methods
  play() {
    if (this.audio) {
      this.audio.play().catch(() => {})
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause()
    }
  }

  togglePlay() {
    if (this.state.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  setVolume(volume: number) {
    this.state.volume = volume
    if (this.audio) {
      this.audio.volume = this.state.isMuted ? 0 : volume
    }
    this.notifyVolumeListeners()
    this.saveState()
  }

  setMuted(isMuted: boolean) {
    this.state.isMuted = isMuted
    if (this.audio) {
      this.audio.volume = isMuted ? 0 : this.state.volume
    }
    this.notifyMuteListeners()
    this.saveState()
  }

  getState() {
    return { ...this.state }
  }

  // Event listener management
  onPlayStateChange(listener: (isPlaying: boolean) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  onVolumeChange(listener: (volume: number) => void) {
    this.volumeListeners.add(listener)
    return () => this.volumeListeners.delete(listener)
  }

  onMuteChange(listener: (isMuted: boolean) => void) {
    this.muteListeners.add(listener)
    return () => this.muteListeners.delete(listener)
  }
}

// Global audio manager instance
const audioManager = new AudioManager()

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(audioManager.getState().isPlaying)
  const [volume, setVolume] = useState(audioManager.getState().volume)
  const [isMuted, setIsMuted] = useState(audioManager.getState().isMuted)
  const [showControls, setShowControls] = useState(false)
  const pathname = usePathname()
  
  // Memoize homepage check to prevent unnecessary re-renders
  const isHomepage = useMemo(() => pathname === "/", [pathname])

  // Subscribe to audio manager events
  useEffect(() => {
    const unsubscribePlay = audioManager.onPlayStateChange(setIsPlaying)
    const unsubscribeVolume = audioManager.onVolumeChange(setVolume)
    const unsubscribeMute = audioManager.onMuteChange(setIsMuted)

    return () => {
      unsubscribePlay()
      unsubscribeVolume()
      unsubscribeMute()
    }
  }, [])

  const togglePlay = useCallback(() => {
    audioManager.togglePlay()
    // If on homepage, also control video mute state
    if (isHomepage) {
      if (isPlaying) {
        window.dispatchEvent(new CustomEvent('muteVideo'))
      } else {
        window.dispatchEvent(new CustomEvent('unmuteVideo'))
      }
    }
  }, [isPlaying, isHomepage])

  const toggleMute = useCallback(() => {
    audioManager.setMuted(!isMuted)
    // If on homepage, also control video mute state
    if (isHomepage) {
      if (!isMuted) {
        window.dispatchEvent(new CustomEvent('muteVideo'))
      } else {
        window.dispatchEvent(new CustomEvent('unmuteVideo'))
      }
    }
  }, [isMuted, isHomepage])

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0] / 100
    audioManager.setVolume(newVolume)
    
    if (newVolume === 0) {
      audioManager.setMuted(true)
      // If on homepage, also mute the video
      if (isHomepage) {
        window.dispatchEvent(new CustomEvent('muteVideo'))
      }
    } else if (isMuted) {
      audioManager.setMuted(false)
      // If on homepage, also unmute the video
      if (isHomepage) {
        window.dispatchEvent(new CustomEvent('unmuteVideo'))
      }
    }
  }, [isMuted, isHomepage])

  return (
    <div className="fixed bottom-4 left-4 z-50">
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
            className="absolute bottom-16 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-48"
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
