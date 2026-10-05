import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Connect to Neon DB
    const sql = neon(process.env.DATABASE_URL!);

    // Ensure table exists (in production, you'd do this via a migration script, but this works for simplicity)
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

    // Insert data
    await sql`
      INSERT INTO contact_submissions (
        full_name, role, organisation, organisation_type, 
        clinical_system, list_size, email, phone, interests, notes, source_page
      ) VALUES (
        ${data.fullName || null}, 
        ${data.role || null}, 
        ${data.organisation || null}, 
        ${data.organisationType || null}, 
        ${data.clinicalSystem || null}, 
        ${data.listSize || null}, 
        ${data.email || null}, 
        ${data.phone || null}, 
        ${data.interests ? data.interests.join(', ') : null}, 
        ${data.notes || null},
        ${data.sourcePage || 'demo'}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}
