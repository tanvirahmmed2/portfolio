import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin, verifyAuth } from '@/lib/db/middleware.js';

// GET: Fetch comments for a specific project
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      return NextResponse.json({ error: 'project_id is required' }, { status: 400 });
    }

    const admin = isAdmin(req);
    let commentsRes;

    if (admin) {
      commentsRes = await query(
        `SELECT c.*, u.name as user_name, u.email as user_email
         FROM comments c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.project_id = $1
         ORDER BY c.created_at ASC`,
        [projectId]
      );
    } else {
      commentsRes = await query(
        `SELECT c.id, c.project_id, c.user_id, c.guest_name, c.content, c.parent_id, c.created_at, c.updated_at,
                u.name as user_name
         FROM comments c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.project_id = $1 AND c.is_approved = true
         ORDER BY c.created_at ASC`,
        [projectId]
      );
    }

    return NextResponse.json({ comments: commentsRes.rows });
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Post a new comment (Public / Registered Users)
export async function POST(req) {
  try {
    const userPayload = verifyAuth(req);
    const body = await req.json();
    const { project_id, guest_name, guest_email, content, parent_id } = body;

    if (!project_id || !content) {
      return NextResponse.json({ error: 'project_id and content are required' }, { status: 400 });
    }

    // Verify project exists
    const projCheck = await query('SELECT id FROM projects WHERE id = $1', [project_id]);
    if (projCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Verify parent comment exists if parent_id is specified
    if (parent_id) {
      const parentCheck = await query('SELECT id FROM comments WHERE id = $1 AND project_id = $2', [parent_id, project_id]);
      if (parentCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Parent comment not found in this project' }, { status: 404 });
      }
    }

    let userId = null;
    let name = null;
    let email = null;

    if (userPayload) {
      userId = userPayload.id;
    } else {
      if (!guest_name || !guest_email) {
        return NextResponse.json({ error: 'guest_name and guest_email are required for guests' }, { status: 400 });
      }
      name = guest_name;
      email = guest_email;
    }

    const insertRes = await query(
      `INSERT INTO comments (project_id, user_id, guest_name, guest_email, content, parent_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [project_id, userId, name, email, content, parent_id || null]
    );

    return NextResponse.json({ success: true, comment: insertRes.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Moderate (approve/disapprove) comment (Admin Only)
export async function PUT(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { is_approved } = body;

    if (is_approved === undefined) {
      return NextResponse.json({ error: 'is_approved is required' }, { status: 400 });
    }

    const updateRes = await query(
      'UPDATE comments SET is_approved = $1 WHERE id = $2 RETURNING *',
      [is_approved === true, id]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, comment: updateRes.rows[0] });
  } catch (error) {
    console.error('PUT /api/comments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a comment (Admin or comment Owner)
export async function DELETE(req) {
  try {
    const userPayload = verifyAuth(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    // Check if comment exists
    const commentRes = await query('SELECT user_id FROM comments WHERE id = $1', [id]);
    if (commentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const comment = commentRes.rows[0];

    // Allowed if admin OR if the logged-in user is the owner of the comment
    const admin = userPayload.role === 'admin';
    const isOwner = comment.user_id === userPayload.id;

    if (!admin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await query('DELETE FROM comments WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/comments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
