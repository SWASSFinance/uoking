import { NextResponse } from 'next/server'
import { getProducts, searchProducts, getClassBySlug } from '@/lib/db'
import { addNoCacheHeaders, createNoCacheResponse } from '@/lib/api-utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const classSlug = searchParams.get('class')
    const featured = searchParams.get('featured') === 'true'
    const search = searchParams.get('search')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100

    // Convert class slug to classId if provided
    let classId = undefined
    if (classSlug) {
      const classData = await getClassBySlug(classSlug)
      if (classData) {
        classId = classData.id
      }
    }

    let products
    if (search) {
      products = await searchProducts(search, limit)
    } else {
      products = await getProducts({ 
        categoryId: categoryId || undefined,
        classId: classId || undefined,
        featured: featured || undefined,
        limit 
      })
    }

    return createNoCacheResponse(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return createNoCacheResponse(
      { error: 'Failed to fetch products' },
      500
    )
  }
} 