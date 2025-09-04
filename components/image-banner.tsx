"use client"

import Image from 'next/image'

interface ImageBannerProps {
  imagePath: string
  alt?: string
}

export function ImageBanner({ imagePath, alt = "Banner" }: ImageBannerProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imagePath}
          alt={alt}
          fill
          className="object-cover object-center transform -translate-y-24"
          priority
          quality={90}
          unoptimized={true}
          sizes="100vw"
        />
      </div>
    </div>
  )
}
