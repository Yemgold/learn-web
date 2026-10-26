




const CACHE_NAME = "learnyfi-offline-v2";
const APP_SHELL_CACHE = `${CACHE_NAME}-shell`;
const STATIC_CACHE = `${CACHE_NAME}-static`;

const OFFLINE_FALLBACK = "/student/practice/offline";

const OFFLINE_ROUTES = [
  "/student/practice/offline",
  "/student/games",
  "/student/games/whot",
  "/student/games/whot/setup",
  "/student/games/whot/play",
  "/student/games/whot/friend",
  "/student/games/edu-ludo",
  "/student/games/word-challenge",
  "/student/arena",
  "/student/books",
  "/student/practice/offline2",

];

const EXCLUDED_PATHS = [
  "/api/",
  "/login",
  "/logout",
];

function isExcludedPath(pathname) {
  return EXCLUDED_PATHS.some((path) =>
    pathname.includes(path)
  );
}

function isOfflineRoute(pathname) {
  return OFFLINE_ROUTES.includes(pathname);
}

async function findCachedNavigation(requestUrl) {
  const cache = await caches.open(APP_SHELL_CACHE);
  const requestedUrl = new URL(requestUrl);

  // Try the exact URL first, including its query string.
  const exactMatch = await cache.match(requestUrl);

  if (exactMatch) {
    return exactMatch;
  }

  // Fall back to a cached URL with the same pathname.
  // This accommodates query strings used by Next.js navigation.
  const keys = await cache.keys();

  const matchingRequest = keys.find((key) => {
    const cachedUrl = new URL(key.url);

    return (
      cachedUrl.origin === requestedUrl.origin &&
      cachedUrl.pathname === requestedUrl.pathname
    );
  });

  if (matchingRequest) {
    return cache.match(matchingRequest);
  }

  return null;
}

async function cacheSuccessfulNavigation(request, response) {
  if (
    !response ||
    !response.ok ||
    response.type !== "basic"
  ) {
    return;
  }

  const cache = await caches.open(APP_SHELL_CACHE);

  await cache.put(request, response.clone());
}

async function handleNavigation(request) {
  const url = new URL(request.url);

  try {
    const response = await fetch(request);

    if (response.ok && response.type === "basic") {
      await cacheSuccessfulNavigation(request, response);
    }

    return response;
  } catch {
    const cachedPage = await findCachedNavigation(request.url);

    if (cachedPage) {
      return cachedPage;
    }

    // If an offline route wasn't cached under its exact URL,
    // try the offline practice page as a last resort.
    const fallback = await findCachedNavigation(
      new URL(OFFLINE_FALLBACK, self.location.origin).href
    );

    if (fallback) {
      return fallback;
    }

    return new Response(
      `Learnyfi is offline, and this page has not been saved yet.\n\n` +
        `Requested page: ${url.pathname}\n\n` +
        `Connect to the internet, open this page, and try again.`,
      {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok && response.type === "basic") {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return new Response("", { status: 504 });
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_SHELL_CACHE);

      // Keep the manifest and the existing working offline page.
      // The page is cached only if it can be fetched successfully.
      const resources = [
        "/manifest.json",
        OFFLINE_FALLBACK,
      ];

      for (const resource of resources) {
        try {
          const response = await fetch(resource, {
            cache: "reload",
          });

          if (response.ok && response.type === "basic") {
            await cache.put(resource, response.clone());
          }
        } catch {
          // Installation should still succeed if offline resources
          // cannot be fetched at this moment.
        }
      }

      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("learnyfi-offline-") &&
              key !== APP_SHELL_CACHE &&
              key !== STATIC_CACHE
          )
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  // Never cache API responses, authentication, or account-specific
  // data through these general offline caches.
  if (isExcludedPath(url.pathname)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Cache Next.js generated assets, icons, and the web manifest.
  // Cache Next.js generated assets, icons, and the web manifest.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json"
  ) {
    event.respondWith(handleStaticAsset(request));
  }
});




















// const CACHE_NAME = "learnyfi-offline-v1";
// const APP_SHELL_CACHE = `${CACHE_NAME}-shell`;
// const STATIC_CACHE = `${CACHE_NAME}-static`;

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(APP_SHELL_CACHE).then((cache) =>
//       cache.add("/manifest.json")
//     )
//   );

//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) =>
//       Promise.all(
//         keys
//           .filter(
//             (key) =>
//               key.startsWith("learnyfi-offline-") &&
//               key !== APP_SHELL_CACHE &&
//               key !== STATIC_CACHE
//           )
//           .map((key) => caches.delete(key))
//       )
//     )
//   );

//   self.clients.claim();
// });

// self.addEventListener("fetch", (event) => {
//   const request = event.request;
//   const url = new URL(request.url);

//   if (
//     request.method !== "GET" ||
//     url.origin !== self.location.origin
//   ) {
//     return;
//   }

//   // Do not cache API responses, authentication, or account-specific data.
//   if (
//     url.pathname.startsWith("/api/") ||
//     url.pathname.includes("/login") ||
//     url.pathname.includes("/logout")
//   ) {
//     return;
//   }

//   if (request.mode === "navigate") {
//     event.respondWith(
//       (async () => {
//         const cache = await caches.open(APP_SHELL_CACHE);

//         try {
//           const response = await fetch(request);

//           if (response.ok && response.type === "basic") {
//             await cache.put(request, response.clone());
//           }

//           return response;
//         } catch {
//           const cachedPage = await cache.match(request);

//           if (cachedPage) return cachedPage;

//           // The practice page may have been cached with a different URL form.
//           if (url.pathname === "/student/practice/offline") {
//             const keys = await cache.keys();
//             const match = keys.find((key) => {
//               const cachedUrl = new URL(key.url);
//               return (
//                 cachedUrl.origin === self.location.origin &&
//                 cachedUrl.pathname === "/student/practice/offline"
//               );
//             });

//             if (match) return cache.match(match);
//           }

//           return new Response(
//             "This page is not available offline yet. Connect to the internet and open Learnyfi Offline Practice once before going offline.",
//             {
//               status: 503,
//               headers: {
//                 "Content-Type": "text/plain; charset=utf-8",
//               },
//             }
//           );
//         }
//       })()
//     );

//     return;
//   }

//   // Cache successful same-origin static assets as they are requested.
//   if (
//     url.pathname.startsWith("/_next/static/") ||
//     url.pathname.startsWith("/icons/")
//   ) {
//     event.respondWith(
//       (async () => {
//         const cache = await caches.open(STATIC_CACHE);
//         const cached = await cache.match(request);

//         if (cached) return cached;

//         try {
//           const response = await fetch(request);

//           if (response.ok) {
//             await cache.put(request, response.clone());
//           }

//           return response;
//         } catch {
//           return new Response("", { status: 504 });
//         }
//       })()
//     );
//   }
// });
