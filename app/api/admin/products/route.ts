import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, createProduct, updateProductCategories, updateProductClasses } from '@/lib/db'

export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate slug if not provided
    let slug = body.slug
    if (!slug && body.name) {
      slug = body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    }
    
    const { category_ids, class_ids, ...productData } = body
    
    const product = await createProduct({
      ...productData,
      slug
    })
    
    // Update product categories if provided
    if (category_ids && Array.isArray(category_ids)) {
      const filteredCategoryIds = category_ids.filter(id => id && id !== '')
      await updateProductCategories(product.id, filteredCategoryIds)
    }
    
    // Update product classes if provided
    if (class_ids && Array.isArray(class_ids)) {
      const filteredClassIds = class_ids.filter(id => id && id !== '')
      await updateProductClasses(product.id, filteredClassIds)
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', details: (error as Error).message },
      { status: 500 }
    )
  }
} 