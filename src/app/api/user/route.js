import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db/database.js';
import { JWT_SECRET } from '@/lib/db/secret.js';
import { verifyAuth } from '@/lib/db/middleware.js';

// GET: Fetch current user profile
export async function GET(req) {
  try {
    const userPayload = verifyAuth(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows } = await query(
      'SELECT id, email, name, role, is_verified, created_at, updated_at FROM users WHERE id = $1',
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

// POST: Manage Auth actions (register, login, logout, forgot-password, reset-password)
export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    switch (action) {
      case 'register': {
        const { email, password, name } = body;
        if (!email || !password) {
          return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
          return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Check user count: if 0, make first user an admin
        const countRes = await query('SELECT COUNT(*)::int as count FROM users');
        const role = countRes.rows[0].count === 0 ? 'admin' : 'user';

        // Insert new user
        // Note: double quotes on "users" table since it is a reserved word in PG
        const insertRes = await query(
          'INSERT INTO "users" (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, is_verified',
          [email, passwordHash, name || null, role]
        );

        const newUser = insertRes.rows[0];

        // Sign JWT
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email, role: newUser.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        const response = NextResponse.json({ success: true, user: newUser, token }, { status: 201 });
        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        });

        return response;
      }

      case 'login': {
        const { email, password } = body;
        if (!email || !password) {
          return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const userRes = await query('SELECT * FROM "users" WHERE email = $1', [email]);
        if (userRes.rows.length === 0) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        const user = userRes.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        if (user.role !== 'admin') {
          return NextResponse.json({ error: 'Access denied: Only administrators can sign in.' }, { status: 403 });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        const profile = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          is_verified: user.is_verified
        };

        const response = NextResponse.json({ success: true, user: profile, token });
        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        });

        return response;
      }

      case 'logout': {
        const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
        response.cookies.delete('token');
        return response;
      }

      case 'forgot-password': {
        const { email } = body;
        if (!email) {
          return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const userRes = await query('SELECT id FROM "users" WHERE email = $1', [email]);
        if (userRes.rows.length === 0) {
          // Silent success for security
          return NextResponse.json({ success: true, message: 'If email exists, reset instructions have been sent.' });
        }

        // Generate token
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await query(
          'UPDATE "users" SET forget_password_token = $1, forget_password_sent_at = CURRENT_TIMESTAMP WHERE email = $2',
          [resetToken, email]
        );

        // Normally you'd send an email here using mailer.js. We return success.
        return NextResponse.json({
          success: true,
          message: 'Reset instructions have been sent.',
          // Expose token in dev for convenience, omit in prod
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
