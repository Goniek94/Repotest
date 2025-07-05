# Deployment aplikacji Marketplace Frontend

Ten dokument opisuje proces przygotowania i wdrażania aplikacji Marketplace Frontend na środowisko produkcyjne.

## Przygotowanie do wdrożenia

Przed wdrożeniem aplikacji upewnij się, że:

1. Wszystkie błędy zostały naprawione i kod przechodzi testy
2. Plik `.env.production` zawiera prawidłowe zmienne środowiskowe dla produkcji
3. Wszystkie dane testowe i debugowe zostały usunięte

## Komendy budowania

W projekcie dostępne są następujące komendy:

```bash
# Standardowe budowanie
npm run build

# Budowanie produkcyjne z dodatkową optymalizacją i raportami
npm run build:prod

# Analiza wielkości bundla po zbudowaniu
npm run analyze
```

## Proces wdrażania na serwer produkcyjny

### 1. Budowanie produkcyjne

```bash
# Upewnij się, że używasz najnowszych zależności
npm ci

# Uruchom skrypt budujący wersję produkcyjną
npm run build:prod
```

### 2. Przygotowanie serwera

Upewnij się, że:

- Serwer produkcyjny ma zainstalowane wymagane narzędzia
- Konfiguracja NGINX lub innego serwera www jest poprawna
- Certyfikaty SSL są aktualne

### 3. Wgranie plików na serwer

```bash
# Przykładowe użycie rsync do wgrania plików
rsync -avz --delete build/ user@production-server:/path/to/web/root/
```

### 4. Konfiguracja serwera HTTP

Przykładowa konfiguracja NGINX dla aplikacji SPA:

```nginx
server {
    listen 80;
    server_name testauto.cba.pl;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name testauto.cba.pl;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Optymalizacja SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305';
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    root /path/to/web/root;
    index index.html;

    # Ustawienia cache dla statycznych zasobów
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Wszystkie ścieżki kierowane są do index.html (dla SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Kompresja
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
}
```

### 5. Testowanie po wdrożeniu

Po wdrożeniu sprawdź:

1. Czy aplikacja poprawnie się ładuje na wszystkich urządzeniach
2. Czy wszystkie funkcje działają poprawnie
3. Czy wydajność i czas ładowania są akceptowalne
4. Czy wszystkie API Endpoints działają prawidłowo

### 6. Monitorowanie

Skonfiguruj monitorowanie aplikacji:

- Wdrożenie Google Analytics lub innego narzędzia analitycznego
- Monitorowanie błędów w konsoli (np. Sentry)
- Monitorowanie wydajności i dostępności

## Rollback

W przypadku problemów z nową wersją, możesz wykonać rollback do poprzedniej stabilnej wersji:

```bash
# Przykład: przywrócenie poprzedniej wersji z kopii zapasowej
rsync -avz --delete backup/previous-version/ user@production-server:/path/to/web/root/
```

## Usprawnienia i optymalizacje

W przyszłych wersjach rozważ:

- Wdrożenie CDN dla zasobów statycznych
- Implementację Service Worker dla wsparcia offline
- Dynamiczne ładowanie komponentów za pomocą React.lazy()
- Optymalizację obrazów (formaty WebP/AVIF)
- Server-side rendering dla lepszego SEO
