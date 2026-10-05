import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Fetch data
  let submissions = [];
  try {
    submissions = await sql`SELECT * FROM contact_submissions ORDER BY created_at DESC`;
  } catch (err) {
    console.error('Error fetching data (table might not exist yet):', err);
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Admin Dashboard</h1>
      <p style={{ marginBottom: '20px' }}>Contact Form Submissions</p>

      {submissions.length === 0 ? (
        <p>No submissions found or table not initialized.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
