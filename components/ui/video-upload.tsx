"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Upload, X, Play, Video } from "lucide-react"

interface VideoUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  className?: string
}

export function VideoUpload({ value, onChange, label = "Video", className }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (100MB limit - can be increased further if needed)
    const maxSize = 100 * 1024 * 1024 // 100MB in bytes
    if (file.size > maxSize) {
      alert('Video file too large. Maximum size is 100MB.')
      return
    }

    // Check file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid video format. Supported formats: MP4, WebM, OGG, MOV')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setIsUploading(true)
    setUploadProgress(0)
    try {
      const formData = new FormData()
      formData.append('video', file)

      const response = await fetch('/api/admin/upload-video', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
        setPreview(data.url)
        setUploadProgress(100)
      } else {
        const errorData = await response.json()
        console.error('Upload failed:', errorData.error)
        alert(`Upload failed: ${errorData.error}`)
        setPreview(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
      setPreview(null)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setPreview(url)
    onChange(url)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-gray-700 font-medium">{label}</Label>
      
      {/* Preview */}
      {preview && (
        <div className="relative w-full max-w-md">
          <video 
            src={preview} 
            controls 
            className="w-full rounded-lg border border-gray-300"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Upload Options */}
      <div className="space-y-3">
        {/* File Upload */}
        <div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <LoadingSpinner size="sm" text={`Uploading... ${uploadProgress}%`} />
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Video (Max 100MB)
              </>
            )}
          </Button>
          
          {/* Progress bar for large uploads */}
          {isUploading && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* URL Input */}
        <div>
          <Input
            type="url"
            placeholder="Or enter video URL"
            value={preview || ''}
            onChange={handleUrlChange}
            className="w-full"
          />
        </div>
      </div>

      {/* Default Placeholder */}
      {!preview && (
        <div className="w-full max-w-md h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No video selected</p>
          </div>
        </div>
      )}
    </div>
  )
} 