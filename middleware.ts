// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This middleware runs for /interface paths (see config below)
  if (request.nextUrl.pathname.startsWith('/interface')) {
    // Get the loggedIn cookie value
    const loggedIn = request.cookies.get('loggedIn')?.value;
    // For debugging: (check your edge logs)
    console.log('Middleware - loggedIn cookie:', loggedIn);
    // If cookie is not "true", redirect to root "/"
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
