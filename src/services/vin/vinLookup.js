// VIN Lookup Service
// Main service for VIN number lookup and data retrieval

import { decodeVin } from './vinDecoder';

/**
 * Symulacja pobierania danych z bazy CEPiK na podstawie numeru VIN
 * W rzeczywistej implementacji byłoby to połączenie z zewnętrznym API
 * 
 * @param {string} vin - 17-znakowy numer VIN do sprawdzenia
 * @returns {Promise} - Promise zwracający dane pojazdu lub null jeśli nie znaleziono
 */
export const lookupVin = async (vin) => {
  // Symulacja opóźnienia zapytania API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Walidacja VIN
  if (!vin || vin.length !== 17) {
    throw new Error('Nieprawidłowy format VIN');
  }
  
  // Dekodowanie numeru VIN do określenia producenta
  const decodedData = decodeVin(vin);
  
  if (!decodedData) {
    return null;
  }
  
  return decodedData;
};

/**
 * Walidacja numeru VIN
 * @param {string} vin - Numer VIN do walidacji
 * @returns {boolean} - True jeśli VIN jest poprawny
 */
export const validateVin = (vin) => {
  if (!vin || typeof vin !== 'string' || vin.length !== 17) {
    return false;
  }
  
  // Sprawdzenie czy zawiera tylko dozwolone znaki (bez I, O, Q)
  const allowedChars = /^[A-HJ-NPR-Z0-9]+$/;
  return allowedChars.test(vin);
};

/**
 * Formatowanie VIN dla wyświetlania
 * @param {string} vin - Numer VIN
 * @returns {string} - Sformatowany VIN
 */
export const formatVin = (vin) => {
  if (!vin || vin.length !== 17) return vin;
  return `${vin.substring(0, 3)}-${vin.substring(3, 9)}-${vin.substring(9, 17)}`;
};
