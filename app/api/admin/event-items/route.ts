import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const season = searchParams.get('season');
    const shard = searchParams.get('shard');
    const itemType = searchParams.get('itemType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (season) {
      whereConditions.push(`season_number = $${paramIndex}`);
      queryParams.push(parseInt(season));
      paramIndex++;
    }

    if (shard) {
      whereConditions.push(`shard = $${paramIndex}`);
      queryParams.push(shard);
      paramIndex++;
    }

    if (itemType) {
      whereConditions.push(`item_type = $${paramIndex}`);
      queryParams.push(itemType);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM event_items
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get items
    const itemsQuery = `
      SELECT 
        id, name, slug, description, season_number, season_name,
        event_year, event_type, shard, original_image_url, cloudinary_url,
        item_type, hue_number, graphic_number, status, rarity_level,
        created_at, updated_at
      FROM event_items
      ${whereClause}
      ORDER BY season_number DESC, name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const itemsResult = await pool.query(itemsQuery, [...queryParams, limit, offset]);

    // Get unique values for filters
    const seasonsResult = await pool.query(`
      SELECT DISTINCT season_number, season_name 
      FROM event_items 
      ORDER BY season_number DESC
    `);

    const shardsResult = await pool.query(`
      SELECT DISTINCT shard 
      FROM event_items 
      ORDER BY shard
    `);

    const itemTypesResult = await pool.query(`
      SELECT DISTINCT item_type 
      FROM event_items 
      WHERE item_type IS NOT NULL
      ORDER BY item_type
    `);

    return NextResponse.json({
      items: itemsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        seasons: seasonsResult.rows,
        shards: shardsResult.rows.map(row => row.shard),
        itemTypes: itemTypesResult.rows.map(row => row.item_type)
      }
    });

  } catch (error) {
    console.error('Error fetching event items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      seasonNumber,
      seasonName,
      eventYear,
      eventType,
      shard,
      originalImageUrl,
      itemType,
      hueNumber,
      graphicNumber,
      status,
      rarityLevel
    } = body;

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    const result = await pool.query(`
      INSERT INTO event_items (
        name, slug, description, season_number, season_name,
        event_year, event_type, shard, original_image_url,
        item_type, hue_number, graphic_number, status, rarity_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      name, slug, description, seasonNumber, seasonName,
      eventYear, eventType, shard, originalImageUrl,
      itemType, hueNumber, graphicNumber, status || 'active', rarityLevel || 'rare'
    ]);

    return NextResponse.json({
      success: true,
      item: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating event item:', error);
    return NextResponse.json(
      { error: 'Failed to create event item' },
      { status: 500 }
    );
  }
}
