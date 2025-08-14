"use client"

import Image from 'next/image'
import { Package } from 'lucide-react'

interface ProductImageProps {
  src?: string | null
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
}

export function ProductImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  fill = false,
  priority = false 
}: ProductImageProps) {
  // Default placeholder image path
  const placeholderSrc = '/placeholder.png'
  
  // If no image URL or empty string, use placeholder
  const imageSrc = src && src.trim() !== '' ? src : placeholderSrc
  
  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          const target = e.target as HTMLImageElement
          if (target.src !== placeholderSrc) {
            target.src = placeholderSrc
          }
        }}
      />
    )
  }
  
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        const target = e.target as HTMLImageElement
        if (target.src !== placeholderSrc) {
          target.src = placeholderSrc
        }
      }}
    />
  )
}

// Fallback component for when Next.js Image isn't available
export function ProductImageFallback({ 
  src, 
  alt, 
  className = "" 
}: { 
  src?: string | null
  alt: string
  className?: string 
}) {
  const placeholderSrc = '/placeholder.png'
  const imageSrc = src && src.trim() !== '' ? src : placeholderSrc
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        if (target.src !== placeholderSrc) {
          target.src = placeholderSrc
        }
      }}
    />
  )
} 