// src/services/auth-header.js

/**
 * Funkcja zwracająca nagłówek autoryzacji z tokenem JWT
 * @returns {Object} Obiekt z nagłówkiem Authorization lub pusty obiekt
 */
export default function authHeader() {
  // Pobierz token wyłącznie z ciasteczka
  const token = getCookie('token');
  
  if (token) {
    // Dla Spring Boot backendu
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

/**
 * Pomocnicza funkcja do pobierania wartości cookie
 * @param {string} name Nazwa cookie
 * @returns {string|null} Wartość cookie lub null
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
