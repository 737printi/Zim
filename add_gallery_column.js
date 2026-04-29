const { Client } = require('pg');

const connectionString = 'postgresql://postgres:soSv36mzSgCoLWOp@db.kehbekloexpecxulmprq.supabase.co:5432/postgres';

async function addGalleryColumn() {
  const client = new Client({ connectionString });
  try {
    await client.connect();

    await client.query(`
      ALTER TABLE public.stl_files 
      ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT '{}';
    `);
    console.log('Column gallery_urls added successfully.');

  } catch (err) {
    console.error('Error adding column:', err);
  } finally {
    await client.end();
  }
}

addGalleryColumn();
