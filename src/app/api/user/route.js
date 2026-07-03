import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db/database.js';
import { JWT_SECRET } from '@/lib/db/secret.js';
import { verifyAuth, isAdmin } from '@/lib/db/middleware.js';


export async function GET(req) {
  try {
    const userPayload = verifyAuth(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');

    
    if (all === 'true') {
      if (userPayload.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const { rows } = await query(
        'SELECT id, email, name, role, is_verified, created_at, updated_at FROM "users" ORDER BY created_at DESC'
      );
      return NextResponse.json({ users: rows });
    }

    
    const { rows } = await query(
      'SELECT id, email, name, role, is_verified, created_at, updated_at FROM "users" WHERE id = $1',
      [userPayload.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: rows[0] });
  } catch (error) {
    console.error('GET /api/user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    switch (action) {
      case 'forgot-password': {
        const { email } = body;
        if (!email) {
          return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const userRes = await query('SELECT id FROM "users" WHERE email = $1', [email.trim().toLowerCase()]);
        if (userRes.rows.length === 0) {
          return NextResponse.json({ success: true, message: 'If email exists, reset instructions have been sent.' });
        }

        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await query(
          'UPDATE "users" SET forget_password_token = $1, forget_password_sent_at = CURRENT_TIMESTAMP WHERE email = $2',
          [resetToken, email.trim().toLowerCase()]
        );

        return NextResponse.json({
          success: true,
          message: 'Reset instructions have been sent.',
          token: process.env.NODE_ENV !== 'production' ? resetToken : undefined
        });
      }

      case 'reset-password': {
        const { token, newPassword } = body;
        if (!token || !newPassword) {
          return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        const userRes = await query(
          'SELECT id, forget_password_sent_at FROM "users" WHERE forget_password_token = $1',
          [token]
        );

        if (userRes.rows.length === 0) {
          return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        const user = userRes.rows[0];
        const tokenTime = new Date(user.forget_password_sent_at).getTime();
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        if (now - tokenTime > oneHour) {
          return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        await query(
          'UPDATE "users" SET password_hash = $1, forget_password_token = NULL, forget_password_sent_at = NULL WHERE id = $2',
          [newHash, user.id]
        );

        return NextResponse.json({ success: true, message: 'Password reset successful' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('POST /api/user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id, role, is_verified } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (role && role !== 'user' && role !== 'admin') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const { rows } = await query(
      `UPDATE "users" 
       SET role = COALESCE($1, role), is_verified = COALESCE($2, is_verified) 
       WHERE id = $3 RETURNING id, email, name, role, is_verified`,
      [role || null, is_verified !== undefined ? is_verified : null, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('PUT /api/user error:', error);
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
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const res = await query('DELETE FROM "users" WHERE id = $1 RETURNING id', [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
