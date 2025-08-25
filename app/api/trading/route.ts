import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { 
  getTradingPosts, 
  createTradingPost, 
  isUserPlotOwner 
} from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      shard: searchParams.get('shard') || undefined,
      item_name: searchParams.get('item_name') || undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    }
    
    const posts = await getTradingPosts(filters)
    
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching trading posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trading posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is a plot owner
    const isPlotOwner = await isUserPlotOwner(session.user.id)
    if (!isPlotOwner) {
      return NextResponse.json(
        { error: 'Only plot owners can create trading posts' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, item_name, price, currency, shard, character_name, contact_info } = body

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

    const postData = {
      user_id: session.user.id,
      title,
      description,
      item_name,
      price: parseFloat(price),
      currency: currency || 'USD',
      shard: shard || null,
      character_name: character_name || null,
      contact_info: contact_info || null,
      is_plot_owner_verified: true
    }

    const post = await createTradingPost(postData)

    return NextResponse.json({ 
      success: true, 
      post,
      message: 'Trading post created successfully' 
    })
  } catch (error) {
    console.error('Error creating trading post:', error)
    return NextResponse.json(
      { error: 'Failed to create trading post' },
      { status: 500 }
    )
  }
}
