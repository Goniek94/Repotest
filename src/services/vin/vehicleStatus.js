// Vehicle Status Service
// Provides vehicle status information based on VIN analysis

import { getCountryOfOrigin } from './manufacturerMapping';
import { decodeProductionYear } from './vinDecoder';

/**
 * Pobiera wszystkie dane statusu pojazdu
 * @param {string} vin - Numer VIN
 * @param {string} wmi - Kod WMI (3 pierwsze znaki VIN)
 * @returns {object} - Obiekt z danymi statusu pojazdu
 */
export const getVehicleStatus = (vin, wmi) => {
  return {
    imported: getImportedStatus(vin, wmi),
    registeredInPL: getRegisteredInPLStatus(vin, wmi),
    firstOwner: getFirstOwnerStatus(vin),
    disabledAdapted: false, // Zawsze false z CEPiK
    condition: getConditionFromVin(vin),
    accidentStatus: getAccidentStatus(vin),
    damageStatus: getDamageStatus(vin)
  };
};

/**
 * Określenie czy pojazd jest importowany na podstawie VIN i WMI
 * @param {string} vin - Numer VIN
 * @param {string} wmi - Kod WMI (3 pierwsze znaki VIN)
 * @returns {string} - Status importu: 'Tak' lub 'Nie'
 */
export const getImportedStatus = (vin, wmi) => {
  const countryOfOrigin = getCountryOfOrigin(wmi);
  
  // Jeśli pojazd pochodzi z Polski, to nie jest importowany
  if (countryOfOrigin === 'Polska') {
    return 'Nie';
  }
  
  // Dla innych krajów sprawdzamy na podstawie fragmentu VIN
  const importCode = vin.charAt(8);
  const charCode = importCode.charCodeAt(0);
  
  // 70% szans na import dla pojazdów z zagranicy
  if (charCode % 10 < 7) {
    return 'Tak';
  } else {
    return 'Nie';
  }
};

/**
 * Określenie czy pojazd jest zarejestrowany w Polsce na podstawie VIN i WMI
 * @param {string} vin - Numer VIN
 * @param {string} wmi - Kod WMI (3 pierwsze znaki VIN)
 * @returns {string} - Status rejestracji: 'Tak' lub 'Nie'
 */
export const getRegisteredInPLStatus = (vin, wmi) => {
  // Jeśli pojazd ma polski numer rejestracyjny, to jest zarejestrowany w PL
  const registrationNumber = generateRegistrationNumber(vin);
  
  // Polskie kody miast
  const polishCities = ['WA', 'PO', 'KR', 'WR', 'GD', 'BY', 'BI', 'KA', 'LU', 'ZS', 'PZ', 'OL', 'RZ', 'BL', 'GO'];
  const cityCode = registrationNumber.substring(0, 2);
  
  if (polishCities.includes(cityCode)) {
    return 'Tak';
  }
  
  // Dodatkowa logika na podstawie fragmentu VIN
  const regCode = vin.charAt(11);
  const charCode = regCode.charCodeAt(0);
  
  // 85% szans na rejestrację w Polsce
  if (charCode % 10 < 8) {
    return 'Tak';
  } else {
    return 'Nie';
  }
};

/**
 * Określenie czy pojazd ma pierwszego właściciela na podstawie VIN
 * @param {string} vin - Numer VIN
 * @returns {string} - Status właściciela: 'Tak' lub 'Nie'
 */
export const getFirstOwnerStatus = (vin) => {
  // Sprawdzamy wiek pojazdu
  const productionYear = parseInt(decodeProductionYear(vin.charAt(9)));
  const currentYear = new Date().getFullYear();
  const age = currentYear - productionYear;
  
  // Nowe pojazdy (0-2 lata) mają większą szansę na pierwszego właściciela
  if (age <= 2) {
    const ownerCode = vin.charAt(15);
    const charCode = ownerCode.charCodeAt(0);
    // 80% szans dla nowych pojazdów
    return charCode % 10 < 8 ? 'Tak' : 'Nie';
  }
  
  // Starsze pojazdy (3-5 lat) mają średnią szansę
  if (age <= 5) {
    const ownerCode = vin.charAt(15);
    const charCode = ownerCode.charCodeAt(0);
    // 50% szans dla średnio starych pojazdów
    return charCode % 10 < 5 ? 'Tak' : 'Nie';
  }
  
  // Bardzo stare pojazdy (6+ lat) mają małą szansę
  const ownerCode = vin.charAt(15);
  const charCode = ownerCode.charCodeAt(0);
  // 20% szans dla starych pojazdów
  return charCode % 10 < 2 ? 'Tak' : 'Nie';
};

