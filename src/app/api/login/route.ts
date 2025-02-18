// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password, idStanza } = await request.json();
  if (password === process.env.LOGIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    // Set cookie with path '/'
    response.cookies.set('loggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });
    response.cookies.set('idStanza', idStanza, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });
    return response;
  } else {
    return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
  }
}
