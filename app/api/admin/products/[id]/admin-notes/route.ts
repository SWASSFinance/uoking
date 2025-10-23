import { NextRequest, NextResponse } from 'next/server'
import { updateProductAdminNotes } from '@/lib/db'
import { addNoCacheHeaders, createNoCacheResponse } from '@/lib/api-utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin_notes } = await request.json()
    
    const product = await updateProductAdminNotes(params.id, admin_notes)
    
    return createNoCacheResponse({ 
      success: true, 
      product 
    })
  } catch (error) {
    console.error('Error updating product admin notes:', error)
    return createNoCacheResponse(
      { error: 'Failed to update product admin notes' },
      500
    )
  }
}
