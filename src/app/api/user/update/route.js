import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db/database.js';
import { JWT_SECRET } from '@/lib/db/secret.js';
import { verifyAuth } from '@/lib/db/middleware.js';

export async function PUT(req) {
  try {
    const userPayload = verifyAuth(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password } = body;
    const targetUserId = userPayload.id;

    
    if (email && email.trim().toLowerCase() !== userPayload.email.toLowerCase()) {
      const emailCheck = await query('SELECT id FROM "users" WHERE email = $1 AND id != $2', [email.trim().toLowerCase(), targetUserId]);
      if (emailCheck.rows.length > 0) {
        return NextResponse.json({ error: 'Email address already in use by another account' }, { status: 400 });
      }
    }

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    
    let updateQuery = 'UPDATE "users" SET ';
    const params = [];
    let count = 1;

    if (name !== undefined) {
      updateQuery += `name = $${count}, `;
      params.push(name ? name.trim() : null);
      count++;
    }

    if (email !== undefined) {
      updateQuery += `email = $${count}, `;
      params.push(email.trim().toLowerCase());
      count++;
    }

    if (passwordHash !== null) {
      updateQuery += `password_hash = $${count}, `;
      params.push(passwordHash);
      count++;
    }

    if (params.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    
    updateQuery = updateQuery.trim().replace(/,$/, '') + ` WHERE id = $${count} RETURNING id, email, name, role, is_verified`;
    params.push(targetUserId);

    const updateRes = await query(updateQuery, params);
    if (updateRes.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = updateRes.rows[0];

    
    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ success: true, user: updatedUser, token });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('PUT /api/user/update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
