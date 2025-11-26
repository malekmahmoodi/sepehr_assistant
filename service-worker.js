const CACHE_NAME = "device-search-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/result.html",
  "/app.js",
  "/manifest.json",
  "/libs/xlsx.full.min.js",
  "/libs/html5-qrcode.min.js",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});