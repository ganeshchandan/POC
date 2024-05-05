const cacheName = "pwa-test";
const appShellFiles = [
  "/index.html",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
];

/* Start the service worker and cache all of the app's content */
this.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(appShellFiles);
    })
  );
});

this.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
