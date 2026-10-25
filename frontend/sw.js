/* VerityAI service worker: keeps the app shell available and never caches API calls. */
const CACHE = 'verity-v8';
const SHELL = ['/', '/scripts/common.js', '/scripts/layout.js', '/scripts/theme.js', '/assets/icon.svg', '/styles.css'];
const API_PATHS = ['/analyze', '/claims', '/feedback', '/health'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || API_PATHS.includes(u.pathname)) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { if (r.ok && !u.search) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request).then((m) => m || caches.match('/')))
  );
});
