const CACHE_NAME = 'rcsq-m10-public-v9-qr-invite';
const FILES = ['./','./index.html','./styles.css','./app.js','./cloud-sync.js','./cloud-config.js','./qr-code.js','./manifest.webmanifest','./icons/rcsq-icon-192.png','./icons/rcsq-icon-512.png','./icons/rcsq-apple-touch-icon.png','./assets/couverture-rcsq.webp','./assets/logo-officiel-rcsq.jpg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('rcsq-m10-public-') && key !== CACHE_NAME).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); }
      return response;
    }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html'))));
  } else {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); }
      return response;
    })));
  }
});
