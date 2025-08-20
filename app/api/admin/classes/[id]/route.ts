import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('SELECT * FROM classes WHERE id = $1', [params.id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      { error: 'Failed to fetch class' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
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
    
    // Validate difficulty_level
    const difficultyLevel = parseInt(body.difficulty_level) || 3
    if (difficultyLevel < 1 || difficultyLevel > 5) {
      return NextResponse.json(
        { error: 'Difficulty level must be between 1 and 5' },
        { status: 400 }
      )
    }
    
    const result = await query(`
      UPDATE classes SET 
        name = $1,
        slug = $2,
        description = $3,
        image_url = $4,
        primary_stats = $5,
        skills = $6,
        playstyle = $7,
        difficulty_level = $8,
        is_active = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      body.name,
      slug,
      body.description || '',
      body.image_url || '',
      body.primary_stats || [],
      body.skills || [],
      body.playstyle || '',
      difficultyLevel,
      body.is_active !== false,
      params.id
    ])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('DELETE FROM classes WHERE id = $1 RETURNING *', [params.id])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Class deleted successfully' })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    )
  }
}
