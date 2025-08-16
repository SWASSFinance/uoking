import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { getShardById, updateShard, deleteShard } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const shard = await getShardById(params.id)
    
    if (!shard) {
      return NextResponse.json(
        { error: 'Shard not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(shard)
  } catch (error) {
    console.error('Error fetching shard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shard' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updatedShard = await updateShard(params.id, shardData)
    
    if (!updatedShard) {
      return NextResponse.json(
        { error: 'Shard not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedShard)
  } catch (error) {
    console.error('Error updating shard:', error)
    return NextResponse.json(
      { error: 'Failed to update shard' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const deletedShard = await deleteShard(params.id)
    
    if (!deletedShard) {
      return NextResponse.json(
        { error: 'Shard not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, id: deletedShard.id })
  } catch (error) {
    console.error('Error deleting shard:', error)
    return NextResponse.json(
      { error: 'Failed to delete shard' },
      { status: 500 }
    )
  }
} 