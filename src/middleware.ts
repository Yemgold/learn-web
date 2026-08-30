







// src/middleware.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

export function middleware(
  request: NextRequest,
) {
  /*
   * Authentication is currently handled on the client
   * using the access token stored in sessionStorage.
   *
   * IMPORTANT:
   * Next.js middleware runs on the server and cannot
   * access sessionStorage/localStorage.
   *
   * Therefore, middleware must NOT redirect based on
   * request.cookies.get("accessToken").
   *
   * AuthProvider + AuthStore will handle authentication
   * after the application loads.
   */

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






