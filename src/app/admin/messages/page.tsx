import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminMessages({ searchParams }: { searchParams: { email?: string } }) {
  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL!);
  
  let submissions: any[] = [];
  try {
    submissions = await sql`SELECT * FROM contact_submissions WHERE source_page LIKE 'chat_widget%' ORDER BY created_at ASC`;
  } catch (err) {
    console.error('Error fetching data:', err);
  }

  // Group by email
  const chats: Record<string, any[]> = {};
  submissions.forEach(sub => {
    if (!chats[sub.email]) chats[sub.email] = [];
    chats[sub.email].push(sub);
  });

  const emails = Object.keys(chats);
  const selectedEmail = searchParams.email || (emails.length > 0 ? emails[0] : null);
  const selectedChat = selectedEmail ? chats[selectedEmail] : [];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ backgroundColor: '#FFFFFF', padding: '20px 40px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, color: '#081B3C', fontWeight: 700 }}>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            <a href="/admin" style={{ textDecoration: 'none', color: '#56606E', fontWeight: 600 }}>Form Submissions</a>
            <a href="/admin/messages" style={{ textDecoration: 'none', color: '#2F6BE0', borderBottom: '2px solid #2F6BE0', paddingBottom: '4px', fontWeight: 600 }}>Chat Messages</a>
          </div>
        </div>
        <a href="/api/auth/logout" style={{ display: 'inline-block', backgroundColor: '#EF4444', color: '#FFFFFF', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Logout</a>
      </header>
      
      <main style={{ padding: '40px', display: 'flex', gap: '20px', height: 'calc(100vh - 100px)' }}>
        {/* Sidebar */}
        <div style={{ width: '300px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflowY: 'auto' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', fontWeight: 700, color: '#081B3C' }}>
            Conversations
          </div>
          {emails.length === 0 ? (
            <div style={{ padding: '20px', color: '#56606E', fontSize: '14px' }}>No chat messages yet.</div>
          ) : (
            emails.map(email => (
              <a 
                key={email} 
                href={`/admin/messages?email=${encodeURIComponent(email)}`}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  borderBottom: '1px solid #E2E8F0',
                  textDecoration: 'none',
                  backgroundColor: email === selectedEmail ? '#EFF6FF' : 'transparent',
                  color: email === selectedEmail ? '#1E40AF' : '#17212F',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{chats[email][0].full_name}</div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>{email}</div>
              </a>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedEmail ? (
            <>
              <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#081B3C' }}>{selectedChat[0]?.full_name}</div>
                <div style={{ fontSize: '14px', color: '#64748B' }}>{selectedEmail} {selectedChat[0]?.organisation ? `• ${selectedChat[0].organisation}` : ''}</div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedChat.map((msg: any) => (
                  <div key={msg.id} style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                    <div style={{ display: 'inline-block', backgroundColor: '#EFF6FF', color: '#0F172A', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', fontSize: '15px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {msg.notes}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', marginLeft: '4px' }}>
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '20px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '14px', textAlign: 'center' }}>
                Replies to users should be sent via your email client to {selectedEmail}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
              Select a conversation to view messages
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
