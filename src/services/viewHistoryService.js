/**
 * Serwis do zarządzania historią przeglądania ogłoszeń
 * Przechowuje tylko ID ogłoszeń w localStorage
 */

const STORAGE_KEY = 'viewHistory';
const MAX_HISTORY_LENGTH = 4; // Maksymalna liczba przechowywanych ID ogłoszeń

/**
 * Pobiera historię przeglądania z localStorage
 * @returns {Array} Lista ID ostatnio przeglądanych ogłoszeń
 */
const getViewHistory = () => {
  try {
    const historyJson = localStorage.getItem(STORAGE_KEY);
    if (!historyJson) return [];
    
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('Błąd podczas pobierania historii przeglądania:', error);
    return [];
  }
};

/**
 * Zapisuje historię przeglądania do localStorage
 * @param {Array} history Lista ID ogłoszeń do zapisania
 */
const saveViewHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Błąd podczas zapisywania historii przeglądania:', error);
  }
};

/**
 * Znajduje ID ogłoszenia niezależnie od jego formatu
 * @param {Object|String} listing Ogłoszenie lub bezpośrednio ID
 * @returns {String|null} ID ogłoszenia lub null jeśli nie znaleziono
 */
const getListingId = (listing) => {
  // Jeśli listing jest stringiem, to zakładamy, że to już ID
  if (typeof listing === 'string') return listing;
  
  // Jeśli listing jest liczbą, konwertujemy na string
  if (typeof listing === 'number') return String(listing);
  
  // Jeśli listing jest obiektem, szukamy ID w różnych formatach
  if (typeof listing === 'object' && listing !== null) {
    // Sprawdzamy różne możliwe nazwy pola ID
    const possibleIdFields = ['_id', 'id', 'adId', 'listingId'];
    
    for (const field of possibleIdFields) {
      if (listing[field]) {
        return String(listing[field]);
      }
    }
    
    // Sprawdzamy, czy mamy parametr URL 'id'
    if (typeof window !== 'undefined' && window.location.pathname.includes('/ogloszenia/')) {
      const pathParts = window.location.pathname.split('/');
      const possibleId = pathParts[pathParts.length - 1];
      if (possibleId && possibleId.length > 5) {
        debug('Znaleziono ID z URL:', possibleId);
        return possibleId;
      }
    }
  }
  
  console.warn('Nie udało się znaleźć ID dla ogłoszenia:', listing);
  return null;
};

/**
 * Dodaje ID ogłoszenia do historii przeglądania
 * Jeśli ID już istnieje w historii, jest przenoszone na początek listy
 * Jeśli lista jest pełna, najstarsze ID jest usuwane
 * 
 * @param {Object|String} listing Ogłoszenie lub bezpośrednio ID
 * @returns {Array} Zaktualizowana lista historii
 */
const addToViewHistory = (listing) => {
  const adId = getListingId(listing);
  
  if (!adId) {
    console.warn('Nie dodano ogłoszenia do historii - brak ID');
    return getViewHistory();
  }
  
  debug('Dodaję ogłoszenie do historii:', adId);
  
  const history = getViewHistory();
  
  // Usuń ogłoszenie, jeśli już istnieje w historii
  const filteredHistory = history.filter(id => id !== adId);
  
  // Dodaj nowe ID na początek listy
  const updatedHistory = [adId, ...filteredHistory];
  
  // Ogranicz długość listy do MAX_HISTORY_LENGTH
  const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_LENGTH);
  
  // Zapisz zaktualizowaną historię
  saveViewHistory(trimmedHistory);
  
  debug('Aktualna historia przeglądania:', trimmedHistory);
  
  return trimmedHistory;
};

/**
 * Czyści historię przeglądania
 */
const clearViewHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Dodajemy ogłoszenie z bieżącego URL, jeśli jesteśmy na stronie szczegółów
if (typeof window !== 'undefined' && window.location.pathname.includes('/ogloszenia/')) {
  const pathParts = window.location.pathname.split('/');
  const possibleId = pathParts[pathParts.length - 1];
  if (possibleId && possibleId.length > 5) {
    debug('Automatycznie dodaję oglądane ogłoszenie do historii:', possibleId);
    // Dodajemy z opóźnieniem, aby upewnić się, że strona jest w pełni załadowana
    setTimeout(() => addToViewHistory(possibleId), 1000);
  }
}

// Eksportujemy funkcje serwisu
const ViewHistoryService = {
  getViewHistory,
  addToViewHistory,
  clearViewHistory
};

export default ViewHistoryService;