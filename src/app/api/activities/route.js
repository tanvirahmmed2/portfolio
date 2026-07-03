import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin } from '@/lib/db/middleware.js';
import { deleteImage } from '@/lib/db/cloudinary.js';


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (id || slug) {
      let eventRes;
      if (id) {
        eventRes = await query('SELECT * FROM events WHERE id = $1', [id]);
      } else {
        eventRes = await query('SELECT * FROM events WHERE slug = $1', [slug]);
      }

      if (eventRes.rows.length === 0) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json({ event: eventRes.rows[0] });
    }

    const { rows } = await query('SELECT * FROM events ORDER BY event_date DESC');
    return NextResponse.json({ events: rows });
  } catch (error) {
    console.error('GET /api/activities error:', error);
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
      slug,
      description,
      image,
      image_id,
      event_type,
      location,
      event_date,
      registration_url,
      event_url,
      is_featured
    } = body;

    if (!title || !slug || !event_date) {
      return NextResponse.json({ error: 'Title, slug, and event_date are required' }, { status: 400 });
    }

    
    const slugCheck = await query('SELECT id FROM events WHERE slug = $1', [slug]);
    if (slugCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }

    const insertRes = await query(
      `INSERT INTO events (title, slug, description, image, image_id, event_type, location, event_date, registration_url, event_url, is_featured) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [
        title,
        slug,
        description || null,
        image || null,
        image_id || null,
        event_type || null,
        location || null,
        new Date(event_date),
        registration_url || null,
        event_url || null,
        is_featured === true
      ]
    );

    return NextResponse.json({ success: true, event: insertRes.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/activities error:', error);
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
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      description,
      image,
      image_id,
      event_type,
      location,
      event_date,
      registration_url,
      event_url,
      is_featured
    } = body;

    if (!title || !slug || !event_date) {
      return NextResponse.json({ error: 'Title, slug, and event_date are required' }, { status: 400 });
    }

    
    const currentEventRes = await query('SELECT image_id, slug FROM events WHERE id = $1', [id]);
    if (currentEventRes.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const currentEvent = currentEventRes.rows[0];

    
    if (currentEvent.slug !== slug) {
      const slugCheck = await query('SELECT id FROM events WHERE slug = $1 AND id != $2', [slug, id]);
      if (slugCheck.rows.length > 0) {
        return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
      }
    }

    
    if (currentEvent.image_id && image_id && currentEvent.image_id !== image_id) {
      try {
        await deleteImage(currentEvent.image_id);
      } catch (cloudinaryErr) {
        console.error('Failed to delete old event image from Cloudinary:', cloudinaryErr);
      }
    }

    const updateRes = await query(
      `UPDATE events 
       SET title = $1, slug = $2, description = $3, image = $4, image_id = $5, event_type = $6, location = $7, event_date = $8, registration_url = $9, event_url = $10, is_featured = $11
       WHERE id = $12 
       RETURNING *`,
      [
        title,
        slug,
        description || null,
        image || null,
        image_id || null,
        event_type || null,
        location || null,
        new Date(event_date),
        registration_url || null,
        event_url || null,
        is_featured === true,
        id
      ]
    );

    return NextResponse.json({ success: true, event: updateRes.rows[0] });
  } catch (error) {
    console.error('PUT /api/activities error:', error);
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
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    
    const eventRes = await query('SELECT image_id FROM events WHERE id = $1', [id]);
    if (eventRes.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const imageId = eventRes.rows[0].image_id;
    if (imageId) {
      try {
        await deleteImage(imageId);
      } catch (cloudinaryErr) {
        console.error('Failed to delete event image from Cloudinary:', cloudinaryErr);
      }
    }

    await query('DELETE FROM events WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/activities error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
