






const CACHE_NAME = "learnyfi-offline-v1";
const APP_SHELL_CACHE = `${CACHE_NAME}-shell`;
const STATIC_CACHE = `${CACHE_NAME}-static`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) =>
      cache.add("/manifest.json")
    )
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("learnyfi-offline-") &&
              key !== APP_SHELL_CACHE &&
              key !== STATIC_CACHE
          )
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Do not cache API responses, authentication, or account-specific data.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("/login") ||
    url.pathname.includes("/logout")
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(APP_SHELL_CACHE);

        try {
          const response = await fetch(request);

          if (response.ok && response.type === "basic") {
            await cache.put(request, response.clone());
          }

          return response;
        } catch {
          const cachedPage = await cache.match(request);

          if (cachedPage) return cachedPage;

          // The practice page may have been cached with a different URL form.
          if (url.pathname === "/student/practice/offline") {
            const keys = await cache.keys();
            const match = keys.find((key) => {
              const cachedUrl = new URL(key.url);
              return (
                cachedUrl.origin === self.location.origin &&
                cachedUrl.pathname === "/student/practice/offline"
              );
            });

            if (match) return cache.match(match);
          }

          return new Response(
            "This page is not available offline yet. Connect to the internet and open Learnyfi Offline Practice once before going offline.",
            {
              status: 503,
              headers: {
                "Content-Type": "text/plain; charset=utf-8",
              },
            }
          );
        }
      })()
    );

    return;
  }

  // Cache successful same-origin static assets as they are requested.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(request);

        if (cached) return cached;

        try {
          const response = await fetch(request);

          if (response.ok) {
            await cache.put(request, response.clone());
          }

          return response;
        } catch {
          return new Response("", { status: 504 });
        }
      })()
    );
  }
});
