// Service Worker dla Marketplace PWA
// Wersja cache - zmień przy aktualizacjach
const CACHE_NAME = 'marketplace-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Pliki do cache'owania (najważniejsze zasoby)
const urlsToCache = [
  '/',
  '/static/js/main.js',
  '/static/css/main.css',
  '/manifest.json',
  OFFLINE_URL
];

// Instalacja Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Aktywuj nowy SW natychmiast
        return self.skipWaiting();
      })
  );
});

// Aktywacja Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Usuń stare cache
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Przejmij kontrolę nad wszystkimi klientami
      return self.clients.claim();
    })
  );
});

// Strategia cache - Network First z fallback do cache
self.addEventListener('fetch', (event) => {
  // Tylko dla GET requests
  if (event.request.method !== 'GET') return;
  
  // Pomiń requests do API (zawsze próbuj network)
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Jeśli response OK, zapisz w cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Jeśli network fail, spróbuj cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // Jeśli to navigation request i nie ma w cache, pokaż offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // Dla innych zasobów zwróć podstawową odpowiedź
            return new Response('Offline - zasób niedostępny', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Obsługa wiadomości z głównej aplikacji
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification click handler (dla przyszłych push notifications)
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received.');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
