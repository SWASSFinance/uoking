import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/db'

export async function GET() {
  try {
    const users = await getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For now, we'll just return a success response
    // In a real implementation, you'd want to hash passwords and handle user creation properly
    return NextResponse.json({ 
      message: 'User creation endpoint - implement password hashing and validation' 
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 