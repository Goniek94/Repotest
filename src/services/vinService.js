// vinService.js
// Service for VIN number lookup and decoding
import { carData } from '../components/search/SearchFormConstants';

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
 * Dokładniejsze dekodowanie numeru VIN
 * Dekoduje informacje z numeru VIN zgodnie ze standardem ISO 3779
 * 
 * @param {string} vin - 17-znakowy numer VIN
 * @returns {object} - Zdekodowane dane pojazdu
 */
const decodeVin = (vin) => {
  // WMI (World Manufacturer Identifier) - pierwsze 3 znaki
  const wmi = vin.substring(0, 3);
  
  // VDS (Vehicle Descriptor Section) - znaki 4-9
  const vds = vin.substring(3, 9);
  
  // VIS (Vehicle Identifier Section) - znaki 10-17
  const vis = vin.substring(9, 17);
  
  // Określenie producenta na podstawie WMI
  const manufacturer = getManufacturerFromWMI(wmi);
  
  if (!manufacturer) {
    return null;
  }
  
  // Sprawdzenie czy marka istnieje w naszej bazie danych
  if (!carData[manufacturer]) {
    return null;
  }
  
  // Wybór modelu - deterministyczny na podstawie fragmentu VIN
  const models = carData[manufacturer];
  const modelIndex = getModelIndexFromVin(vin, models.length);
  const model = models[modelIndex];
  
  // Dekodowanie roku produkcji
  const productionYear = decodeProductionYear(vin.charAt(9));
  
  // Pozostałe dane pojazdu bazujące na fragmentach VIN
  // Używamy fragmentów VIN by generować deterministyczne dane
  const engineCode = vds.substring(0, 2);
  const engineData = getEngineData(manufacturer, engineCode);
  
  const registrationNumber = generateRegistrationNumber(vin);
  
  return {
    brand: manufacturer,
    model: model,
    generation: '',
    version: engineData.version,
    productionYear: productionYear,
    fuelType: engineData.fuelType,
    engineSize: engineData.engineSize,
    power: engineData.power,
    transmission: getTransmissionType(vin.charAt(4)),
    drive: getDriveType(vin.charAt(5), manufacturer),
    mileage: calculateMileage(vin, productionYear),
    color: getColorFromVin(vin.charAt(6)),
    condition: getConditionFromVin(vin),
    accidentStatus: getAccidentStatus(vin),
    damageStatus: 'Brak uszkodzeń',
    countryOfOrigin: getCountryOfOrigin(wmi),
    registrationNumber: registrationNumber
  };
};

/**
 * Mapowanie kodów WMI (World Manufacturer Identifier) na marki
 * @param {string} wmi - 3-znakowy kod WMI
 * @returns {string} - Nazwa marki lub null jeśli nie znaleziono
 */
