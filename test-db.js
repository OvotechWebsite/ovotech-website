const { loadEnvConfig } = require('@next/env');
loadEnvConfig('./');
const { neon } = require('@neondatabase/serverless');

async function test() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        organisation VARCHAR(255),
        organisation_type VARCHAR(255),
        clinical_system VARCHAR(255),
        list_size VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        interests TEXT,
        notes TEXT,
        source_page VARCHAR(50) DEFAULT 'demo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Table created");
    await sql`
      INSERT INTO contact_submissions (
        full_name, email, source_page
      ) VALUES (
        'Test User', 'test@example.com', 'test'
      )
    `;
    console.log("Data inserted");
  } catch (err) {
    console.error(err);
  }
}
test();
