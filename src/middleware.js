import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Protected routes
  const protectedRoutes = [
    '/dashboard', 
    '/user', 
    '/manage-users', 
    '/blog-editor', 
    '/email-templates', 
    '/transactions', 
    '/confirm-payments'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If accessing protected route without auth, redirect to login
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and accessing login page, redirect to dashboard
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/user/:path*', 
    '/manage-users/:path*',
    '/blog-editor/:path*',
    '/email-templates/:path*',
    '/transactions/:path*',
    '/confirm-payments/:path*',
    '/login'
  ]
};

// export async function middleware(request) {
//   const token = await getToken({ 
//     req: request, 
//     secret: process.env.NEXTAUTH_SECRET 
//   });

//   const { pathname } = request.nextUrl;

//   // Protected routes list
//   const protectedRoutes = ['/dashboard', '/user/profile', '/user/referrals', '/packages'];
//   const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

//   if (!token && isProtectedRoute) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (token) {
//     const userStatus = token?.status; 
//     console.log("User status from token:", userStatus);

    
//     if (userStatus === 'free' && isProtectedRoute && pathname !== '/packages') {
//       return NextResponse.redirect(new URL('/packages', request.url));
//     }

//     if (userStatus !== 'free' && pathname === '/packages') {
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }

//     if (pathname === '/login' || pathname === '/signup') {
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/profile/:path*', 
//     '/commission/:path*',
//     '/genealogy/:path*',
//     '/packages/:path*',
//     '/login/:path*',
//     '/signup/:path*'
//   ]
// };