const getManufacturerFromWMI = (wmi) => {
  // Pełniejsza mapa kodów WMI dla europejskich i światowych producentów
  const manufacturerMap = {
    // Europa
    'WVW': 'Volkswagen', 'WV1': 'Volkswagen', 'WV2': 'Volkswagen', '1VW': 'Volkswagen', '3VW': 'Volkswagen',
    'WAU': 'Audi', 'TRU': 'Audi', '93U': 'Audi', 'WUA': 'Audi',
    'WBA': 'BMW', 'WBS': 'BMW', 'WBX': 'BMW', 'WBY': 'BMW', '4US': 'BMW', 'X4X': 'BMW',
    'WDD': 'Mercedes-Benz', 'WMX': 'Mercedes-Benz', 'WDF': 'Mercedes-Benz', 'WDB': 'Mercedes-Benz',
    'WEB': 'Mercedes-Benz AMG', 'WME': 'Smart',
    'TMB': 'Škoda', 'TMP': 'Škoda',
    'VSS': 'Seat', 'VSH': 'Seat',
    'VF1': 'Renault', 'VF2': 'Renault',
    'VF3': 'Peugeot', 'VF7': 'Citroën', 'VF5': 'Opel',
    'W0L': 'Opel', 'WOL': 'Opel', 'KL1': 'Opel',
    'VF6': 'Dacia', 'UU1': 'Dacia',
    'ZFA': 'Fiat', 'ZFC': 'Fiat', 'ZFF': 'Ferrari',
    'ZAR': 'Alfa Romeo',
    'SCA': 'Rolls-Royce', 'SAL': 'Land Rover', 'SAR': 'Rover',
    'YS3': 'Saab', 'YV1': 'Volvo', 'YV4': 'Volvo',
    'WP0': 'Porsche', 'WP1': 'Porsche',
    'VX1': 'SsangYong',
    'TM9': 'Škoda',
    
    // Azja
    'JHM': 'Honda', 'JHG': 'Honda',
    'JT1': 'Toyota', 'JT2': 'Toyota', 'JT3': 'Toyota', 'JT4': 'Toyota', 'JTD': 'Toyota', 'MR0': 'Toyota',
    'SJN': 'Nissan', 'VSK': 'Nissan', 'JN1': 'Nissan', 'JN8': 'Nissan',
    'KNA': 'Kia', 'KND': 'Kia', '3KP': 'Kia',
    'KMH': 'Hyundai', 'KMY': 'Hyundai', 'KM8': 'Hyundai',
    'MAL': 'Mitsubishi', 'JA3': 'Mitsubishi', 'JA4': 'Mitsubishi',
    'JF1': 'Subaru', 'JF2': 'Subaru',
    'JN3': 'Infiniti',
    'JSA': 'Suzuki',
    
    // Nowe marki i marki elektryczne
    'LBV': 'Tesla', '5YJ': 'Tesla',
    'L2C': 'BYD',
    'LSV': 'NIO',
    '7JR': 'Rimac',
    'XP7': 'Rivian',
    'LRW': 'Lucid',
    'LFV': 'Dongfeng',
    'LGJ': 'Great Wall',
    'LNB': 'Xpeng',
    'L6T': 'Geely',
    'LLV': 'Lynk & Co',
    'LFP': 'Fisker',
    
    // USA
    '1G1': 'Chevrolet', '1GC': 'Chevrolet', '1G6': 'Cadillac',
    '1FA': 'Ford', '1FB': 'Ford', '1FC': 'Ford', '1FD': 'Ford', '1FM': 'Ford', '1FT': 'Ford',
    '1C3': 'Chrysler', '1C4': 'Chrysler', '1C6': 'RAM', '1D7': 'Dodge',
    '1J4': 'Jeep', '1J8': 'Jeep',
    '4T1': 'Toyota', '4T3': 'Toyota',
    '1N4': 'Nissan', '1N6': 'Nissan',
    '1HD': 'Harley-Davidson',
    '1FT': 'Ford'
  };
  
  return manufacturerMap[wmi] || null;
};

/**
 * Deterministyczny wybór modelu na podstawie VIN
 * @param {string} vin - Numer VIN
 * @param {number} modelsCount - Liczba dostępnych modeli
 * @returns {number} - Indeks modelu
 */
