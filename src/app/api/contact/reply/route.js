import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin } from '@/lib/db/middleware.js';
import { sendEmail } from '@/lib/mailer.js';

// GET: Retrieve all replies sent for a single contact message (Admin Only)
export async function GET(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contact_id');

    if (!contactId) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const { rows } = await query(
      'SELECT * FROM contact_replies WHERE contact_id = $1 ORDER BY sent_at ASC',
      [contactId]
    );

    return NextResponse.json({ replies: rows });
  } catch (error) {
    console.error('GET /api/contact/reply error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Send reply via mailer and save to contact_replies (Admin Only)
export async function POST(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { contact_id, message } = body;

    if (!contact_id || !message) {
      return NextResponse.json({ error: 'Contact ID and reply message are required' }, { status: 400 });
    }

    // 1. Fetch original message details
    const originalRes = await query('SELECT * FROM contact WHERE id = $1', [contact_id]);
    if (originalRes.rows.length === 0) {
      return NextResponse.json({ error: 'Original message not found' }, { status: 404 });
    }
    const original = originalRes.rows[0];

    // 2. Dispatch email response using mailer.js
    const emailSubject = `Re: ${original.subject}`;
    await sendEmail({
      to: original.email,
      subject: emailSubject,
      text: message,
    });

    // 3. Save reply log in contact_replies table
    const replyRes = await query(
      `INSERT INTO contact_replies (contact_id, message) 
       VALUES ($1, $2) 
       RETURNING *`,
      [contact_id, message.trim()]
    );
    const newReply = replyRes.rows[0];

    // 4. Mark original message as read and set replied_at date
    const updatedContactRes = await query(
      `UPDATE contact 
       SET is_read = TRUE, replied_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [contact_id]
    );

    return NextResponse.json({
      success: true,
      reply: newReply,
      message: updatedContactRes.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/contact/reply error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
