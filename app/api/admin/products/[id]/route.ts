import { NextRequest, NextResponse } from 'next/server'
import { updateProduct, deleteProduct, updateProductCategories, updateProductClasses } from '@/lib/db'
import { addNoCacheHeaders, createNoCacheResponse } from '@/lib/api-utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return createNoCacheResponse(
        { error: 'Invalid JSON in request body', details: parseError instanceof Error ? parseError.message : 'Unknown error' },
        400
      )
    }
    
    const { id: productId } = await params
    
    // Validate productId
    if (!productId || productId === 'undefined' || productId === 'null' || productId.trim() === '') {
      return createNoCacheResponse(
        { error: 'Invalid product ID', details: `Product ID: ${productId}` },
        400
      )
    }
    
    // Validate required fields
    if (!body.name || (typeof body.name === 'string' && body.name.trim() === '')) {
      return createNoCacheResponse(
        { error: 'Product name is required', details: `Received name: ${body.name}` },
        400
      )
    }
    
    // Validate price - can be string or number
    const priceValue = typeof body.price === 'string' ? parseFloat(body.price) : body.price
    if (priceValue === undefined || priceValue === null || isNaN(priceValue) || priceValue < 0) {
      return createNoCacheResponse(
        { error: 'Product price is required and must be a valid positive number', details: `Received price: ${body.price}` },
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
    
    // Ensure rank is a number
    const rankValue = typeof productData.rank === 'string' ? parseInt(productData.rank) : (productData.rank || 0)
    
    const product = await updateProduct(productId, {
      ...productData,
      price: priceValue,
      rank: rankValue,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
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