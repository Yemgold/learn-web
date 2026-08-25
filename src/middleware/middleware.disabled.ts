



import { NextRequest, NextResponse } from "next/server";

export function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get("accessToken")?.value;

  const pathname =
    request.nextUrl.pathname;

  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
  ];

  const protectedRoutes = [
    "/student",
    "/admin",
  ];

  const isProtected =
    protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

  const isAuthPage =
    authPages.includes(pathname);

  if (!token && isProtected) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL("/student/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
  ],
};




