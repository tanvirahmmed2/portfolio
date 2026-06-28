import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin, verifyAuth } from '@/lib/db/middleware.js';

// GET: Retrieve all reviews. Public users only see approved ones, admins see all.
export async function GET(req) {
  try {
    const admin = isAdmin(req);

    let reviewsRes;
    if (admin) {
      reviewsRes = await query('SELECT * FROM reviews ORDER BY created_at DESC');
    } else {
      reviewsRes = await query('SELECT * FROM reviews WHERE is_approved = true ORDER BY created_at DESC');
    }

    return NextResponse.json({ reviews: reviewsRes.rows });
  } catch (error) {
    console.error('GET /api/review error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Submit a review (Public or Authenticated user)
export async function POST(req) {
  try {
    const userPayload = verifyAuth(req); // Optional auth
    const body = await req.json();
    const { name, title, company, rating, review } = body;

    if (!name || !rating || !review) {
      return NextResponse.json({ error: 'Name, rating, and review text are required' }, { status: 400 });
    }

    const ratingVal = parseInt(rating, 10);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const userId = userPayload ? userPayload.id : null;

    const insertRes = await query(
      `INSERT INTO reviews (user_id, name, title, company, rating, review, is_approved) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [userId, name, title || null, company || null, ratingVal, review, false] // Default to unapproved for moderation
    );

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully. It will be visible once approved by the administrator.',
      review: insertRes.rows[0]
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/review error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Moderate (approve/disapprove) review (Admin Only)
export async function PUT(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { is_approved } = body;

    if (is_approved === undefined) {
      return NextResponse.json({ error: 'is_approved is required' }, { status: 400 });
    }

    const updateRes = await query(
      'UPDATE reviews SET is_approved = $1 WHERE id = $2 RETURNING *',
      [is_approved === true, id]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updateRes.rows[0] });
  } catch (error) {
    console.error('PUT /api/review error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete review (Admin Only)
export async function DELETE(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const deleteRes = await query('DELETE FROM reviews WHERE id = $1 RETURNING id', [id]);
    if (deleteRes.rows.length === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/review error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
