






import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = "learnyfi.com.ng";

// Subdomains reserved for platform-wide services.
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "admin",
  "app",
  "mail",
  "support",
]);

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const pathname = request.nextUrl.pathname;

  // Do not interfere with API requests.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Identify the school subdomain.
  let subdomain: string | null = null;

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    subdomain = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
  }

  // Support local testing with derock.localhost.
  if (hostname.endsWith(".localhost")) {
    subdomain = hostname.replace(/\.localhost$/, "");
  }

  // Main Learnyfi domain: continue normally.
  if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) {
    return NextResponse.next();
  }

  // Only support one-level school subdomains.
  if (subdomain.includes(".")) {
    return NextResponse.next();
  }

  // Prevent repeated internal rewrites.
  if (pathname.startsWith("/schools/")) {
    return NextResponse.next();
  }

  // Rewrite the school subdomain to its internal school route.
  const url = request.nextUrl.clone();

  url.pathname = `/schools/${subdomain}${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
