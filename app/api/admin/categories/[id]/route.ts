import { NextRequest, NextResponse } from 'next/server'
import { updateCategory, deleteCategory } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id: categoryId } = await params
    
    console.log('Updating category:', categoryId)
    console.log('Category data:', JSON.stringify(body, null, 2))
    
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
    
    const categoryData = {
      ...body,
      slug
    }
    
    const category = await updateCategory(categoryId, categoryData)
    
    if (!category) {
      return NextResponse.json(
        { error: 'Failed to update category', details: 'Category not found' },
        { status: 404 }
      )
    }
    
    // Convert dates to strings for JSON serialization
    const serializedCategory = {
      ...category,
      created_at: category.created_at ? new Date(category.created_at).toISOString() : null,
      updated_at: category.updated_at ? new Date(category.updated_at).toISOString() : null
    }
    
    return NextResponse.json(serializedCategory)
  } catch (error) {
    console.error('Error updating category:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Failed to update category', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categoryId } = await params
    await deleteCategory(categoryId)
    return NextResponse.json({ success: true, id: categoryId })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category', details: (error as Error).message },
      { status: 500 }
    )
  }
} 