import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, slug, description, season_number, season_name,
        event_year, event_type, shard, original_image_url, cloudinary_url,
        cloudinary_public_id, item_type, hue_number, graphic_number, 
        status, rarity_level, created_at, updated_at
      FROM event_items
      WHERE id = $1
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      item: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching event item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      cloudinaryUrl,
      cloudinaryPublicId,
      itemType,
      hueNumber,
      graphicNumber,
      status,
      rarityLevel
    } = body;

    // Create slug from name if name is being updated
    let slug = null;
    if (name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    const result = await pool.query(`
      UPDATE event_items
      SET 
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        season_number = COALESCE($4, season_number),
        season_name = COALESCE($5, season_name),
        event_year = COALESCE($6, event_year),
        event_type = COALESCE($7, event_type),
        shard = COALESCE($8, shard),
        original_image_url = COALESCE($9, original_image_url),
        cloudinary_url = COALESCE($10, cloudinary_url),
        cloudinary_public_id = COALESCE($11, cloudinary_public_id),
        item_type = COALESCE($12, item_type),
        hue_number = COALESCE($13, hue_number),
        graphic_number = COALESCE($14, graphic_number),
        status = COALESCE($15, status),
        rarity_level = COALESCE($16, rarity_level),
        updated_at = NOW()
      WHERE id = $17
      RETURNING *
    `, [
      name, slug, description, seasonNumber, seasonName,
      eventYear, eventType, shard, originalImageUrl,
      cloudinaryUrl, cloudinaryPublicId, itemType,
      hueNumber, graphicNumber, status, rarityLevel, params.id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating event item:', error);
    return NextResponse.json(
      { error: 'Failed to update event item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, get the item to check if it has a Cloudinary image
    const getResult = await pool.query(`
      SELECT cloudinary_public_id FROM event_items WHERE id = $1
    `, [params.id]);

    if (getResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event item not found' },
        { status: 404 }
      );
    }

    const item = getResult.rows[0];

    // Delete from database
    const result = await pool.query(`
      DELETE FROM event_items WHERE id = $1 RETURNING id
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event item not found' },
        { status: 404 }
      );
    }

    // If there's a Cloudinary image, delete it too
    if (item.cloudinary_public_id) {
      try {
        const { v2: cloudinary } = require('cloudinary');
        
        cloudinary.config({
          cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dngclyzkj',
          api_key: process.env.CLOUDINARY_API_KEY || '827585767246395',
          api_secret: process.env.CLOUDINARY_API_SECRET || 'q4JyvKJGRoyoI0AJ3fxgR8p8nNA'
        });

        await cloudinary.uploader.destroy(item.cloudinary_public_id);
        console.log(`Deleted Cloudinary image: ${item.cloudinary_public_id}`);
      } catch (cloudinaryError) {
        console.error('Error deleting Cloudinary image:', cloudinaryError);
        // Don't fail the request if Cloudinary deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Event item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting event item:', error);
    return NextResponse.json(
      { error: 'Failed to delete event item' },
      { status: 500 }
    );
  }
}
