import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';

// GET - Get a specific news post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`
      SELECT id, title, message, posted_by, date_posted, is_active, created_at, updated_at
      FROM news 
      WHERE id = $1
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'News post not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Error fetching news post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a news post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, message, date_posted, is_active } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const result = await query(`
      UPDATE news 
      SET title = $1, message = $2, date_posted = $3, is_active = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, title, message, posted_by, date_posted, is_active, created_at, updated_at
    `, [title, message, date_posted, is_active, params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'News post not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Error updating news post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a news post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`
      DELETE FROM news 
      WHERE id = $1
      RETURNING id
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'News post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'News post deleted successfully' });

  } catch (error) {
    console.error('Error deleting news post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
