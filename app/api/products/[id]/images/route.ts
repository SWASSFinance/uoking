import { NextRequest, NextResponse } from 'next/server'
import { getProductImageSubmissions, createProductImageSubmission } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dngclyzkj',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissions = await getProductImageSubmissions(params.id)
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching product image submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product image submissions' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image file size must be less than 5MB' },
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
          folder: 'uoking/product-images',
          public_id: `product-${params.id}-user-${session.user.id}-${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    }) as any

    if (!uploadResult?.secure_url) {
      throw new Error('Failed to upload image to Cloudinary')
    }

    // Create image submission record
    const submission = await createProductImageSubmission({
      productId: params.id,
      userId: session.user.id,
      imageUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      status: 'pending'
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error creating product image submission:', error)
    
    // Handle specific error messages for rate limiting
    if (error instanceof Error) {
      if (error.message.includes('maximum limit of 5 pending submissions')) {
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        )
      } else if (error.message.includes('already submitted an image')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create image submission' },
      { status: 500 }
    )
  }
}
