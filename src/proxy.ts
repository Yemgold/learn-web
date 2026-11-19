



import { NextRequest, NextResponse } from "next/server";

/* ============================================================
   CONFIGURATION
   ============================================================ */

const ROOT_DOMAIN = "learnyfi.com.ng";

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "admin",
  "app",
  "mail",
  "support",
]);

const STATIC_ROOT_FILES = new Set([
  "/favicon.ico",
  "/manifest.json",
  "/manifest.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
  "/browserconfig.xml",
]);

/* ============================================================
   SCHOOL SUBDOMAIN PROXY
   ============================================================ */

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const hostHeader =
    request.headers.get("host") || request.nextUrl.hostname;

  const hostname = hostHeader
    .split(":")[0]
    .toLowerCase()
    .replace(/\.$/, "");

  /* ============================================================
     1. IGNORE INTERNAL AND API REQUESTS
     ============================================================ */

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/.well-known/") ||
    pathname === "/_next"
  ) {
    return NextResponse.next();
  }

  /* ============================================================
     2. IGNORE STATIC ROOT FILES
     ============================================================ */

  if (STATIC_ROOT_FILES.has(pathname)) {
    return NextResponse.next();
  }

  /* ============================================================
     3. IGNORE STATIC ASSETS
     ============================================================ */

  if (
    /\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|css|js|map|woff2?|ttf|eot)$/i.test(
      pathname,
    )
  ) {
    return NextResponse.next();
  }

  /* ============================================================
     4. DETECT SCHOOL SUBDOMAIN
     ============================================================ */

  let subdomain: string | null = null;

  // Production:
  // derock.learnyfi.com.ng

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    subdomain = hostname.slice(
      0,
      -(ROOT_DOMAIN.length + 1),
    );
  }

  // Local development:
  // derock.localhost

  else if (hostname.endsWith(".localhost")) {
    subdomain = hostname.replace(/\.localhost$/, "");
  }

  console.log("[SCHOOL PROXY] Request:", {
    hostname,
    hostHeader,
    pathname,
  });

  console.log("[SCHOOL PROXY] Detected subdomain:", subdomain);

  /* ============================================================
     5. SKIP MAIN DOMAIN AND RESERVED SUBDOMAINS
     ============================================================ */

  if (
    !subdomain ||
    RESERVED_SUBDOMAINS.has(subdomain)
  ) {
    return NextResponse.next();
  }

  /* ============================================================
     6. ONLY SUPPORT ONE-LEVEL SCHOOL SUBDOMAINS
     ============================================================ */

  if (subdomain.includes(".")) {
    return NextResponse.next();
  }

  /* ============================================================
     7. DO NOT REWRITE INTERNAL SCHOOL ROUTES
     ============================================================ */

  if (pathname.startsWith("/schools/")) {
    return NextResponse.next();
  }

  /* ============================================================
     8. BUILD REWRITE DESTINATION
     ============================================================ */

  const url = request.nextUrl.clone();

  // School subdomain homepage:
  // derock.localhost/
  //
  // Rewrites to:
  // /schools/auth/derock/login

  if (pathname === "/") {
    url.pathname = `/schools/auth/${subdomain}/login`;
  }

  // Explicit school login:
  // derock.localhost/login
  //
  // Rewrites to:
  // /schools/auth/derock/login

  else if (pathname === "/login") {
    url.pathname = `/schools/auth/${subdomain}/login`;
  }

  // School dashboard and management routes:
  //
  // /dashboard       -> /schools/derock/dashboard
  // /administrators  -> /schools/derock/administrators
  // /teachers        -> /schools/derock/teachers
  // /classes         -> /schools/derock/classes
  // /settings        -> /schools/derock/settings

  else {
    url.pathname = `/schools/${subdomain}${pathname}`;
  }

  /* ============================================================
     9. LOG AND EXECUTE REWRITE
     ============================================================ */

  console.log("[SCHOOL PROXY] Rewriting:", {
    from: `${hostname}${pathname}`,
    to: url.pathname,
  });

  return NextResponse.rewrite(url);
}

/* ============================================================
   MATCHER
   ============================================================ */

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|manifest.webmanifest|browserconfig.xml|\\.well-known).*)",
  ],
};














// import { NextRequest, NextResponse } from "next/server";

// const ROOT_DOMAIN = "learnyfi.com.ng";

// const RESERVED_SUBDOMAINS = new Set([
//   "www",
//   "api",
//   "admin",
//   "app",
//   "mail",
//   "support",
// ]);

// const STATIC_ROOT_FILES = new Set([
//   "/favicon.ico",
//   "/manifest.json",
//   "/manifest.webmanifest",
//   "/robots.txt",
//   "/sitemap.xml",
//   "/browserconfig.xml",
// ]);

