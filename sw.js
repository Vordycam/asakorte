/* Service worker: the app shell and the court data work offline.
   - Same-origin files: stale-while-revalidate (instant load, refresh in background).
   - Leaflet from unpkg and Google Fonts: cache-first once fetched.
   - Map tiles: network only. The OpenStreetMap tile policy forbids bulk or
     pre-emptive caching; the browser's own HTTP cache handles repeats.
   Bump CACHE whenever js/, styles.css or index.html changes. */
var CACHE = 'asakorte-v2';
var ASSETS = [
  './vendor/leaflet/leaflet.js',
  './vendor/leaflet/leaflet.css',
  './vendor/leaflet/images/layers.png',
  './vendor/leaflet/images/marker-icon.png',
  './vendor/leaflet/images/marker-shadow.png',
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './js/core/geo.js',
  './js/core/hours.js',
  './js/core/links.js',
  './js/core/filters.js',
  './js/data/cities.js',
  './js/data/courts.js',
  './js/storage.js',
  './js/map.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isTile(url) { return /tile\.openstreetmap\.org|basemaps\.cartocdn\.com|tiles\./.test(url.host); }
function isVendor(url) { return /unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url.host); }

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url;
  try { url = new URL(e.request.url); } catch (err) { return; }
  if (isTile(url)) return; /* let the browser handle tiles */

  if (isVendor(url)) {
    e.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(e.request).then(function (cached) {
          if (cached) return cached;
          return fetch(e.request).then(function (resp) {
            if (resp && (resp.ok || resp.type === 'opaque')) cache.put(e.request, resp.clone());
            return resp;
          });
        });
      })
    );
    return;
  }

  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(e.request, { ignoreSearch: true }).then(function (cached) {
        var network = fetch(e.request).then(function (resp) {
          if (resp && resp.ok) cache.put(e.request, resp.clone());
          return resp;
        }).catch(function () { return cached; });
        return cached || network;
      });
    })
  );
});
