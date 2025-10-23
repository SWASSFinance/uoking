import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, createProduct, updateProductCategories, updateProductClasses } from '@/lib/db'
import { addNoCacheHeaders, createNoCacheResponse } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const categoryId = searchParams.get('categoryId') || undefined
    const classId = searchParams.get('classId') || undefined
    const sortBy = searchParams.get('sortBy') as 'created_at' | 'name' | 'price' | 'rank' || 'created_at'
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
    
    const offset = (page - 1) * limit
    
    const result = await getAllProducts({
      limit,
      offset,
      search,
      status,
      categoryId,
      classId,
      sortBy,
      sortOrder
    })
    
    return createNoCacheResponse(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    return createNoCacheResponse(
      { error: 'Failed to fetch products' },
      500
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
    
    return createNoCacheResponse(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return createNoCacheResponse(
      { error: 'Failed to create product', details: (error as Error).message },
      500
    )
  }
} 