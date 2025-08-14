import { NextResponse } from 'next/server'
import { getCategoryBySlug } from '@/lib/db'

interface CategorySlugParams {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: Request, { params }: CategorySlugParams) {
  try {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
} 