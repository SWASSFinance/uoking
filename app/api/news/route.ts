import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET - Get active news posts for public display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Get total count of active news
    const countResult = await pool.query(`
      SELECT COUNT(*) FROM news WHERE is_active = true
    `);
    const total = parseInt(countResult.rows[0].count);

    // Get active news posts with pagination
    const result = await pool.query(`
      SELECT id, title, message, posted_by, date_posted, created_at
      FROM news 
      WHERE is_active = true
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
