import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './secret.js';

/**
 * Verifies JWT token from cookies or Authorization header.
 * @param {Request} req - Next.js Request object
 * @returns {object|null} Decoded user payload { id, email, role } or null
 */
export function verifyAuth(req) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenCookie = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('token='));
    
    let token = '';
    if (tokenCookie) {
      token = decodeURIComponent(tokenCookie.split('=')[1]);
    } else {
      const authHeader = req.headers.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Checks if request is from an admin user.
 * @param {Request} req - Next.js Request object
 * @returns {object|null} Decoded user payload or null if not admin
 */
export function isAdmin(req) {
  const user = verifyAuth(req);
  return user && user.role === 'admin' ? user : null;
}
