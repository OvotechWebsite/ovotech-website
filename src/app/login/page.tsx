'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: '#FFFFFF', padding: '48px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#081B3C', fontWeight: 700 }}>Admin Login</h1>
          <p style={{ margin: '8px 0 0', color: '#56606E', fontSize: '15px' }}>Sign in to view submissions</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#17212F' }}>
          Username
          <input 
            type="text" 
            required 
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ fontSize: '16px', padding: '12px 16px', border: '1px solid #D5DEE8', borderRadius: '12px', color: '#081B3C' }} 
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#17212F' }}>
          Password
          <input 
            type="password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ fontSize: '16px', padding: '12px 16px', border: '1px solid #D5DEE8', borderRadius: '12px', color: '#081B3C' }} 
          />
        </label>

        <button 
          type="submit" 
          disabled={loading}
          style={{ marginTop: '10px', fontSize: '16px', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#2F6BE0', border: 'none', padding: '16px', borderRadius: '999px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}


