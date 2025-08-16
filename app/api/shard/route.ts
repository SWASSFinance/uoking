import { NextResponse } from 'next/server'
import { getShards } from '@/lib/db'

export async function GET() {
  try {
    const shards = await getShards()
    return NextResponse.json(shards)
  } catch (error) {
    console.error('Error fetching shards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shards' },
      { status: 500 }
    )
  }
} 