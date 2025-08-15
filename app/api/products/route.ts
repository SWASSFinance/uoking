import { NextResponse } from 'next/server'
import { getProducts, searchProducts } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100

    let products
    if (search) {
      products = await searchProducts(search, limit)
    } else {
      products = await getProducts({ 
        categoryId: categoryId || undefined,
        limit 
      })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 