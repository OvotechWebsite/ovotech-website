import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL!);

  async function deleteSubmission(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL!);
    await sql`DELETE FROM contact_submissions WHERE id = ${id}`;
    revalidatePath('/admin');
  }

  // Fetch data
  let submissions: any[] = [];
  try {
    // Ensure table exists
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
    submissions = await sql`SELECT * FROM contact_submissions ORDER BY created_at DESC`;
  } catch (err) {
    console.error('Error fetching data (table might not exist yet):', err);
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ backgroundColor: '#FFFFFF', padding: '20px 40px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, color: '#081B3C', fontWeight: 700 }}>Admin Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#56606E', fontSize: '14px' }}>Manage Contact Form Submissions</p>
        </div>
        <a 
          href="/api/auth/logout"
          style={{ display: 'inline-block', backgroundColor: '#EF4444', color: '#FFFFFF', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Logout
        </a>
      </header>
      
      <main style={{ padding: '40px' }}>
        {submissions.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', textAlign: 'center', color: '#56606E', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: '18px', fontWeight: 600 }}>No submissions yet.</p>
            <p style={{ fontSize: '14px' }}>When users fill out the contact form, their data will appear here.</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Date</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Source</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Name</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Email</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Organisation</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Role / Org Type</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>System / Size</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Phone</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Interests</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Notes</th>
                <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub: any) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                    {new Date(sub.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '999px', 
                      fontSize: '12px',
                      backgroundColor: sub.source_page === 'demo' ? '#dbeafe' : '#fce7f3',
                      color: sub.source_page === 'demo' ? '#1e40af' : '#9d174d'
                    }}>
                      {sub.source_page}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{sub.full_name}</td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                    <a href={"mailto:" + sub.email} style={{ color: '#2563eb' }}>{sub.email}</a>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{sub.organisation}</td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                    {sub.role && <div>Role: {sub.role}</div>}
                    {sub.organisation_type && <div>Type: {sub.organisation_type}</div>}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                    {sub.clinical_system && <div>System: {sub.clinical_system}</div>}
                    {sub.list_size && <div>Size: {sub.list_size}</div>}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{sub.phone}</td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{sub.interests}</td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{sub.notes}</td>
                  <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                    <form action={deleteSubmission}>
                      <input type="hidden" name="id" value={sub.id} />
                      <button type="submit" style={{ backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </main>
    </div>
  );
}
