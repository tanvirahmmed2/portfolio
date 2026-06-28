import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin } from '@/lib/db/middleware.js';

// GET: Fetch all contact messages (Admin Only)
export async function GET(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { rows } = await query('SELECT * FROM contact ORDER BY created_at DESC');
    return NextResponse.json({ messages: rows });
  } catch (error) {
    console.error('GET /api/contact error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Submit a new contact message (Public)
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const insertRes = await query(
      `INSERT INTO contact (name, email, subject, message) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, email, subject, message]
    );

    return NextResponse.json({ success: true, message: insertRes.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Mark message as read/replied (Admin Only)
export async function PUT(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { is_read, replied } = body;

    let updateQuery = 'UPDATE contact SET ';
    const params = [];
    let count = 1;

    if (is_read !== undefined) {
      updateQuery += `is_read = $${count}, `;
      params.push(is_read === true);
      count++;
    }

    if (replied === true) {
      updateQuery += `replied_at = CURRENT_TIMESTAMP, `;
    } else if (replied === false) {
      updateQuery += `replied_at = NULL, `;
    }

    // Remove trailing comma and space
    if (params.length === 0 && replied === undefined) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Slice off trailing comma and add WHERE clause
    updateQuery = updateQuery.trim().replace(/,$/, '') + ` WHERE id = $${count} RETURNING *`;
    params.push(id);

    const updateRes = await query(updateQuery, params);
    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updateRes.rows[0] });
  } catch (error) {
    console.error('PUT /api/contact error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a message (Admin Only)
export async function DELETE(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const deleteRes = await query('DELETE FROM contact WHERE id = $1 RETURNING id', [id]);
    if (deleteRes.rows.length === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/contact error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
