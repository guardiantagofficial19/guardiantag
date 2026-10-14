import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin sub-routes and sensitive admin API endpoints on the server
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Allow public access to admin OTP authentication endpoints
    if (pathname.startsWith('/api/admin/auth')) {
      return NextResponse.next();
    }

    // Allow root /admin page to load so the AdminGatekeeper OTP prompt can render
    if (pathname === '/admin') {
      return NextResponse.next();
    }

    // Verify gt_admin_session cookie on the server
    const adminSession = request.cookies.get('gt_admin_session');

    if (!adminSession || !adminSession.value) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Server-side admin session required.' },
          { status: 401 }
        );
      }

      // Redirect unauthorized browser attempts on /admin subpages back to /admin
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
