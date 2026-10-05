import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'admins@ovotech.co.uk';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'OvoTech@786123';

    if (username === expectedUser && password === expectedPassword) {
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

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
