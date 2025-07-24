// Engine Data Service
// Provides engine specifications based on manufacturer and VIN codes

/**
 * Generowanie danych silnika na podstawie kodu producenta i fragmentu VIN
 * @param {string} manufacturer - Marka pojazdu
 * @param {string} engineCode - Fragment VIN określający silnik
 * @returns {object} - Dane silnika
 */
export const getEngineData = (manufacturer, engineCode) => {
  // Przykładowe mapowanie fragmentów VIN na dane silnika dla różnych marek
  const engineDataMap = {
    'Volkswagen': {
      'AA': { version: '1.2 TSI', fuelType: 'Benzyna', engineSize: 1200, power: 105 },
      'AB': { version: '1.4 TSI', fuelType: 'Benzyna', engineSize: 1400, power: 125 },
      'AC': { version: '1.6 TDI', fuelType: 'Diesel', engineSize: 1600, power: 115 },
      'AD': { version: '2.0 TDI', fuelType: 'Diesel', engineSize: 2000, power: 150 },
      'AE': { version: '2.0 TSI', fuelType: 'Benzyna', engineSize: 2000, power: 190 },
      'AF': { version: '1.0 TSI', fuelType: 'Benzyna', engineSize: 1000, power: 95 },
      'AG': { version: '1.5 TSI', fuelType: 'Benzyna', engineSize: 1500, power: 150 },
      'AH': { version: '2.5 TDI', fuelType: 'Diesel', engineSize: 2500, power: 174 }
    },
    'Audi': {
      'AA': { version: '1.4 TFSI', fuelType: 'Benzyna', engineSize: 1400, power: 150 },
      'AB': { version: '2.0 TFSI', fuelType: 'Benzyna', engineSize: 2000, power: 190 },
      'AC': { version: '2.0 TDI', fuelType: 'Diesel', engineSize: 2000, power: 150 },
      'AD': { version: '3.0 TFSI', fuelType: 'Benzyna', engineSize: 3000, power: 340 },
      'AE': { version: '3.0 TDI', fuelType: 'Diesel', engineSize: 3000, power: 286 },
      'AF': { version: '1.8 TFSI', fuelType: 'Benzyna', engineSize: 1800, power: 170 },
      'AG': { version: '2.5 TFSI', fuelType: 'Benzyna', engineSize: 2500, power: 400 },
      'AH': { version: '4.0 TFSI', fuelType: 'Benzyna', engineSize: 4000, power: 560 }
    },
    'BMW': {
      'AA': { version: '118i', fuelType: 'Benzyna', engineSize: 1500, power: 136 },
      'AB': { version: '120d', fuelType: 'Diesel', engineSize: 2000, power: 190 },
      'AC': { version: '320i', fuelType: 'Benzyna', engineSize: 2000, power: 184 },
      'AD': { version: '320d', fuelType: 'Diesel', engineSize: 2000, power: 190 },
      'AE': { version: '330i', fuelType: 'Benzyna', engineSize: 2000, power: 258 },
      'AF': { version: '520d', fuelType: 'Diesel', engineSize: 2000, power: 190 },
      'AG': { version: 'M340i', fuelType: 'Benzyna', engineSize: 3000, power: 374 },
      'AH': { version: 'M3', fuelType: 'Benzyna', engineSize: 3000, power: 480 }
    },
    'Mercedes-Benz': {
      'AA': { version: 'A180', fuelType: 'Benzyna', engineSize: 1600, power: 136 },
      'AB': { version: 'C200', fuelType: 'Benzyna', engineSize: 1500, power: 184 },
      'AC': { version: 'C220d', fuelType: 'Diesel', engineSize: 2000, power: 194 },
      'AD': { version: 'E200', fuelType: 'Benzyna', engineSize: 2000, power: 197 },
      'AE': { version: 'E220d', fuelType: 'Diesel', engineSize: 2000, power: 194 },
      'AF': { version: 'S350d', fuelType: 'Diesel', engineSize: 3000, power: 286 },
      'AG': { version: 'AMG C63', fuelType: 'Benzyna', engineSize: 4000, power: 476 },
      'AH': { version: 'AMG GT', fuelType: 'Benzyna', engineSize: 4000, power: 630 }
    },
    'Toyota': {
      'AA': { version: '1.2 Turbo', fuelType: 'Benzyna', engineSize: 1200, power: 116 },
      'AB': { version: '1.8 Hybrid', fuelType: 'Hybrydowy', engineSize: 1800, power: 122 },
      'AC': { version: '2.0 Hybrid', fuelType: 'Hybrydowy', engineSize: 2000, power: 180 },
      'AD': { version: '2.5 Hybrid', fuelType: 'Hybrydowy', engineSize: 2500, power: 218 },
      'AE': { version: '2.0 D-4D', fuelType: 'Diesel', engineSize: 2000, power: 150 },
      'AF': { version: '1.6 VVT-i', fuelType: 'Benzyna', engineSize: 1600, power: 132 },
      'AG': { version: '3.5 V6', fuelType: 'Benzyna', engineSize: 3500, power: 301 },
      'AH': { version: 'GR Yaris', fuelType: 'Benzyna', engineSize: 1600, power: 261 }
    },
    'Honda': {
      'AA': { version: '1.0 VTEC Turbo', fuelType: 'Benzyna', engineSize: 1000, power: 129 },
      'AB': { version: '1.5 VTEC Turbo', fuelType: 'Benzyna', engineSize: 1500, power: 182 },
      'AC': { version: '2.0 i-VTEC', fuelType: 'Benzyna', engineSize: 2000, power: 158 },
      'AD': { version: '1.6 i-DTEC', fuelType: 'Diesel', engineSize: 1600, power: 120 },
      'AE': { version: '2.0 i-MMD', fuelType: 'Hybrydowy', engineSize: 2000, power: 184 },
      'AF': { version: '2.4 i-VTEC', fuelType: 'Benzyna', engineSize: 2400, power: 190 },
      'AG': { version: 'Type R', fuelType: 'Benzyna', engineSize: 2000, power: 320 },
      'AH': { version: 'NSX Hybrid', fuelType: 'Hybrydowy', engineSize: 3500, power: 573 }
    },
    'Nissan': {
      'AA': { version: '1.0 DIG-T', fuelType: 'Benzyna', engineSize: 1000, power: 100 },
      'AB': { version: '1.3 DIG-T', fuelType: 'Benzyna', engineSize: 1300, power: 140 },
      'AC': { version: '1.5 dCi', fuelType: 'Diesel', engineSize: 1500, power: 110 },
      'AD': { version: '2.0 dCi', fuelType: 'Diesel', engineSize: 2000, power: 150 },
      'AE': { version: '1.6 DIG-T', fuelType: 'Benzyna', engineSize: 1600, power: 163 },
      'AF': { version: '2.5 V6', fuelType: 'Benzyna', engineSize: 2500, power: 190 },
      'AG': { version: '3.7 V6', fuelType: 'Benzyna', engineSize: 3700, power: 328 },
      'AH': { version: 'GT-R', fuelType: 'Benzyna', engineSize: 3800, power: 570 }
    },
    'Ford': {
      'AA': { version: '1.0 EcoBoost', fuelType: 'Benzyna', engineSize: 1000, power: 125 },
      'AB': { version: '1.5 EcoBoost', fuelType: 'Benzyna', engineSize: 1500, power: 150 },
      'AC': { version: '2.0 EcoBlue', fuelType: 'Diesel', engineSize: 2000, power: 130 },
      'AD': { version: '2.3 EcoBoost', fuelType: 'Benzyna', engineSize: 2300, power: 280 },
      'AE': { version: '1.5 TDCi', fuelType: 'Diesel', engineSize: 1500, power: 120 },
      'AF': { version: '2.0 TDCi', fuelType: 'Diesel', engineSize: 2000, power: 170 },
      'AG': { version: '5.0 V8', fuelType: 'Benzyna', engineSize: 5000, power: 450 },
      'AH': { version: 'RS', fuelType: 'Benzyna', engineSize: 2300, power: 350 }
    },
    'Opel': {
      'AA': { version: '1.2 Turbo', fuelType: 'Benzyna', engineSize: 1200, power: 110 },
      'AB': { version: '1.4 Turbo', fuelType: 'Benzyna', engineSize: 1400, power: 145 },
      'AC': { version: '1.5 Diesel', fuelType: 'Diesel', engineSize: 1500, power: 122 },
      'AD': { version: '2.0 Diesel', fuelType: 'Diesel', engineSize: 2000, power: 177 },
      'AE': { version: '1.6 SIDI', fuelType: 'Benzyna', engineSize: 1600, power: 136 },
      'AF': { version: '1.0 Turbo', fuelType: 'Benzyna', engineSize: 1000, power: 105 },
      'AG': { version: '1.6 CDTI', fuelType: 'Diesel', engineSize: 1600, power: 136 },
      'AH': { version: 'OPC', fuelType: 'Benzyna', engineSize: 2000, power: 280 }
    },
    'Škoda': {
      'AA': { version: '1.0 TSI', fuelType: 'Benzyna', engineSize: 1000, power: 95 },
      'AB': { version: '1.4 TSI', fuelType: 'Benzyna', engineSize: 1400, power: 150 },
      'AC': { version: '1.6 TDI', fuelType: 'Diesel', engineSize: 1600, power: 115 },
      'AD': { version: '2.0 TDI', fuelType: 'Diesel', engineSize: 2000, power: 150 },
      'AE': { version: '2.0 TSI', fuelType: 'Benzyna', engineSize: 2000, power: 190 },
      'AF': { version: '1.5 TSI', fuelType: 'Benzyna', engineSize: 1500, power: 150 },
      'AG': { version: '2.0 TDI 4x4', fuelType: 'Diesel', engineSize: 2000, power: 190 },
      'AH': { version: 'RS', fuelType: 'Benzyna', engineSize: 2000, power: 245 }
    },
    'Kia': {
      'AA': { version: '1.0 T-GDI', fuelType: 'Benzyna', engineSize: 1000, power: 120 },
      'AB': { version: '1.4 T-GDI', fuelType: 'Benzyna', engineSize: 1400, power: 140 },
      'AC': { version: '1.6 CRDi', fuelType: 'Diesel', engineSize: 1600, power: 136 },
      'AD': { version: '2.0 CRDi', fuelType: 'Diesel', engineSize: 2000, power: 185 },
      'AE': { version: '1.6 T-GDI', fuelType: 'Benzyna', engineSize: 1600, power: 180 },
      'AF': { version: '2.5 T-GDI', fuelType: 'Benzyna', engineSize: 2500, power: 290 },
      'AG': { version: 'EV', fuelType: 'Elektryczny', engineSize: 0, power: 204 },
      'AH': { version: 'GT', fuelType: 'Benzyna', engineSize: 3300, power: 370 }
    },
    'Hyundai': {
      'AA': { version: '1.0 T-GDI', fuelType: 'Benzyna', engineSize: 1000, power: 120 },
      'AB': { version: '1.4 T-GDI', fuelType: 'Benzyna', engineSize: 1400, power: 140 },
      'AC': { version: '1.6 CRDi', fuelType: 'Diesel', engineSize: 1600, power: 136 },
      'AD': { version: '2.0 CRDi', fuelType: 'Diesel', engineSize: 2000, power: 185 },
      'AE': { version: '1.6 T-GDI', fuelType: 'Benzyna', engineSize: 1600, power: 180 },
      'AF': { version: '2.5 T-GDI', fuelType: 'Benzyna', engineSize: 2500, power: 290 },
      'AG': { version: 'IONIQ Electric', fuelType: 'Elektryczny', engineSize: 0, power: 136 },
      'AH': { version: 'N Performance', fuelType: 'Benzyna', engineSize: 2000, power: 275 }
    },
    'Tesla': {
      'AA': { version: 'Standard Range', fuelType: 'Elektryczny', engineSize: 0, power: 283 },
      'AB': { version: 'Long Range', fuelType: 'Elektryczny', engineSize: 0, power: 351 },
      'AC': { version: 'Performance', fuelType: 'Elektryczny', engineSize: 0, power: 480 },
      'AD': { version: 'Plaid', fuelType: 'Elektryczny', engineSize: 0, power: 1020 },
      'AE': { version: 'Dual Motor', fuelType: 'Elektryczny', engineSize: 0, power: 385 },
      'AF': { version: 'Single Motor', fuelType: 'Elektryczny', engineSize: 0, power: 258 },
      'AG': { version: 'Tri Motor', fuelType: 'Elektryczny', engineSize: 0, power: 1050 },
      'AH': { version: 'Roadster', fuelType: 'Elektryczny', engineSize: 0, power: 1000 }
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
export const getTransmissionType = (transmissionChar) => {
  const transmissionMap = {
    'A': 'Automatyczna', 'B': 'Automatyczna', 'C': 'Automatyczna', 
    'D': 'Automatyczna DSG', 'E': 'Automatyczna DSG',
    'M': 'Manualna', 'N': 'Manualna', 'P': 'Manualna',
    'S': 'Półautomatyczna', 'T': 'Półautomatyczna',
    'F': 'CVT', 'G': 'CVT'
  };
  
  // Używamy ASCII znaku jako fallback
  const charCode = transmissionChar.charCodeAt(0);
  if (charCode % 3 === 0) {
    return 'Automatyczna';
  } else if (charCode % 3 === 1) {
    return 'Manualna';
  } else {
    return 'Półautomatyczna';
  }
};

/**
 * Określenie typu napędu na podstawie znaku z VIN i marki
 * @param {string} driveChar - Znak z VIN
 * @param {string} manufacturer - Marka pojazdu
 * @returns {string} - Typ napędu
 */
export const getDriveType = (driveChar, manufacturer) => {
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
 * Określenie koloru pojazdu na podstawie znaku z VIN
 * @param {string} colorChar - Znak z VIN
 * @returns {string} - Kolor pojazdu
 */
export const getColorFromVin = (colorChar) => {
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
 * Określenie wykończenia lakieru na podstawie znaku z VIN
 * @param {string} paintChar - Znak z VIN
 * @returns {string} - Typ wykończenia lakieru
 */
export const getPaintFinish = (paintChar) => {
  const paintMap = {
    'A': 'Metalik', 'B': 'Metalik', 'C': 'Metalik', 'D': 'Metalik',
    'E': 'Perłowy', 'F': 'Perłowy', 'G': 'Perłowy',
    'H': 'Mat', 'J': 'Mat',
    'K': 'Zwykły', 'L': 'Zwykły', 'M': 'Zwykły', 'N': 'Zwykły',
    'P': 'Zwykły', 'R': 'Zwykły', 'S': 'Zwykły', 'T': 'Zwykły',
    'U': 'Zwykły', 'V': 'Zwykły', 'W': 'Zwykły', 'X': 'Zwykły',
    'Y': 'Zwykły', 'Z': 'Zwykły',
    '0': 'Metalik', '1': 'Metalik', '2': 'Metalik', '3': 'Metalik',
    '4': 'Metalik', '5': 'Metalik', '6': 'Metalik', '7': 'Metalik',
    '8': 'Perłowy', '9': 'Mat'
  };
  
  return paintMap[paintChar] || 'Zwykły';
};
