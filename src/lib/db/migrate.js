import fs from 'fs/promises';
import path from 'path';
import pool from './database.js';
import bcrypt from 'bcryptjs';

async function migrate() {
  console.log('Starting full database migration and setup...');
  
  // 1. Read default settings in case no table exists
  const settingsFilePath = path.join(process.cwd(), 'src/lib/db/settings.json');
  let settingsData = {
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

  try {
    const fileContent = await fs.readFile(settingsFilePath, 'utf-8');
    settingsData = JSON.parse(fileContent);
    console.log('Read default configuration from settings.json');
  } catch (error) {
    console.log('No settings.json found, using default settings');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 2. Create custom user_role type if not exists
    console.log('Creating user_role enum type...');
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('user', 'admin');
        END IF;
      END$$;
    `);

    // 3. Create all tables from schema.psql
    console.log('Creating database tables...');

    // Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        role user_role NOT NULL DEFAULT 'user',
        is_verified BOOLEAN DEFAULT FALSE,
        forget_password_token VARCHAR(255),
        forget_password_sent_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Skills
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        category VARCHAR(50) NOT NULL,
        proficiency INTEGER CHECK (proficiency BETWEEN 0 AND 100),
        image VARCHAR(255),
        image_id TEXT,
        display_order INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Projects
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        summary VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        image_id TEXT,
        url VARCHAR(255),
        github_url VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Comments
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES "users"(id) ON DELETE SET NULL,
        guest_name VARCHAR(100),
        guest_email VARCHAR(255),
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
        is_approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Reviews
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES "users"(id) ON DELETE SET NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        title VARCHAR(100),
        company VARCHAR(100),
        rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
        review TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Blogs
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        author_id INTEGER NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255),
        image_id TEXT,
        is_published BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Work
    await client.query(`
      CREATE TABLE IF NOT EXISTS work (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(150) NOT NULL,
        company_url VARCHAR(255),
        title VARCHAR(150) NOT NULL,
        location VARCHAR(100),
        start_date DATE NOT NULL,
        end_date DATE,
        is_current BOOLEAN DEFAULT FALSE,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Contact
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        replied_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Contact Replies
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_replies (
        id SERIAL PRIMARY KEY,
        contact_id INTEGER NOT NULL REFERENCES contact(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Events
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        image_id TEXT,
        event_type VARCHAR(100),
        location VARCHAR(255),
        event_date TIMESTAMP WITH TIME ZONE NOT NULL,
        registration_url VARCHAR(255),
        event_url VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Project Skills (junction)
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_skills (
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
        PRIMARY KEY (project_id, skill_id)
      );
    `);

    // Blog Skills (junction)
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_skills (
        blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
        skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
        PRIMARY KEY (blog_id, skill_id)
      );
    `);

    // Settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        bio TEXT,
        resume_url VARCHAR(255),
        github_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        twitter_url VARCHAR(255),
        facebook_url VARCHAR(255),
        instagram_url VARCHAR(255),
        theme VARCHAR(50) DEFAULT 'dark',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create Indexes
    console.log('Creating database indexes...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_user_email ON "users"(email);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON blogs(is_published);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_work_start_date ON work(start_date DESC);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact(created_at DESC);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_project_skills_skill_id ON project_skills(skill_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_blog_skills_skill_id ON blog_skills(skill_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_contact_replies_contact_id ON contact_replies(contact_id);');

    // Safe schema alterations
    await client.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS email VARCHAR(255);');

    // 5. Create trigger function for updated_at
    console.log('Creating update_updated_at_column trigger function...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 6. Setup triggers on tables
    console.log('Setting up updated_at triggers...');
    const tablesWithUpdatedAt = ['users', 'projects', 'comments', 'reviews', 'blogs', 'work', 'events', 'settings'];
    for (const t of tablesWithUpdatedAt) {
      await client.query(`DROP TRIGGER IF EXISTS set_updated_at_${t} ON "${t}";`);
      await client.query(`
        CREATE TRIGGER set_updated_at_${t}
        BEFORE UPDATE ON "${t}"
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    // 7. Seed settings table if empty
    console.log('Checking settings seeding status...');
    const checkSettings = await client.query('SELECT COUNT(*)::int as count FROM settings');
    if (checkSettings.rows[0].count === 0) {
      console.log('Seeding settings table...');
      await client.query(`
        INSERT INTO settings (name, email, title, bio, resume_url, github_url, linkedin_url, twitter_url, facebook_url, instagram_url, theme)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        settingsData.name,
        settingsData.email,
        settingsData.title,
        settingsData.bio,
        settingsData.resumeUrl || '',
        settingsData.socials?.github || '',
        settingsData.socials?.linkedin || '',
        settingsData.socials?.twitter || '',
        settingsData.socials?.facebook || '',
        settingsData.socials?.instagram || '',
        settingsData.theme || 'dark'
      ]);
      console.log('Settings seeded successfully.');
    } else {
      console.log('Settings table already contains data. Seeding skipped.');
    }

    // 8. Seed default admin user if empty
    console.log('Checking users table seeding status...');
    const checkUsers = await client.query('SELECT COUNT(*)::int as count FROM "users"');
    if (checkUsers.rows[0].count === 0) {
      console.log('Seeding default admin user...');
      const passwordHash = await bcrypt.hash('admin123', 10);
      await client.query(`
        INSERT INTO "users" (email, password_hash, name, role, is_verified)
        VALUES ($1, $2, $3, $4, $5)
      `, ['admin@portfolio.com', passwordHash, 'System Admin', 'admin', true]);
      console.log('Default admin seeded successfully. Credentials: admin@portfolio.com / admin123');
    } else {
      console.log('Users table already contains data. Seeding skipped.');
    }

    await client.query('COMMIT');
    console.log('Database initialization completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
