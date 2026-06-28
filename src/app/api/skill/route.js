import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin } from '@/lib/db/middleware.js';
import { deleteImage } from '@/lib/db/cloudinary.js';

// GET: Fetch all skills or a single skill by id
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const { rows } = await query('SELECT * FROM skills WHERE id = $1', [id]);
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }
      return NextResponse.json({ skill: rows[0] });
    }

    const { rows } = await query('SELECT * FROM skills ORDER BY display_order ASC, name ASC');
    return NextResponse.json({ skills: rows });
  } catch (error) {
    console.error('GET /api/skill error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new skill (Admin Only)
export async function POST(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, image, image_id, is_featured } = body;
    
    // Convert and validate types
    const proficiency = parseInt(body.proficiency, 10) || 0;
    const display_order = parseInt(body.display_order, 10) || 0;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    if (proficiency < 0 || proficiency > 100) {
      return NextResponse.json({ error: 'Proficiency must be between 0 and 100' }, { status: 400 });
    }

    // Check duplicate skill name
    const duplicateCheck = await query('SELECT id FROM skills WHERE LOWER(name) = LOWER($1)', [name.trim()]);
    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Skill name already exists' }, { status: 400 });
    }

    const insertRes = await query(
      `INSERT INTO skills (name, category, proficiency, image, image_id, display_order, is_featured) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        name.trim(),
        category.trim(),
        proficiency,
        image || null,
        image_id || null,
        display_order,
        is_featured === true
      ]
    );

    return NextResponse.json({ success: true, skill: insertRes.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/skill error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update an existing skill (Admin Only)
export async function PUT(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { name, category, image, image_id, is_featured } = body;
    
    // Convert and validate types
    const proficiency = parseInt(body.proficiency, 10) || 0;
    const display_order = parseInt(body.display_order, 10) || 0;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    if (proficiency < 0 || proficiency > 100) {
      return NextResponse.json({ error: 'Proficiency must be between 0 and 100' }, { status: 400 });
    }

    // Get current skill to check existence and handle image replacements
    const currentSkillRes = await query('SELECT image_id FROM skills WHERE id = $1', [id]);
    if (currentSkillRes.rows.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Check duplicate skill name (for a different skill id)
    const duplicateCheck = await query(
      'SELECT id FROM skills WHERE LOWER(name) = LOWER($1) AND id <> $2', 
      [name.trim(), id]
    );
    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Skill name already exists' }, { status: 400 });
    }

    const oldImageId = currentSkillRes.rows[0].image_id;
    if (oldImageId && image_id && oldImageId !== image_id) {
      // Image was updated, delete old one from Cloudinary
      try {
        await deleteImage(oldImageId);
      } catch (cloudinaryErr) {
        console.error('Failed to delete old image from Cloudinary:', cloudinaryErr);
      }
    }

    const updateRes = await query(
      `UPDATE skills 
       SET name = $1, category = $2, proficiency = $3, image = $4, image_id = $5, display_order = $6, is_featured = $7
       WHERE id = $8 
       RETURNING *`,
      [
        name.trim(),
        category.trim(),
        proficiency,
        image || null,
        image_id || null,
        display_order,
        is_featured === true,
        id
      ]
    );

    return NextResponse.json({ success: true, skill: updateRes.rows[0] });
  } catch (error) {
    console.error('PUT /api/skill error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a skill (Admin Only)
export async function DELETE(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    // Get current skill to delete image from Cloudinary
    const skillRes = await query('SELECT image_id FROM skills WHERE id = $1', [id]);
    if (skillRes.rows.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const imageId = skillRes.rows[0].image_id;
    if (imageId) {
      try {
        await deleteImage(imageId);
      } catch (cloudinaryErr) {
        console.error('Failed to delete image from Cloudinary:', cloudinaryErr);
      }
    }

    await query('DELETE FROM skills WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/skill error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
