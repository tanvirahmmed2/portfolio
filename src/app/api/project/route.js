import { NextResponse } from 'next/server';
import { query } from '@/lib/db/database.js';
import { isAdmin } from '@/lib/db/middleware.js';
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
      let projectRes;
      if (id) {
        projectRes = await query('SELECT * FROM projects WHERE id = $1', [id]);
      } else {
        projectRes = await query('SELECT * FROM projects WHERE slug = $1', [slug]);
      }

      if (projectRes.rows.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      const project = projectRes.rows[0];

      
      if (!project.is_published && !admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      
      const skillsRes = await query(
        `SELECT s.* FROM skills s 
         JOIN project_skills ps ON s.id = ps.skill_id 
         WHERE ps.project_id = $1`,
        [project.id]
      );

      return NextResponse.json({ project, skills: skillsRes.rows });
    }

    
    let projectsRes;
    if (admin) {
      projectsRes = await query('SELECT * FROM projects ORDER BY created_at DESC');
    } else {
      projectsRes = await query('SELECT * FROM projects WHERE is_published = true ORDER BY created_at DESC');
    }

    const projects = projectsRes.rows;

    
    const projectSkillsRes = await query(
      `SELECT ps.project_id, s.* FROM skills s 
       JOIN project_skills ps ON s.id = ps.skill_id`
    );

    const skillsMap = {};
    projectSkillsRes.rows.forEach((row) => {
      const { project_id, ...skill } = row;
      if (!skillsMap[project_id]) {
        skillsMap[project_id] = [];
      }
      skillsMap[project_id].push(skill);
    });

    const enrichedProjects = projects.map((p) => ({
      ...p,
      skills: skillsMap[p.id] || []
    }));

    return NextResponse.json({ projects: enrichedProjects });
  } catch (error) {
    console.error('GET /api/project error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      image,
      image_id,
      url,
      github_url,
      is_featured,
      is_published,
      skill_ids
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const generatedSlug = slugify(title);

    
    const slugCheck = await query('SELECT id FROM projects WHERE slug = $1', [generatedSlug]);
    if (slugCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Project title yields a duplicate slug. Please use a unique title.' }, { status: 400 });
    }

    const insertProjectRes = await query(
      `INSERT INTO projects (title, slug, description, image, image_id, url, github_url, is_featured, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title,
        generatedSlug,
        description,
        image || null,
        image_id || null,
        url || null,
        github_url || null,
        is_featured === true,
        is_published !== false
      ]
    );

    const newProject = insertProjectRes.rows[0];

    
    if (Array.isArray(skill_ids) && skill_ids.length > 0) {
      for (const skillId of skill_ids) {
        await query('INSERT INTO project_skills (project_id, skill_id) VALUES ($1, $2)', [newProject.id, skillId]);
      }
    }

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error('POST /api/project error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const {
      title,
      description,
      image,
      image_id,
      url,
      github_url,
      is_featured,
      is_published,
      skill_ids
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    
    const currentProjRes = await query('SELECT image_id, slug FROM projects WHERE id = $1', [id]);
    if (currentProjRes.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const currentProj = currentProjRes.rows[0];
    const generatedSlug = slugify(title);

    
    if (currentProj.slug !== generatedSlug) {
      const slugCheck = await query('SELECT id FROM projects WHERE slug = $1 AND id != $2', [generatedSlug, id]);
      if (slugCheck.rows.length > 0) {
        return NextResponse.json({ error: 'Project title yields a duplicate slug. Please use a unique title.' }, { status: 400 });
      }
    }

    
    if (currentProj.image_id && image_id && currentProj.image_id !== image_id) {
      try {
        await deleteImage(currentProj.image_id);
      } catch (cloudinaryErr) {
        console.error('Failed to delete old project image from Cloudinary:', cloudinaryErr);
      }
    }

    
    const updateRes = await query(
      `UPDATE projects 
       SET title = $1, slug = $2, description = $3, image = $4, image_id = $5, url = $6, github_url = $7, is_featured = $8, is_published = $9
       WHERE id = $10
       RETURNING *`,
      [
        title,
        generatedSlug,
        description,
        image || null,
        image_id || null,
        url || null,
        github_url || null,
        is_featured === true,
        is_published !== false,
        id
      ]
    );

    
    if (Array.isArray(skill_ids)) {
      
      await query('DELETE FROM project_skills WHERE project_id = $1', [id]);
      
      for (const skillId of skill_ids) {
        await query('INSERT INTO project_skills (project_id, skill_id) VALUES ($1, $2)', [id, skillId]);
      }
    }

    return NextResponse.json({ success: true, project: updateRes.rows[0] });
  } catch (error) {
    console.error('PUT /api/project error:', error);
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
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    
    const projRes = await query('SELECT image_id FROM projects WHERE id = $1', [id]);
    if (projRes.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const imageId = projRes.rows[0].image_id;
    if (imageId) {
      try {
        await deleteImage(imageId);
      } catch (cloudinaryErr) {
        console.error('Failed to delete project image from Cloudinary:', cloudinaryErr);
      }
    }

    
    await query('DELETE FROM projects WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/project error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
