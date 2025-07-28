// Service Worker Registration dla Marketplace PWA
// Ten plik rejestruje Service Worker i obsługuje aktualizacje

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        // W localhost sprawdź czy SW istnieje
        checkValidServiceWorker(swUrl, config);
        
        navigator.serviceWorker.ready.then(() => {
          console.log(
            '[SW] Ta aplikacja jest serwowana przez Service Worker w trybie cache-first. ' +
            'Więcej informacji: https://cra.link/PWA'
          );
        });
      } else {
        // W produkcji zarejestruj SW
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('[SW] Service Worker zarejestrowany:', registration);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Nowa wersja dostępna
              console.log('[SW] Nowa wersja aplikacji dostępna!');
              
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
              
              // Pokaż notification o aktualizacji
              showUpdateNotification();
            } else {
              // Pierwsza instalacja
              console.log('[SW] Aplikacja gotowa do pracy offline!');
              
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
              
              // Pokaż notification o PWA
              showPWANotification();
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('[SW] Błąd rejestracji Service Worker:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('[SW] Brak połączenia z internetem. Aplikacja działa w trybie offline.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Funkcje pomocnicze dla notyfikacji
function showUpdateNotification() {
  // Sprawdź czy użytkownik chce zobaczyć notyfikacje o aktualizacjach
  const showNotifications = localStorage.getItem('marketplace-show-update-notifications') !== 'false';
  
  if (showNotifications && 'Notification' in window && Notification.permission === 'granted') {
    new Notification('Marketplace - Aktualizacja dostępna!', {
      body: 'Nowa wersja aplikacji jest gotowa. Odśwież stronę aby zaktualizować.',
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'marketplace-update',
      requireInteraction: true,
      actions: [
        {
          action: 'update',
          title: 'Aktualizuj teraz'
        },
        {
          action: 'later',
          title: 'Później'
        }
      ]
    });
  } else {
    // Fallback - pokaż toast notification
    console.log('[SW] Nowa wersja dostępna - odśwież stronę');
  }
}

function showPWANotification() {
  // Sprawdź czy to pierwsza wizyta
  const isFirstVisit = !localStorage.getItem('marketplace-pwa-installed');
  
  if (isFirstVisit) {
    localStorage.setItem('marketplace-pwa-installed', 'true');
    
    // Pokaż informację o możliwości instalacji
    setTimeout(() => {
      console.log('[PWA] Aplikacja gotowa do instalacji na urządzeniu!');
    }, 3000);
  }
}

// Obsługa install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] Install prompt dostępny');
  e.preventDefault();
  deferredPrompt = e;
  
  // Pokaż własny przycisk instalacji
  showInstallButton();
});

function showInstallButton() {
  // Ta funkcja może być wywołana z komponentu React
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
}

// Export funkcji instalacji dla komponentów React
export function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] Użytkownik zaakceptował instalację');
      } else {
        console.log('[PWA] Użytkownik odrzucił instalację');
      }
      deferredPrompt = null;
    });
  }
}

// Sprawdź czy aplikacja jest zainstalowana
export function isPWAInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}
