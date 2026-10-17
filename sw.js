// Offline support. Everything is served from the cache first so the game opens
// instantly without a connection; a fresh copy is fetched in the background and
// used on the next launch. Google Fonts are cached too, so the type stays the same offline.
const CACHE = 'arruma-prateleira-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-180.png', './icon-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === location.origin;
  if (!sameOrigin && !FONT_HOSTS.includes(url.hostname)) return;

  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: sameOrigin })
      || (e.request.mode === 'navigate' ? await cache.match('./index.html') : undefined);
    const network = fetch(e.request)
      .then(res => {
        if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone());
        return res;
      })
      .catch(() => undefined);
    if (cached) {
      e.waitUntil(network);
      return cached;
    }
    return (await network) || Response.error();
  }));
});
