// GenerationsData.js
// Mappings of car makes and models to their generations

// generationsData will be loaded dynamically from backend API
// Removed hardcoded data - now fetched from backend
export const generationsData = {};

/**
 * Funkcja do pobierania generacji dla danej marki i modelu
 * @param {string} make - Marka pojazdu
 * @param {string} model - Model pojazdu
 * @returns {Array} - Tablica generacji dla danego modelu lub pusta tablica
 */
export const getGenerationsForModel = (make, model) => {
  if (!make || !model) return [];
  
  // Sprawdź, czy mamy dane dla tej marki i modelu
  if (generationsData[make] && generationsData[make][model]) {
    return generationsData[make][model];
  }
  
  // Jeśli nie mamy danych dla tego modelu, zwróć pustą tablicę
  return [];
};