/**
 * Określenie stanu pojazdu na podstawie VIN
 * @param {string} vin - Numer VIN
 * @returns {string} - Stan pojazdu
 */
export const getConditionFromVin = (vin) => {
  // Sprawdzamy wiek pojazdu
  const productionYear = parseInt(decodeProductionYear(vin.charAt(9)));
  const currentYear = new Date().getFullYear();
  const age = currentYear - productionYear;
  
  // Pojazdy do 1 roku to nowe
  if (age <= 1) {
    return 'Nowy';
  }
  
  // Używamy ASCII sum znaków VIN do określenia stanu dla starszych pojazdów
  let sum = 0;
  for (let i = 0; i < vin.length; i++) {
    sum += vin.charCodeAt(i);
  }
  
  // Pojazdy 2-3 lata - głównie używane, ale mogą być demonstracyjne
  if (age <= 3) {
    if (sum % 5 === 0) {
      return 'Demonstracyjny';
    } else {
      return 'Używany';
    }
  }
  
  // Starsze pojazdy - tylko używane
  return 'Używany';
};

/**
 * Określenie stanu powypadkowego na podstawie VIN
 * @param {string} vin - Numer VIN
 * @returns {string} - Stan powypadkowy
 */
export const getAccidentStatus = (vin) => {
  // Używamy ostatniego znaku VIN
  const lastChar = vin.charAt(16);
  const charCode = lastChar.charCodeAt(0);
  
  // Sprawdzamy wiek pojazdu - nowe pojazdy rzadziej mają wypadki
  const productionYear = parseInt(decodeProductionYear(vin.charAt(9)));
  const currentYear = new Date().getFullYear();
  const age = currentYear - productionYear;
  
  if (age <= 2) {
    // Nowe pojazdy - 5% szans na wypadek
    return charCode % 20 === 0 ? 'Po wypadku' : 'Bezwypadkowy';
  } else if (age <= 5) {
    // Średnio stare pojazdy - 15% szans na wypadek
    return charCode % 7 === 0 ? 'Po wypadku' : 'Bezwypadkowy';
  } else {
    // Stare pojazdy - 25% szans na wypadek
    return charCode % 4 === 0 ? 'Po wypadku' : 'Bezwypadkowy';
  }
};

/**
 * Określenie statusu uszkodzeń na podstawie VIN
 * @param {string} vin - Numer VIN
 * @returns {string} - Status uszkodzeń
 */
export const getDamageStatus = (vin) => {
  // Sprawdzamy status wypadku - jeśli po wypadku, może mieć uszkodzenia
  const accidentStatus = getAccidentStatus(vin);
  
  if (accidentStatus === 'Po wypadku') {
    const damageCode = vin.charAt(14);
    const charCode = damageCode.charCodeAt(0);
    
    // Różne typy uszkodzeń dla pojazdów po wypadku
    const damageTypes = [
      'Uszkodzenia lakieru',
      'Uszkodzenia blacharskie',
      'Wymieniane części',
      'Naprawiane uszkodzenia',
      'Brak uszkodzeń' // Niektóre pojazdy po wypadku mogą być już naprawione
    ];
    
    const damageIndex = charCode % damageTypes.length;
    return damageTypes[damageIndex];
  }
  
  // Dla pojazdów bezwypadkowych sprawdzamy inne uszkodzenia
  const damageCode = vin.charAt(13);
  const charCode = damageCode.charCodeAt(0);
  
  // 90% szans na brak uszkodzeń dla bezwypadkowych
  if (charCode % 10 < 9) {
    return 'Brak uszkodzeń';
  } else {
    // 10% szans na drobne uszkodzenia
    const minorDamages = [
      'Drobne rysy',
      'Uszkodzenia lakieru',
      'Wgniecenia'
    ];
    const damageIndex = charCode % minorDamages.length;
    return minorDamages[damageIndex];
  }
};

