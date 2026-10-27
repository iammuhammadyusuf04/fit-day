const CACHE = 'fitday-v5';
const FILES = [
  './', 'index.html', 'style.css', 'app.js', 'gym.js', 'manifest.webmanifest',
  'scenes.js', 'scenes-cardio.js', 'scenes-lower.js', 'scenes-upper.js', 'scenes-core.js', 'scenes-stretch.js',
  'icons/icon-192.png', 'icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Avval tarmoqdan (yangilanish darhol ko‘rinsin), internet bo‘lmasa keshdan.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./')))
  );
});
