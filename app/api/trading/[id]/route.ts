import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { 
  getTradingPostById, 
  updateTradingPost, 
  deleteTradingPost 
} from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await getTradingPostById(id)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Trading post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching trading post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trading post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, item_name, price, currency, shard, character_name, contact_info, status } = body

    // Validate required fields
    if (!title || !description || !item_name || !price) {
      return NextResponse.json(
        { error: 'Title, description, item name, and price are required' },
        { status: 400 }
      )
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

         const updateData = {
       title,
       description,
       item_name,
       price: parseFloat(price),
       currency: 'GOLD',
       shard: shard || null,
       character_name: character_name || null,
       contact_info: contact_info || null,
       status: status || 'active'
     }

    const post = await updateTradingPost(id, session.user.id, updateData)

    if (!post) {
      return NextResponse.json(
        { error: 'Trading post not found or you do not have permission to edit it' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      post,
      message: 'Trading post updated successfully' 
    })
  } catch (error) {
    console.error('Error updating trading post:', error)
    return NextResponse.json(
      { error: 'Failed to update trading post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const post = await deleteTradingPost(id, session.user.id)

    if (!post) {
      return NextResponse.json(
        { error: 'Trading post not found or you do not have permission to delete it' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Trading post deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting trading post:', error)
    return NextResponse.json(
      { error: 'Failed to delete trading post' },
      { status: 500 }
    )
  }
}
