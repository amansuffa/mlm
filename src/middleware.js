// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

// export { auth as middleware } from "@/auth";

// export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // Protected routes list
  const protectedRoutes = ['/dashboard', '/user/profile', '/user/referrals', '/packages'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    const userStatus = token?.status; 
    console.log("User status from token:", userStatus);

    
    if (userStatus === 'free' && isProtectedRoute && pathname !== '/packages') {
      return NextResponse.redirect(new URL('/packages', request.url));
    }

    if (userStatus !== 'free' && pathname === '/packages') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*', 
    '/commission/:path*',
    '/genealogy/:path*',
    '/packages/:path*',
    '/login/:path*',
    '/signup/:path*'
  ]
};