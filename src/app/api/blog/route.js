import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin, verifyAuth } from '@/lib/db/middleware.js';
import { deleteImage } from '@/lib/db/cloudinary.js';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   
    .replace(/[\s_]+/g, '-')    
    .replace(/-+/g, '-')        
    .replace(/^-+|-+$/g, '');   
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const admin = isAdmin(req);

    
    if (id || slug) {
      let blogRes;
      if (id) {
        blogRes = await query('SELECT * FROM blogs WHERE id = $1', [id]);
      } else {
        blogRes = await query('SELECT * FROM blogs WHERE slug = $1', [slug]);
      }

      if (blogRes.rows.length === 0) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }

      const blog = blogRes.rows[0];

      
      if (!blog.is_published && !admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      
      const skillsRes = await query(
        `SELECT s.* FROM skills s 
         JOIN blog_skills bs ON s.id = bs.skill_id 
         WHERE bs.blog_id = $1`,
        [blog.id]
      );

      return NextResponse.json({ blog, skills: skillsRes.rows });
    }

    
    let blogsRes;
    if (admin) {
      blogsRes = await query(
        `SELECT * FROM blogs ORDER BY created_at DESC`
      );
    } else {
      blogsRes = await query(
        `SELECT * FROM blogs WHERE is_published = true ORDER BY published_at DESC`
      );
    }

    return NextResponse.json({ blogs: blogsRes.rows });
  } catch (error) {
    console.error('GET /api/blog error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const adminUser = isAdmin(req);
    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, image, image_id, is_published, skill_ids } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const generatedSlug = slugify(title);

    
    const slugCheck = await query('SELECT id FROM blogs WHERE slug = $1', [generatedSlug]);
    if (slugCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Blog title yields a duplicate slug. Please use a unique title.' }, { status: 400 });
    }

    const isPub = is_published === true;
    const publishedAt = isPub ? new Date() : null;

    const insertRes = await query(
      `INSERT INTO blogs (title, slug, description, image, image_id, is_published, published_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, generatedSlug, description, image || null, image_id || null, isPub, publishedAt]
    );

    const newBlog = insertRes.rows[0];

    
    if (Array.isArray(skill_ids) && skill_ids.length > 0) {
      for (const skillId of skill_ids) {
        await query('INSERT INTO blog_skills (blog_id, skill_id) VALUES ($1, $2)', [newBlog.id, skillId]);
      }
    }

    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    const adminUser = isAdmin(req);
    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, image, image_id, is_published, skill_ids } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    
    const currentBlogRes = await query('SELECT image_id, slug, is_published, published_at FROM blogs WHERE id = $1', [id]);
    if (currentBlogRes.rows.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const currentBlog = currentBlogRes.rows[0];
    const generatedSlug = slugify(title);

    
    if (currentBlog.slug !== generatedSlug) {
      const slugCheck = await query('SELECT id FROM blogs WHERE slug = $1 AND id != $2', [generatedSlug, id]);
      if (slugCheck.rows.length > 0) {
        return NextResponse.json({ error: 'Blog title yields a duplicate slug. Please use a unique title.' }, { status: 400 });
      }
    }

    
    if (currentBlog.image_id && image_id && currentBlog.image_id !== image_id) {
      try {
        await deleteImage(currentBlog.image_id);
      } catch (cloudinaryErr) {
        console.error('Failed to delete old blog image from Cloudinary:', cloudinaryErr);
      }
    }

    
    let publishedAt = currentBlog.published_at;
    if (is_published === true && !currentBlog.is_published) {
      publishedAt = new Date(); 
    } else if (is_published === false) {
      publishedAt = null; 
    }

    const updateRes = await query(
      `UPDATE blogs 
       SET title = $1, slug = $2, description = $3, image = $4, image_id = $5, is_published = $6, published_at = $7
       WHERE id = $8 
       RETURNING *`,
      [title, generatedSlug, description, image || null, image_id || null, is_published === true, publishedAt, id]
    );

    
    if (Array.isArray(skill_ids)) {
      
      await query('DELETE FROM blog_skills WHERE blog_id = $1', [id]);
      
      for (const skillId of skill_ids) {
        await query('INSERT INTO blog_skills (blog_id, skill_id) VALUES ($1, $2)', [id, skillId]);
      }
    }

    return NextResponse.json({ success: true, blog: updateRes.rows[0] });
  } catch (error) {
    console.error('PUT /api/blog error:', error);
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
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    
    const blogRes = await query('SELECT image_id FROM blogs WHERE id = $1', [id]);
    if (blogRes.rows.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const imageId = blogRes.rows[0].image_id;
    if (imageId) {
      try {
        await deleteImage(imageId);
      } catch (cloudinaryErr) {
        console.error('Failed to delete blog image from Cloudinary:', cloudinaryErr);
      }
    }

    
    await query('DELETE FROM blogs WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/blog error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
