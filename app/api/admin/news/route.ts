import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';

// GET - List all news posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM news');
    const total = parseInt(countResult.rows[0].count);

    // Get news posts with pagination
    const result = await query(`
      SELECT id, title, message, posted_by, date_posted, is_active, created_at, updated_at
      FROM news 
      ORDER BY date_posted DESC, created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return NextResponse.json({
      news: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new news post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, message, date_posted, is_active = true } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO news (title, message, posted_by, date_posted, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, message, posted_by, date_posted, is_active, created_at, updated_at
    `, [title, message, session.user.email || 'admin', date_posted || new Date().toISOString().split('T')[0], is_active]);

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