// export function proxy(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // Ignore browser and development-tool requests.
//   if (
//     pathname.startsWith("/.well-known/") ||
//     pathname.startsWith("/_next/") ||
//     pathname.startsWith("/api/")
//   ) {
//     return NextResponse.next();
//   }

//   // Keep root-level static files accessible.
//   if (STATIC_ROOT_FILES.has(pathname)) {
//     return NextResponse.next();
//   }

//   // Do not rewrite requests for common static assets.
//   if (
//     /\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|css|js|map|woff2?|ttf|eot)$/i.test(
//       pathname,
//     )
//   ) {
//     return NextResponse.next();
//   }

//   const hostHeader =
//     request.headers.get("host") || request.nextUrl.hostname;

//   const hostname = hostHeader
//     .split(":")[0]
//     .toLowerCase()
//     .replace(/\.$/, "");

//   console.log("[SCHOOL PROXY] Request:", {
//     hostname,
//     hostHeader,
//     pathname,
//   });

//   let subdomain: string | null = null;

//   // Production: derock.learnyfi.com.ng
//   if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
//     subdomain = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
//   }

//   // Local development: derock.localhost
//   if (hostname.endsWith(".localhost")) {
//     subdomain = hostname.replace(/\.localhost$/, "");
//   }

//   console.log("[SCHOOL PROXY] Detected subdomain:", subdomain);

//   // Main domain or reserved subdomains.
//   if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) {
//     return NextResponse.next();
//   }

//   // Only support one-level subdomains.
//   if (subdomain.includes(".")) {
//     return NextResponse.next();
//   }

//   // Do not rewrite already-prefixed school routes.
//   if (pathname.startsWith("/schools/")) {
//     return NextResponse.next();
//   }

//   const url = request.nextUrl.clone();

//   // School homepage opens the school login page.
//   if (pathname === "/") {
//     url.pathname = `/schools/${subdomain}/login`;
//   } else {
//     // Example: /dashboard -> /schools/derock/dashboard
//     url.pathname = `/schools/${subdomain}${pathname}`;
//   }

//   console.log("[SCHOOL PROXY] Rewriting:", {
//     from: `${hostname}${pathname}`,
//     to: url.pathname,
//   });

//   return NextResponse.rewrite(url);
// }

// export const config = {
//   matcher: [
//     "/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|manifest.webmanifest|browserconfig.xml|\\.well-known).*)",
//   ],
// };










// // import { NextRequest, NextResponse } from "next/server";

// // const ROOT_DOMAIN = "learnyfi.com.ng";

// // const RESERVED_SUBDOMAINS = new Set([
// //   "www",
// //   "api",
// //   "admin",
// //   "app",
// //   "mail",
// //   "support",
// // ]);

// // export function proxy(request: NextRequest) {
// //   const pathname = request.nextUrl.pathname;

// //   // Read the original hostname from the Host header.
// //   const hostHeader =
// //     request.headers.get("host") || request.nextUrl.hostname;

// //   // Remove the port and normalize the hostname.
// //   const hostname = hostHeader
// //     .split(":")[0]
// //     .toLowerCase()
// //     .replace(/\.$/, "");

// //   console.log("[SCHOOL PROXY] Request:", {
// //     hostname,
// //     hostHeader,
// //     pathname,
// //   });

// //   // Ignore API requests.
// //   if (pathname.startsWith("/api/")) {
// //     return NextResponse.next();
// //   }

// //   let subdomain: string | null = null;

// //   // Production: derock.learnyfi.com.ng
// //   if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
// //     subdomain = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
// //   }

// //   // Local development: derock.localhost
// //   if (hostname.endsWith(".localhost")) {
// //     subdomain = hostname.replace(/\.localhost$/, "");
// //   }

// //   console.log("[SCHOOL PROXY] Detected subdomain:", subdomain);

// //   // Main domain or reserved subdomains.
// //   if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) {
// //     console.log("[SCHOOL PROXY] Skipping main/reserved domain");
// //     return NextResponse.next();
// //   }

// //   // Only support one-level subdomains.
// //   if (subdomain.includes(".")) {
// //     return NextResponse.next();
// //   }

// //   // Prevent rewriting internal school routes.
// //   if (pathname.startsWith("/schools/")) {
// //     return NextResponse.next();
// //   }

// //   const url = request.nextUrl.clone();

// //   // School homepage opens its login page.
// //   if (pathname === "/") {
// //     url.pathname = `/schools/${subdomain}/login`;
// //   } else {
// //     // Example: /dashboard -> /schools/derock/dashboard
// //     url.pathname = `/schools/${subdomain}${pathname}`;
// //   }

// //   console.log("[SCHOOL PROXY] Rewriting:", {
// //     from: `${hostname}${pathname}`,
// //     to: url.pathname,
// //   });

// //   return NextResponse.rewrite(url);
// // }

// // export const config = {
// //   matcher: [
// //     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
// //   ],
// // };
