import { NextRequest, NextResponse } from 'next/server'
import { updateProduct, deleteProduct, updateProductCategories, updateProductClasses } from '@/lib/db'
import { addNoCacheHeaders, createNoCacheResponse } from '@/lib/api-utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const productId = params.id
    
    // Validate productId
    if (!productId || productId === 'undefined' || productId === 'null') {
      return createNoCacheResponse(
        { error: 'Invalid product ID' },
        400
      )
    }
    
    console.log('Updating product:', productId)
    console.log('Product data:', JSON.stringify(body, null, 2))
    
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
    
    const product = await updateProduct(productId, {
      ...productData,
      slug
    })
    
    // Validate product was updated successfully
    if (!product || !product.id) {
      return createNoCacheResponse(
        { error: 'Product update failed - product not found or invalid' },
        404
      )
    }
    
    // Update product categories if provided
    if (category_ids !== undefined && Array.isArray(category_ids)) {
      const filteredCategoryIds = category_ids
        .filter(id => id != null && id !== '' && id !== 'undefined' && id !== 'null')
        .map(id => String(id).trim())
        .filter(id => id.length > 0)
      
      // Only call updateProductCategories if we have valid IDs or want to clear all (empty array)
      await updateProductCategories(productId, filteredCategoryIds)
    }
    
    // Update product classes if provided
    if (class_ids !== undefined && Array.isArray(class_ids)) {
      const filteredClassIds = class_ids
        .filter(id => id != null && id !== '' && id !== 'undefined' && id !== 'null')
        .map(id => String(id).trim())
        .filter(id => id.length > 0)
      
      // Only call updateProductClasses if we have valid IDs or want to clear all (empty array)
      await updateProductClasses(productId, filteredClassIds)
    }
    
    return createNoCacheResponse(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return createNoCacheResponse(
      { error: 'Failed to update product', details: (error as Error).message },
      500
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    await deleteProduct(productId)
    return createNoCacheResponse({ success: true, id: productId })
  } catch (error) {
    console.error('Error deleting product:', error)
    return createNoCacheResponse(
      { error: 'Failed to delete product' },
      500
    )
  }
} 