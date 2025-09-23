import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get JSON fields
    const { name, description, price, image_base64 } = body
    
    // Validate required fields
    if (!name || !description || !price || !image_base64) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, image_base64' },
        { status: 400 }
      )
    }

    // Validate price is a number
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json(
        { error: 'Price must be a valid positive number' },
        { status: 400 }
      )
    }

    // Validate base64 image format
    if (!image_base64.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'image_base64 must be a valid base64 image (data:image/...)' },
        { status: 400 }
      )
    }

    // Convert base64 to buffer
    const base64Data = image_base64.split(',')[1] // Remove data:image/...;base64, prefix
    const buffer = Buffer.from(base64Data, 'base64')

    // Validate buffer size (max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image file size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'uoking/products',
          public_id: `product-${slug}-${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto', format: 'auto' }
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

    // Insert product into database
    const productResult = await query(`
      INSERT INTO products (
        name, 
        slug, 
        description, 
        short_description, 
        price, 
        image_url, 
        status, 
        featured, 
        type, 
        rank,
        requires_character_name, 
        requires_shard,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *
    `, [
      name,
      slug,
      description,
      description.substring(0, 200), // short_description (first 200 chars)
      priceNum,
      uploadResult.secure_url,
      'active', // status
      false, // featured
      'item', // type
      0, // rank
      false, // requires_character_name
      false, // requires_shard
    ])

    const product = productResult.rows[0]

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        status: product.status
      },
      cloudinary: {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating product:', error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'A product with this name already exists' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
