const CACHE_NAME = 'matrix-billing-v2';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Never cache Firebase/Firestore/Storage traffic — always go to network for live data.
  if (e.request.url.includes('googleapis.com')) return;

  // Network-first: always get the latest file when online.
  // Falls back to the cached copy only if there's no network (offline).
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
