import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin } from '@/lib/db/middleware.js';


export async function GET(req) {
  try {
    const { rows } = await query('SELECT * FROM work ORDER BY start_date DESC');
    
    
    const mapped = rows.map(r => ({
      ...r,
      position: r.title,
      currently_working: r.is_current
    }));

    return NextResponse.json({ success: true, works: mapped, workHistory: rows });
  } catch (error) {
    console.error('GET /api/work error:', error);
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
      company_name,
      company_url,
      title,
      location,
      start_date,
      end_date,
      is_current,
      description
    } = body;

    if (!company_name || !title || !start_date || !description) {
      return NextResponse.json({ error: 'Company name, title, start date, and description are required' }, { status: 400 });
    }

    const insertRes = await query(
      `INSERT INTO work (company_name, company_url, title, location, start_date, end_date, is_current, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        company_name,
        company_url || null,
        title,
        location || null,
        new Date(start_date),
        end_date ? new Date(end_date) : null,
        is_current === true,
        description
      ]
    );

    return NextResponse.json({ success: true, work: insertRes.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/work error:', error);
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
      return NextResponse.json({ error: 'Work ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const {
      company_name,
      company_url,
      title,
      location,
      start_date,
      end_date,
      is_current,
      description
    } = body;

    if (!company_name || !title || !start_date || !description) {
      return NextResponse.json({ error: 'Company name, title, start date, and description are required' }, { status: 400 });
    }

    const updateRes = await query(
      `UPDATE work
       SET company_name = $1, company_url = $2, title = $3, location = $4, start_date = $5, end_date = $6, is_current = $7, description = $8
       WHERE id = $9
       RETURNING *`,
      [
        company_name,
        company_url || null,
        title,
        location || null,
        new Date(start_date),
        end_date ? new Date(end_date) : null,
        is_current === true,
        description,
        id
      ]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Work entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, work: updateRes.rows[0] });
  } catch (error) {
    console.error('PUT /api/work error:', error);
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
      return NextResponse.json({ error: 'Work ID is required' }, { status: 400 });
    }

    const deleteRes = await query('DELETE FROM work WHERE id = $1 RETURNING id', [id]);
    if (deleteRes.rows.length === 0) {
      return NextResponse.json({ error: 'Work entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Work history entry deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/work error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
