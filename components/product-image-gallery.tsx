"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Package, ZoomIn } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ProductImageGalleryProps {
  imageUrl?: string | null
  productName: string
  stats?: any[]
  description?: string
}

export function ProductImageGallery({ imageUrl, productName, stats, description }: ProductImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Default placeholder image path
  const placeholderSrc = '/placeholder.png'
  const imageSrc = imageUrl && imageUrl.trim() !== '' && !imageError ? imageUrl : placeholderSrc

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      <div className="relative w-full group">
        {/* Main Image */}
        <div className="relative aspect-square max-h-80">
          <Image
            src={imageSrc}
            alt={productName}
            fill
            className="object-contain"
            priority
            onError={handleImageError}
          />
          
          {/* Stats Overlay */}
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <div className="text-white text-center max-w-full">
              <h3 className="font-bold text-lg mb-3">{productName}</h3>
              
              {/* Stats */}
              {stats && stats.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-semibold mb-2">Item Statistics:</h4>
                  <div className="text-sm space-y-1">
                    {stats.map((stat: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{stat.name}:</span>
                        <span className="font-semibold">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
              {description && (
                <div>
                  <h4 className="font-semibold mb-2">Description:</h4>
                  <pre className="text-xs whitespace-pre-wrap font-sans text-left max-h-32 overflow-y-auto">
                    {description}
                  </pre>
                </div>
              )}
            </div>
          </div>
          
          {/* Zoom Button */}
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setIsZoomed(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <ZoomIn className="h-4 w-4 text-gray-700" />
            </button>
          </div>
          
          {/* Fallback Icon */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Package className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative aspect-square">
            <Image
              src={imageSrc}
              alt={productName}
              fill
              className="object-contain"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 