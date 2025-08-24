import { NextRequest, NextResponse } from 'next/server'
import { updateProductAdminNotes } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin_notes } = await request.json()
    
    const product = await updateProductAdminNotes(params.id, admin_notes)
    
    return NextResponse.json({ 
      success: true, 
      product 
    })
  } catch (error) {
    console.error('Error updating product admin notes:', error)
    return NextResponse.json(
      { error: 'Failed to update product admin notes' },
      { status: 500 }
    )
  }
}
