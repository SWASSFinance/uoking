"use client"

import Image from 'next/image'

interface ImageBannerProps {
  imagePath: string
  alt?: string
}

export function ImageBanner({ imagePath, alt = "Banner" }: ImageBannerProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900 dark:bg-gray-800">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imagePath}
          alt={alt}
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>
    </div>
  )
}
