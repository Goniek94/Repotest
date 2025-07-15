# Panel Administratora - Instrukcja Uruchomienia

## 🚀 Szybki Start

### 1. Ustaw Token Admin
Otwórz konsolę przeglądarki (F12) i wykonaj:

```javascript
localStorage.setItem('admin_token', 'temp-admin-token-for-testing');
window.location.reload();
```

Lub uruchom plik `set-admin-token.js` w konsoli.

### 2. Przejdź do Panelu Admin
Otwórz w przeglądarce: `http://localhost:3000/admin`

## 🔧 Naprawione Problemy

### ✅ Importy
- Poprawiono wszystkie ścieżki importów w komponentach admin
- Dodano brakującą funkcję `validateForm` do `adminHelpers.js`

### ✅ Endpointy API
- Zmieniono z `/api/admin/` na `/api/admin-panel/`
- Naprawiono `useAdminApi.js` i `useAdminAuth.js`

### ✅ Autentykacja
- Dodano tymczasową autentykację bez weryfikacji backendu
- Panel ładuje się z mock userem

## 📁 Struktura Panelu

```
/admin
├── Dashboard     - Główny panel z statystykami
├── Users         - Zarządzanie użytkownikami  
├── Listings      - Zarządzanie ogłoszeniami
├── Promotions    - Promocje i zniżki
├── Reports       - Raporty i zgłoszenia
├── Statistics    - Statystyki i analityka
└── Settings      - Ustawienia systemu
```

## 🔌 Dostępne Endpointy Backend

### Admin Panel API (`/api/admin-panel/`)
- `GET /health` - Status systemu
- `GET /users` - Lista użytkowników
- `GET /users/:id` - Szczegóły użytkownika
- `PUT /users/:id` - Aktualizacja użytkownika
- `POST /users/:id/block` - Blokowanie użytkownika
- `DELETE /users/:id` - Usuwanie użytkownika

### Legacy Admin API (`/api/admin/`)
- Podstawowe endpointy (przekierowanie do nowego systemu)

## 🛠️ Rozwój

### Dodawanie Nowych Funkcji
1. Dodaj kontroler w `admin/controllers/`
2. Dodaj routing w `admin/routes/`
3. Dodaj komponent frontend w `src/components/admin/sections/`

### Testowanie API
Użyj pliku `admin/test-admin-api.js` do testowania endpointów.

## 📝 Notatki

- Panel używa tymczasowej autentykacji dla celów rozwoju
- W produkcji należy zaimplementować pełną autentykację JWT
- Wszystkie komponenty są gotowe do integracji z prawdziwym API

## 🐛 Rozwiązywanie Problemów

### Panel nie ładuje się
1. Sprawdź czy token jest ustawiony: `localStorage.getItem('admin_token')`
2. Sprawdź konsolę przeglądarki pod kątem błędów
3. Upewnij się, że backend działa na porcie 5000

### Błędy importów
- Wszystkie importy zostały naprawione
- Jeśli pojawią się nowe błędy, sprawdź ścieżki w `src/components/admin/`

### Błędy API
- Sprawdź czy backend ma uruchomione endpointy `/api/admin-panel/`
- Sprawdź logi serwera pod kątem błędów

## 📞 Wsparcie

W przypadku problemów sprawdź:
1. Logi przeglądarki (F12 → Console)
2. Logi serwera backend
3. Status endpointów: `http://localhost:5000/api/admin-panel/health`
