import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin } from '@/lib/db/middleware.js';

function formatSettings(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    title: row.title,
    bio: row.bio,
    resumeUrl: row.resume_url || '',
    socials: {
      github: row.github_url || '',
      linkedin: row.linkedin_url || '',
      twitter: row.twitter_url || '',
      facebook: row.facebook_url || '',
      instagram: row.instagram_url || ''
    },
    theme: row.theme || 'dark',
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

async function getSettingsData() {
  try {
    const { rows } = await query('SELECT * FROM settings ORDER BY id ASC LIMIT 1');
    if (rows.length === 0) {
      return {
        name: "Disibin",
        email: "disibin@gmail.com",
        title: "Senior Full-Stack Developer",
        bio: "Crafting robust software solutions and modern web applications.",
        resumeUrl: "",
        socials: {
          github: "https://github.com",
          linkedin: "https://linkedin.com",
          twitter: "https://twitter.com",
          facebook: "",
          instagram: ""
        },
        theme: "dark"
      };
    }
    return formatSettings(rows[0]);
  } catch (error) {
    console.error('getSettingsData error, falling back to default:', error);
    return {
      name: "Disibin",
      email: "disibin@gmail.com",
      title: "Senior Full-Stack Developer",
      bio: "Crafting robust software solutions and modern web applications.",
      resumeUrl: "",
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        facebook: "",
        instagram: ""
      },
      theme: "dark"
    };
  }
}

// GET: Fetch website configuration metadata (Public)
export async function GET(req) {
  try {
    const settings = await getSettingsData();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Update website configuration metadata (Admin Only)
export async function POST(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    // Get existing settings row (to see if we have one to update)
    const { rows } = await query('SELECT * FROM settings ORDER BY id ASC LIMIT 1');
    
    let updatedRow;
    if (rows.length === 0) {
      let githubUrl = '';
      let linkedinUrl = '';
      let twitterUrl = '';
      let facebookUrl = '';
      let instagramUrl = '';

      if (body.socials) {
        githubUrl = body.socials.github || '';
        linkedinUrl = body.socials.linkedin || '';
        twitterUrl = body.socials.twitter || '';
        facebookUrl = body.socials.facebook || '';
        instagramUrl = body.socials.instagram || '';
      } else {
        githubUrl = body.github_url || '';
        linkedinUrl = body.linkedin_url || '';
        twitterUrl = body.twitter_url || '';
        facebookUrl = body.facebook_url || '';
        instagramUrl = body.instagram_url || '';
      }

      // Insert if empty
      const insertRes = await query(
        `INSERT INTO settings (name, email, title, bio, resume_url, github_url, linkedin_url, twitter_url, facebook_url, instagram_url, theme)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          body.name || 'Disibin',
          body.email || 'disibin@gmail.com',
          body.title || null,
          body.bio || null,
          body.resumeUrl || null,
          githubUrl,
          linkedinUrl,
          twitterUrl,
          facebookUrl,
          instagramUrl,
          body.theme || 'dark'
        ]
      );
      updatedRow = insertRes.rows[0];
    } else {
      // Merge new fields with existing
      const current = rows[0];
      const name = body.name !== undefined ? body.name : current.name;
      const email = body.email !== undefined ? body.email : current.email;
      const title = body.title !== undefined ? body.title : current.title;
      const bio = body.bio !== undefined ? body.bio : current.bio;
      const resumeUrl = body.resumeUrl !== undefined ? body.resumeUrl : current.resume_url;
      const theme = body.theme !== undefined ? body.theme : current.theme;

      // Extract socials from either body.socials or flat body fields
      let githubUrl = current.github_url;
      let linkedinUrl = current.linkedin_url;
      let twitterUrl = current.twitter_url;
      let facebookUrl = current.facebook_url;
      let instagramUrl = current.instagram_url;

      if (body.socials) {
        if (body.socials.github !== undefined) githubUrl = body.socials.github;
        if (body.socials.linkedin !== undefined) linkedinUrl = body.socials.linkedin;
        if (body.socials.twitter !== undefined) twitterUrl = body.socials.twitter;
        if (body.socials.facebook !== undefined) facebookUrl = body.socials.facebook;
        if (body.socials.instagram !== undefined) instagramUrl = body.socials.instagram;
      } else {
        if (body.github_url !== undefined) githubUrl = body.github_url;
        if (body.linkedin_url !== undefined) linkedinUrl = body.linkedin_url;
        if (body.twitter_url !== undefined) twitterUrl = body.twitter_url;
        if (body.facebook_url !== undefined) facebookUrl = body.facebook_url;
        if (body.instagram_url !== undefined) instagramUrl = body.instagram_url;
      }

      const updateRes = await query(
        `UPDATE settings 
         SET name = $1, email = $2, title = $3, bio = $4, resume_url = $5, github_url = $6, linkedin_url = $7, twitter_url = $8, facebook_url = $9, instagram_url = $10, theme = $11
         WHERE id = $12 RETURNING *`,
        [name, email, title, bio, resumeUrl, githubUrl, linkedinUrl, twitterUrl, facebookUrl, instagramUrl, theme, current.id]
      );
      updatedRow = updateRes.rows[0];
    }

    return NextResponse.json({ success: true, settings: formatSettings(updatedRow) });
  } catch (error) {
    console.error('POST /api/settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update website configuration metadata (Admin Only)
export async function PUT(req) {
  return POST(req);
}
