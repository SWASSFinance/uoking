"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Package, ZoomIn } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ProductImageGalleryProps {
  imageUrl?: string | null
  productName: string
}

export function ProductImageGallery({ imageUrl, productName }: ProductImageGalleryProps) {
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
      <div className="relative group bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
        {/* Main Image */}
        <div className="relative aspect-square max-h-96">
          <Image
            src={imageSrc}
            alt={productName}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            priority
            onError={handleImageError}
          />
          
          {/* Zoom Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={() => setIsZoomed(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
            >
              <ZoomIn className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          
          {/* Fallback Icon */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Package className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Image Info */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 text-center">
            Click to zoom • {productName}
          </p>
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