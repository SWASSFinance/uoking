import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { getAllShards, createShard } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you can add more specific admin checks here)
    const shards = await getAllShards()
    
    return NextResponse.json(shards)
  } catch (error) {
    console.error('Error fetching shards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const shardData = await request.json()
    
    if (!shardData.name) {
      return NextResponse.json(
        { error: 'Shard name is required' },
        { status: 400 }
      )
    }

    const newShard = await createShard(shardData)
    
    return NextResponse.json(newShard)
  } catch (error) {
    console.error('Error creating shard:', error)
    return NextResponse.json(
      { error: 'Failed to create shard' },
      { status: 500 }
    )
  }
} 