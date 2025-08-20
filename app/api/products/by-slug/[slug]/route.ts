import { NextResponse } from 'next/server'
import { getProductBySlug, getProductReviews } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Fetch product and reviews
    const [product, reviews] = await Promise.all([
      getProductBySlug(slug),
      getProductBySlug(slug).then(product => 
        product ? getProductReviews(product.id) : []
      )
    ])

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      product,
      reviews
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
