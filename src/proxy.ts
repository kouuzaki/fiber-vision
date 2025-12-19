import { auth } from '@/server/auth';
import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication (redirect to login if not logged in)
const protectedRoutes = ['/dashboard'];

// Routes only for guests (redirect to dashboard if already logged in)
const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path matches protected routes
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path matches auth routes (guest only)
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Skip middleware for non-matching routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Get the session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Protected routes: redirect to login if not authenticated
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes: redirect to dashboard if already authenticated
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
