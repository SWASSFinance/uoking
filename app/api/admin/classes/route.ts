import { NextRequest, NextResponse } from 'next/server'
import { getClasses, query } from '@/lib/db'

export async function GET() {
  try {
    const classes = await getClasses()
    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    
    const result = await query(`
      INSERT INTO classes (
        name, slug, description, image_url, primary_stats, skills, 
        playstyle, difficulty_level, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      body.name,
      slug,
      body.description || '',
      body.image_url || '',
      JSON.stringify(body.primary_stats || []),
      JSON.stringify(body.skills || []),
      body.playstyle || '',
      body.difficulty_level || 'medium',
      body.is_active !== false
    ])
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
} 