/**
 * Obliczenie przebiegu na podstawie VIN i roku produkcji
 * @param {string} vin - Numer VIN
 * @param {string} year - Rok produkcji
 * @returns {number} - Przebieg w kilometrach
 */
export const calculateMileage = (vin, year) => {
  // Tworzymy "hash" z części VIN
  let hash = 0;
  for (let i = 10; i < 15; i++) {
    hash += vin.charCodeAt(i);
  }
  
  // Obliczamy wiek pojazdu w latach
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(year);
  
  // Średni roczny przebieg pomiędzy 10,000 a 20,000 km
  const avgYearlyMileage = 10000 + (hash % 10000);
  
  // Obliczamy przebieg i dodajemy losowy składnik
  let mileage = age * avgYearlyMileage;
  
  // Pojazdy o wieku poniżej 1 roku mogą mieć bardzo niski przebieg
  if (age < 1) {
    mileage = hash % 10000;
  }
  
  // Starsze pojazdy mogą mieć lekko zmniejszony przebieg (np. mniej używane)
  if (age > 10) {
    mileage = mileage * 0.8;
  }
  
  return Math.round(mileage);
};

/**
 * Określenie liczby miejsc na podstawie marki i modelu
 * @param {string} manufacturer - Marka pojazdu
 * @param {string} model - Model pojazdu
 * @returns {number} - Liczba miejsc
 */
export const getSeatsCount = (manufacturer, model) => {
  // Mapowanie typowych liczb miejsc dla różnych marek i typów pojazdów
  const seatsMap = {
    'Tesla': 5, // Większość Tesli ma 5 miejsc
    'Ferrari': 2, // Sportowe, zwykle 2 miejsca
    'Porsche': 4, // Często 2+2 lub 4 miejsca
    'Smart': 2, // Małe miejskie, 2 miejsca
    'Fiat': 5, // Standardowe miejskie, 5 miejsc
    'BMW': 5, // Większość BMW ma 5 miejsc
    'Mercedes-Benz': 5,
    'Audi': 5,
    'Volkswagen': 5,
    'Toyota': 5,
    'Honda': 5,
    'Nissan': 5,
    'Ford': 5,
    'Opel': 5,
    'Renault': 5,
    'Peugeot': 5,
    'Citroën': 5,
    'Škoda': 5,
    'Kia': 5,
    'Hyundai': 5
  };
  
  // Sprawdzamy czy mamy specyficzne mapowanie dla marki
  let seats = seatsMap[manufacturer] || 5;
  
  // Specjalne przypadki na podstawie modelu
  if (model && model.toLowerCase().includes('van')) {
    seats = 7; // Vany zwykle mają 7 miejsc
  } else if (model && (model.toLowerCase().includes('coupe') || model.toLowerCase().includes('cabrio'))) {
    seats = 4; // Coupe i cabrio często mają 4 miejsca
  } else if (model && model.toLowerCase().includes('roadster')) {
    seats = 2; // Roadstery mają 2 miejsca
  }
  
  return seats;
};

/**
 * Generowanie numeru rejestracyjnego na podstawie VIN
 * @param {string} vin - Numer VIN
 * @returns {string} - Numer rejestracyjny
 */
export const generateRegistrationNumber = (vin) => {
  // Deterministyczne generowanie numeru rejestracyjnego na podstawie VIN
  const cities = ['WA', 'PO', 'KR', 'WR', 'GD', 'BY', 'BI', 'KA', 'LU', 'ZS', 'PZ', 'OL', 'RZ', 'BL', 'GO'];
  
  // Wybór miasta na podstawie sumy kodów ASCII z początku VIN
  let citySum = 0;
  for (let i = 0; i < 3; i++) {
    citySum += vin.charCodeAt(i);
  }
  const cityIndex = citySum % cities.length;
  const city = cities[cityIndex];
  
  // Generowanie cyfr i liter na podstawie końcówki VIN
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let plate = '';
  
  // Używamy znaków z końca VIN
  for (let i = 12; i < 17; i++) {
    // Dla każdego znaku VIN, znajdujemy odpowiedni znak w tablicy chars
    const vinChar = vin.charAt(i);
    const charCode = vinChar.charCodeAt(0);
    const charIndex = charCode % chars.length;
    plate += chars.charAt(charIndex);
  }
  
  return city + plate;
};
