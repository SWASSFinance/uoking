"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Package, ZoomIn } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ProductImageGalleryProps {
  imageUrl?: string | null
  productName: string
  description?: string
}

export function ProductImageGallery({ imageUrl, productName, description }: ProductImageGalleryProps) {
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
            alt={`${productName} - Ultima Online item image`}
            fill
            className="object-contain"
            priority
            onError={handleImageError}
          />
          

          
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
              alt={`${productName} - Ultima Online item image (zoomed view)`}
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