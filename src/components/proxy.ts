



import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token =
    request.cookies.get("accessToken")?.value;

  console.log("========== PROXY ==========");
  console.log("PATH:", pathname);
  console.log("HAS TOKEN:", Boolean(token));

  /* ============================================================
     TEMPORARY PRACTICE SESSION TEST
     ============================================================ */

  if (
    pathname ===
    "/student/practice/session/test-session-001"
  ) {
    console.log(
      "========== PUBLIC TEST SESSION ALLOWED ==========",
    );

    return NextResponse.next();
  }

  /* ============================================================
     AUTH PAGES
     ============================================================ */

  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
    "/auth/login",
  ];

  /* ============================================================
     PROTECTED ROUTES
     ============================================================ */

  const protectedRoutes = [
    "/student",
    "/admin",
  ];

  const isProtected =
    protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

  const isAuthPage =
    authPages.includes(pathname);

  /* ============================================================
     PROTECT STUDENT / ADMIN
     ============================================================ */

  if (!token && isProtected) {
    const loginUrl =
      new URL("/auth/login", request.url);

    loginUrl.searchParams.set(
      "redirect",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  /* ============================================================
     AUTHENTICATED USER ON AUTH PAGE
     ============================================================ */

  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL(
        "/student/dashboard",
        request.url,
      ),
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
    "/auth/login",
  ],
};