import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin } from '@/lib/db/middleware.js';
import { deleteImage } from '@/lib/db/cloudinary.js';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const { rows } = await query('SELECT * FROM achievements WHERE id = $1', [id]);
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, achievement: rows[0] });
    }

    const { rows } = await query('SELECT * FROM achievements ORDER BY date_earned DESC');
    return NextResponse.json({ success: true, achievements: rows });
  } catch (error) {
    console.error('GET /api/achievements error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      image,
      image_id,
      awarder,
      date_earned,
      url,
      is_featured
    } = body;

    if (!title || !awarder || !date_earned) {
      return NextResponse.json({ error: 'Title, awarder, and date earned are required' }, { status: 400 });
    }

    const insertRes = await query(
      `INSERT INTO achievements (title, description, image, image_id, awarder, date_earned, url, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        description || null,
        image || null,
        image_id || null,
        awarder,
        new Date(date_earned),
        url || null,
        is_featured !== false
      ]
    );

    return NextResponse.json({ success: true, achievement: insertRes.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/achievements error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const {
      title,
      description,
      image,
      image_id,
      awarder,
      date_earned,
      url,
      is_featured
    } = body;

    if (!title || !awarder || !date_earned) {
      return NextResponse.json({ error: 'Title, awarder, and date earned are required' }, { status: 400 });
    }

    // Get current achievement to check image status
    const currentRes = await query('SELECT image_id FROM achievements WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    const oldImageId = currentRes.rows[0].image_id;

    // Delete old image if it is replaced
    if (oldImageId && image_id && oldImageId !== image_id) {
      try {
        await deleteImage(oldImageId);
      } catch (cloudinaryErr) {
        console.error('Failed to delete old achievement image from Cloudinary:', cloudinaryErr);
      }
    }

    const updateRes = await query(
      `UPDATE achievements
       SET title = $1, description = $2, image = $3, image_id = $4, awarder = $5, date_earned = $6, url = $7, is_featured = $8
       WHERE id = $9
       RETURNING *`,
      [
        title,
        description || null,
        image || null,
        image_id || null,
        awarder,
        new Date(date_earned),
        url || null,
        is_featured !== false,
        id
      ]
    );

    return NextResponse.json({ success: true, achievement: updateRes.rows[0] });
  } catch (error) {
    console.error('PUT /api/achievements error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required' }, { status: 400 });
    }

    // Get image_id to delete from Cloudinary
    const currentRes = await query('SELECT image_id FROM achievements WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    const imageId = currentRes.rows[0].image_id;
    if (imageId) {
      try {
        await deleteImage(imageId);
      } catch (cloudinaryErr) {
        console.error('Failed to delete achievement image from Cloudinary:', cloudinaryErr);
      }
    }

    await query('DELETE FROM achievements WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/achievements error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
