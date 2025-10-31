// This is a basic service worker file that enables the app to be installable (PWA).
// It doesn't perform any caching yet, but provides the foundation for offline capabilities.

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  // The service worker is installed.
});

self.addEventListener('fetch', (event) => {
  // This simple fetch handler passes the request through to the network.
  // It's the simplest possible fetch handler to make the app installable.
  event.respondWith(fetch(event.request));
});
