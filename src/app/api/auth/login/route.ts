import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = (process.env.ADMIN_USERNAME || 'admins@ovotech.co.uk').replace(/['"]/g, '').trim();
    const expectedPassword = (process.env.ADMIN_PASSWORD || 'OvoTech@786123').replace(/['"]/g, '').trim();
    
    const inputUser = username.trim();
    const inputPassword = password.trim();

    if (inputUser === expectedUser && inputPassword === expectedPassword) {
      const response = NextResponse.json({ success: true });
      // Set a simple cookie for authorization
      response.cookies.set('admin_token', 'authorized', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials (v2)' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
