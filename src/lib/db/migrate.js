import fs from 'fs/promises';
import path from 'path';
import pool from './database.js';

async function migrate() {
  console.log('Starting database migration...');
  
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

    // 2. Check if table exists and has the old 'socials' JSONB column
    const tableCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'settings' AND column_name = 'socials'
    `);

    let existingData = null;
    if (tableCheck.rows.length > 0) {
      console.log('Found old settings table with socials JSONB. Backing up data...');
      const oldDataRes = await client.query('SELECT * FROM settings ORDER BY id ASC LIMIT 1');
      if (oldDataRes.rows.length > 0) {
        const row = oldDataRes.rows[0];
        const socials = typeof row.socials === 'string' ? JSON.parse(row.socials) : (row.socials || {});
        existingData = {
          name: row.name,
          email: row.email,
          title: row.title,
          bio: row.bio,
          resume_url: row.resume_url,
          github_url: socials.github || '',
          linkedin_url: socials.linkedin || '',
          twitter_url: socials.twitter || '',
          facebook_url: socials.facebook || '',
          instagram_url: socials.instagram || '',
          theme: row.theme
        };
      }
      console.log('Dropping old settings table...');
      await client.query('DROP TABLE settings CASCADE');
    }

    // 3. Create the new settings table
    console.log('Creating settings table if not exists...');
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

    // 4. Create update_updated_at_column function if not exists
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

    // 5. Create trigger set_updated_at_settings if not exists
    console.log('Creating trigger for settings updated_at...');
    await client.query(`
      DROP TRIGGER IF EXISTS set_updated_at_settings ON settings;
      CREATE TRIGGER set_updated_at_settings 
      BEFORE UPDATE ON settings 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // 6. Seed default settings if empty
    const checkSettings = await client.query('SELECT COUNT(*)::int as count FROM settings');
    if (checkSettings.rows[0].count === 0) {
      console.log('Seeding settings table...');
      if (existingData) {
        await client.query(`
          INSERT INTO settings (name, email, title, bio, resume_url, github_url, linkedin_url, twitter_url, facebook_url, instagram_url, theme)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          existingData.name,
          existingData.email,
          existingData.title,
          existingData.bio,
          existingData.resume_url,
          existingData.github_url,
          existingData.linkedin_url,
          existingData.twitter_url,
          existingData.facebook_url,
          existingData.instagram_url,
          existingData.theme
        ]);
      } else {
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
      }
      console.log('Settings seeded successfully.');
    } else {
      console.log('Settings table already contains data. Seeding skipped.');
    }

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
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
