const CACHE_NAME = 'my-app-cache-v1';

// Get the base path from the service worker's location
const getBasePath = () => {
  const swPath = self.location.pathname;
  return swPath.substring(0, swPath.lastIndexOf('/'));
};

const basePath = getBasePath();

const urlsToCache = [
  `${basePath}/`,
  `${basePath}/index.html`,
  `${basePath}/manifest.json`,
  `${basePath}/favicon.png`
].map(url => url.replace(/\/\//g, '/'));

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'Push message tanpa data.';
  const options = {
    body: data,
    icon: `${basePath}/icons/icon-192x192.png`,
    badge: `${basePath}/icons/icon-192x192.png`,
  };
  event.waitUntil(
    self.registration.showNotification('Notifikasi dari Aplikasi!', options)
  );
});
