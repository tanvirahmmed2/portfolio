import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db/database.js';
import { JWT_SECRET } from '@/lib/db/secret.js';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check duplicate registrations
    const existingUser = await query('SELECT id FROM "users" WHERE email = $1', [email.trim().toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Default: role = 'user', is_verified = false (moderated by admin)
    const insertRes = await query(
      `INSERT INTO "users" (email, password_hash, name, role, is_verified) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, role, is_verified`,
      [email.trim().toLowerCase(), passwordHash, name || null, 'user', false]
    );

    const newUser = insertRes.rows[0];

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

  } catch (error) {
    console.error('POST /api/user/signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
