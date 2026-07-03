import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db/database.js';
import { JWT_SECRET } from '@/lib/db/secret.js';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const userRes = await query('SELECT * FROM "users" WHERE email = $1', [email.trim().toLowerCase()]);
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    
    if (!user.is_verified && user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Account not verified. Please wait for administrator approval.' 
      }, { status: 403 });
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

  } catch (error) {
    console.error('POST /api/user/signin error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
