import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin } from '@/lib/db/middleware.js';

export async function GET(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [skillsRes, blogsRes, projectsRes, reviewsRes, contactRes] = await Promise.all([
      query('SELECT COUNT(*) FROM skills'),
      query('SELECT COUNT(*) FROM blogs'),
      query('SELECT COUNT(*) FROM projects'),
      query('SELECT COUNT(*) FROM reviews'),
      query('SELECT COUNT(*) FROM contact WHERE is_read = FALSE')
    ]);

    const stats = {
      skills: parseInt(skillsRes.rows[0].count, 10),
      blogs: parseInt(blogsRes.rows[0].count, 10),
      projects: parseInt(projectsRes.rows[0].count, 10),
      reviews: parseInt(reviewsRes.rows[0].count, 10),
      pendingContacts: parseInt(contactRes.rows[0].count, 10)
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('GET /api/overview error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
