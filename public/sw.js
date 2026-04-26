const CACHE_NAME = "sachcare-shell-v1";
const MAP_DATA_CACHE = "sachcare-map-data-v1";
const APP_SHELL = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME && k !== MAP_DATA_CACHE) return caches.delete(k);
          return Promise.resolve();
        }),
      ),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === "/api/map-data") {
    event.respondWith(
      caches.open(MAP_DATA_CACHE).then(async (cache) => {
        try {
          const network = await fetch(event.request);
          cache.put(event.request, network.clone());
          return network;
        } catch {
          return (await cache.match(event.request)) || Response.error();
        }
      }),
    );
    return;
  }

  if (event.request.method === "GET") {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
  }
});
