"use client"

import dynamic from 'next/dynamic'

// Lazy load music player to avoid blocking initial render
const MusicPlayer = dynamic(() => import('@/components/music-player').then(mod => ({ default: mod.MusicPlayer })), {
  ssr: false,
  loading: () => null
})

export function LazyMusicPlayer() {
  return <MusicPlayer />
}
