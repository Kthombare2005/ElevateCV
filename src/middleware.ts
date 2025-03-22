import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for Firebase session cookie
  if (request.nextUrl.pathname.startsWith('/analyze')) {
    const session = request.cookies.get('__session');
    
    if (!session) {
      // Redirect to auth page if no session is found
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/analyze/:path*',
}; 