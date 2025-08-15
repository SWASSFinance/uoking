import { NextRequest, NextResponse } from 'next/server'
import { updateBanner, deleteBanner } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const bannerId = params.id
    
    console.log('Updating banner:', bannerId)
    console.log('Banner data:', JSON.stringify(body, null, 2))
    
    const bannerData = {
      ...body,
      updated_at: new Date().toISOString()
    }
    
    const banner = await updateBanner(bannerId, bannerData)
    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      { error: 'Failed to update banner', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bannerId = params.id
    await deleteBanner(bannerId)
    return NextResponse.json({ success: true, id: bannerId })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json(
      { error: 'Failed to delete banner', details: (error as Error).message },
      { status: 500 }
    )
  }
} 