const getModelIndexFromVin = (vin, modelsCount) => {
  // Używamy części VIN (znaki 10-13) do generowania deterministycznego indeksu
  const modelCode = vin.substring(9, 13);
  let hash = 0;
  
  for (let i = 0; i < modelCode.length; i++) {
    hash = ((hash << 5) - hash) + modelCode.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Konwersja hasha na indeks w zakresie dostępnych modeli
  const positiveHash = Math.abs(hash);
  return positiveHash % modelsCount;
};

/**
 * Dekodowanie roku produkcji z numeru VIN
 * @param {string} yearChar - Znak z VIN reprezentujący rok
 * @returns {string} - Rok produkcji
 */
const decodeProductionYear = (yearChar) => {
  const yearMap = {
    'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013', 'E': '2014',
    'F': '2015', 'G': '2016', 'H': '2017', 'J': '2018', 'K': '2019',
    'L': '2020', 'M': '2021', 'N': '2022', 'P': '2023', 'R': '2024',
    '1': '2001', '2': '2002', '3': '2003', '4': '2004', '5': '2005',
    '6': '2006', '7': '2007', '8': '2008', '9': '2009', '0': '2000'
  };
  
  return yearMap[yearChar] || '2020';
};

/**
 * Generowanie danych silnika na podstawie kodu producenta i fragmentu VIN
 * @param {string} manufacturer - Marka pojazdu
 * @param {string} engineCode - Fragment VIN określający silnik
 * @returns {object} - Dane silnika
 */
const getEngineData = (manufacturer, engineCode) => {
  // Przykładowe mapowanie fragmentów VIN na dane silnika dla różnych marek
  const engineDataMap = {
    'Volkswagen': {
      'AA': { version: '1.2 TSI', fuelType: 'Benzyna', engineSize: 1200, power: 105 },
      'AB': { version: '1.4 TSI', fuelType: 'Benzyna', engineSize: 1400, power: 125 },
      'AC': { version: '1.6 TDI', fuelType: 'Diesel', engineSize: 1600, power: 115 },
      'AD': { version: '2.0 TDI', fuelType: 'Diesel', engineSize: 2000, power: 150 },
      'AE': { version: '2.0 TSI', fuelType: 'Benzyna', engineSize: 2000, power: 190 }
    },
    'Audi': {
      'AA': { version: '1.4 TFSI', fuelType: 'Benzyna', engineSize: 1400, power: 150 },
      'AB': { version: '2.0 TFSI', fuelType: 'Benzyna', engineSize: 2000, power: 190 },
      'AC': { version: '2.0 TDI', fuelType: 'Diesel', engineSize: 2000, power: 150 },
      'AD': { version: '3.0 TFSI', fuelType: 'Benzyna', engineSize: 3000, power: 340 },
      'AE': { version: '3.0 TDI', fuelType: 'Diesel', engineSize: 3000, power: 286 }
    },
    'BMW': {
      'AA': { version: '118i', fuelType: 'Benzyna', engineSize: 1500, power: 136 },
      'AB': { version: '120d', fuelType: 'Diesel', engineSize: 2000, power: 190 },
      'AC': { version: '320i', fuelType: 'Benzyna', engineSize: 2000, power: 184 },
      'AD': { version: '320d', fuelType: 'Diesel', engineSize: 2000, power: 190 },
      'AE': { version: '330i', fuelType: 'Benzyna', engineSize: 2000, power: 258 }
    },
    'Mercedes-Benz': {
      'AA': { version: 'A180', fuelType: 'Benzyna', engineSize: 1600, power: 136 },
      'AB': { version: 'C200', fuelType: 'Benzyna', engineSize: 1500, power: 184 },
      'AC': { version: 'C220d', fuelType: 'Diesel', engineSize: 2000, power: 194 },
      'AD': { version: 'E200', fuelType: 'Benzyna', engineSize: 2000, power: 197 },
      'AE': { version: 'E220d', fuelType: 'Diesel', engineSize: 2000, power: 194 }
    },
    'Toyota': {
      'AA': { version: '1.2 Turbo', fuelType: 'Benzyna', engineSize: 1200, power: 116 },
      'AB': { version: '1.8 Hybrid', fuelType: 'Hybrydowy', engineSize: 1800, power: 122 },
      'AC': { version: '2.0 Hybrid', fuelType: 'Hybrydowy', engineSize: 2000, power: 180 },
      'AD': { version: '2.5 Hybrid', fuelType: 'Hybrydowy', engineSize: 2500, power: 218 },
      'AE': { version: '2.0 D-4D', fuelType: 'Diesel', engineSize: 2000, power: 150 }
    },
    'Tesla': {
      'AA': { version: 'Standard Range', fuelType: 'Elektryczny', engineSize: 0, power: 283 },
      'AB': { version: 'Long Range', fuelType: 'Elektryczny', engineSize: 0, power: 351 },
      'AC': { version: 'Performance', fuelType: 'Elektryczny', engineSize: 0, power: 480 },
      'AD': { version: 'Plaid', fuelType: 'Elektryczny', engineSize: 0, power: 1020 },
      'AE': { version: 'Dual Motor', fuelType: 'Elektryczny', engineSize: 0, power: 385 }
    }
  };
  
  // Domyślne dane dla nieznanych kodów silnika
  const defaultEngineData = {
    version: '2.0',
    fuelType: 'Benzyna',
    engineSize: 2000,
    power: 150
  };
  
  // Sprawdzamy czy mamy dane dla tej marki
  const brandEngines = engineDataMap[manufacturer];
  if (!brandEngines) {
    return defaultEngineData;
  }
  
  // Sprawdzamy czy mamy dane dla tego kodu silnika
  return brandEngines[engineCode] || defaultEngineData;
};

/**
 * Określenie typu skrzyni biegów na podstawie znaku z VIN
 * @param {string} transmissionChar - Znak z VIN
 * @returns {string} - Typ skrzyni biegów
 */
const getTransmissionType = (transmissionChar) => {
  const transmissionMap = {
    'A': 'Automatyczna', 'B': 'Automatyczna', 'C': 'Automatyczna', 
    'D': 'Automatyczna DSG', 'E': 'Automatyczna DSG',
    'M': 'Manualna', 'N': 'Manualna', 'P': 'Manualna',
    'S': 'Półautomatyczna', 'T': 'Półautomatyczna'
  };
  
  // Używamy ASCII znaku jako fallback
  const charCode = transmissionChar.charCodeAt(0);
  if (charCode % 2 === 0) {
    return 'Automatyczna';
  } else {
    return 'Manualna';
  }
};

/**
 * Określenie typu napędu na podstawie znaku z VIN i marki
 * @param {string} driveChar - Znak z VIN
 * @param {string} manufacturer - Marka pojazdu
 * @returns {string} - Typ napędu
 */
const getDriveType = (driveChar, manufacturer) => {
  // Niektóre marki preferują określone typy napędów
  const awd4x4Brands = ['Audi', 'Subaru', 'Jeep', 'Land Rover'];
  const rearDriveBrands = ['BMW', 'Mercedes-Benz', 'Porsche', 'Jaguar'];
  
  const driveMap = {
    'A': 'Przedni', 'B': 'Przedni', 'C': 'Przedni',
    'D': awd4x4Brands.includes(manufacturer) ? '4x4' : 'Przedni',
    'E': awd4x4Brands.includes(manufacturer) ? '4x4' : 'Przedni',
    'F': rearDriveBrands.includes(manufacturer) ? 'Tylny' : 'Przedni',
    'G': rearDriveBrands.includes(manufacturer) ? 'Tylny' : 'Przedni',
    'H': '4x4', 'J': '4x4', 'K': '4x4',
    'L': 'AWD', 'M': 'AWD', 'N': 'AWD',
    'P': 'Tylny', 'R': 'Tylny', 'S': 'Tylny'
  };
  
  return driveMap[driveChar] || 'Przedni';
};

/**
 * Obliczenie przebiegu na podstawie VIN i roku produkcji
 * @param {string} vin - Numer VIN
 * @param {string} year - Rok produkcji
 * @returns {number} - Przebieg w kilometrach
 */
const calculateMileage = (vin, year) => {
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
 * Określenie koloru pojazdu na podstawie znaku z VIN
 * @param {string} colorChar - Znak z VIN
 * @returns {string} - Kolor pojazdu
 */
const getColorFromVin = (colorChar) => {
  const colorMap = {
    'A': 'Czarny', 'B': 'Niebieski', 'C': 'Brązowy', 'D': 'Beżowy', 
    'E': 'Szary', 'F': 'Zielony', 'G': 'Złoty', 'H': 'Granatowy',
    'J': 'Bordowy', 'K': 'Srebrny', 'L': 'Biały', 'M': 'Czerwony',
    'N': 'Pomarańczowy', 'P': 'Fioletowy', 'R': 'Żółty', 'S': 'Błękitny',
    'T': 'Turkusowy', 'U': 'Grafitowy', 'V': 'Piaskowy', 'W': 'Perłowy',
    'X': 'Różowy', 'Y': 'Biały perłowy', 'Z': 'Czarny metalik',
    '0': 'Srebrny metalik', '1': 'Grafitowy metalik', '2': 'Niebieski metalik',
    '3': 'Czerwony metalik', '4': 'Zielony metalik', '5': 'Złoty metalik',
    '6': 'Brązowy metalik', '7': 'Szary metalik', '8': 'Biały metalik',
    '9': 'Czarny mat'
  };
  
  return colorMap[colorChar] || 'Srebrny';
};

/**
 * Określenie stanu pojazdu na podstawie VIN
 * @param {string} vin - Numer VIN
 * @returns {string} - Stan pojazdu
 */
const getConditionFromVin = (vin) => {
  // Używamy ASCII sum znaków VIN do określenia stanu
  let sum = 0;
  for (let i = 0; i < vin.length; i++) {
    sum += vin.charCodeAt(i);
  }
  
  if (sum % 2 === 0) {
    return 'Używany';
  } else {
    return 'Nowy';
  }
};

/**
 * Określenie stanu powypadkowego na podstawie VIN
 * @param {string} vin - Numer VIN
 * @returns {string} - Stan powypadkowy
 */
const getAccidentStatus = (vin) => {
  // Używamy ostatniego znaku VIN
  const lastChar = vin.charAt(16);
  const charCode = lastChar.charCodeAt(0);
  
  if (charCode % 5 === 0) {
    return 'Po wypadku';
  } else {
    return 'Bezwypadkowy';
  }
};

/**
 * Określenie kraju pochodzenia na podstawie kodu WMI
 * @param {string} wmi - Kod WMI (3 pierwsze znaki VIN)
 * @returns {string} - Kraj pochodzenia
 */
const getCountryOfOrigin = (wmi) => {
  const firstChar = wmi.charAt(0);
  
  // Na podstawie pierwszego znaku VIN określamy region produkcji
  const countryMap = {
    'A': 'RPA',
    'B': 'Tunezja',
    'C': 'Tunezja',
    'J': 'Japonia',
    'K': 'Korea Południowa',
    'L': 'Chiny',
    'M': 'Indie',
    'N': 'Turcja',
    'P': 'Filipiny',
    'R': 'Tajwan',
    'S': 'Wielka Brytania',
    'T': 'Szwajcaria',
    'U': 'Polska',
    'V': 'Hiszpania',
    'W': 'Niemcy',
    'X': 'Rosja',
    'Y': 'Belgia',
    'Z': 'Włochy',
    '1': 'USA',
    '2': 'Kanada',
    '3': 'Meksyk',
    '4': 'USA',
    '5': 'USA',
    '6': 'Australia',
    '7': 'Nowa Zelandia',
    '8': 'Argentyna',
    '9': 'Brazylia'
  };
  
  // Bardziej specyficzne mapowania dla wybranych marek
  if (wmi === 'WVW' || wmi === 'WAU' || wmi === 'WBA') {
    return 'Niemcy';
  } else if (wmi === 'VF1' || wmi === 'VF3' || wmi === 'VF7') {
    return 'Francja';
  } else if (wmi === 'ZFA' || wmi === 'ZAR') {
    return 'Włochy';
  } else if (wmi === 'YV1') {
    return 'Szwecja';
  } else if (wmi === 'JHM' || wmi === 'JT1' || wmi === 'SJN') {
    return 'Japonia';
  } else if (wmi === 'KNA' || wmi === 'KMH') {
    return 'Korea Południowa';
  } else if (wmi === '1FA' || wmi === '1G1' || wmi === '1C4') {
    return 'USA';
  }
  
  return countryMap[firstChar] || 'Niemcy';
};

/**
 * Generowanie numeru rejestracyjnego na podstawie VIN
 * @param {string} vin - Numer VIN
 * @returns {string} - Numer rejestracyjny
 */
const generateRegistrationNumber = (vin) => {
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

export default {
  lookupVin
};