import { auth } from '@/server/auth';
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_PAGES, ADMIN_PAGES, DASHBOARD_PAGES } from './lib/constants';

// Routes that require authentication (redirect to login if not logged in)
const protectedRoutes = ['/dashboard', '/settings'];

// Routes only for guests (redirect to dashboard if already logged in)
const authRoutes = [AUTH_PAGES.LOGIN, AUTH_PAGES.REGISTER, AUTH_PAGES.FORGOT_PASSWORD];

// Admin-only routes (requires admin role)
const adminRoutes = [ADMIN_PAGES.USERS];

// Manager+ routes (requires admin or manager role)
const managerRoutes = [DASHBOARD_PAGES.ANALYTICS];

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

  // Check admin routes
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check manager routes
  const isManagerRoute = managerRoutes.some(
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
    const loginUrl = new URL(AUTH_PAGES.LOGIN, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes: redirect to dashboard if already authenticated
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Role-based access control for admin routes
  if (isAdminRoute && session) {
    const userRole = session.user.role;
    if (userRole !== 'admin') {
      // Redirect non-admins to dashboard with access denied
      return NextResponse.redirect(new URL('/dashboard?error=access_denied', request.url));
    }
  }

  // Role-based access control for manager routes
  if (isManagerRoute && session) {
    const userRole = session.user.role;
    if (userRole !== 'admin' && userRole !== 'manager') {
      // Redirect unauthorized users to dashboard
      return NextResponse.redirect(new URL('/dashboard?error=access_denied', request.url));
    }
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

