// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For debugging: log the cookie value (check your terminal logs)
  console.log('Middleware - loggedIn cookie:', request.cookies.get('loggedIn')?.value);
  
  if (request.nextUrl.pathname.startsWith('/interface')) {
    const loggedIn = request.cookies.get('loggedIn')?.value;
    if (loggedIn !== 'true') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/interface/:path*'],
};
