import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dngclyzkj',
  api_key: process.env.CLOUDINARY_API_KEY || '827585767246395',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'q4JyvKJGRoyoI0AJ3fxgR8p8nNA'
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      )
    }

    // Check file size (19MB limit)
    const maxSize = 19 * 1024 * 1024 // 19MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Video file too large. Maximum size is 19MB.' },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid video format. Supported formats: MP4, WebM, OGG, MOV' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'uoking/videos',
          resource_type: 'video',
          overwrite: true,
          chunk_size: 6000000, // 6MB chunks for large files
          eager: [
            { width: 1280, height: 720, crop: 'scale' },
            { width: 854, height: 480, crop: 'scale' }
          ],
          eager_async: true
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id,
      duration: (uploadResult as any).duration,
      format: (uploadResult as any).format,
      width: (uploadResult as any).width,
      height: (uploadResult as any).height
    })

  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    )
  }
} 