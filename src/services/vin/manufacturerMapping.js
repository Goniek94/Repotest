// Manufacturer Mapping Service
// Maps WMI (World Manufacturer Identifier) codes to manufacturer names

/**
 * Mapowanie kodów WMI (World Manufacturer Identifier) na marki
 * @param {string} wmi - 3-znakowy kod WMI
 * @returns {string} - Nazwa marki lub null jeśli nie znaleziono
 */
export const getManufacturerFromWMI = (wmi) => {
  // Pełniejsza mapa kodów WMI dla europejskich i światowych producentów
  const manufacturerMap = {
    // Europa - Niemcy
    'WVW': 'Volkswagen', 'WV1': 'Volkswagen', 'WV2': 'Volkswagen', '1VW': 'Volkswagen', '3VW': 'Volkswagen',
    'WAU': 'Audi', 'TRU': 'Audi', '93U': 'Audi', 'WUA': 'Audi',
    'WBA': 'BMW', 'WBS': 'BMW', 'WBX': 'BMW', 'WBY': 'BMW', '4US': 'BMW', 'X4X': 'BMW',
    'WDD': 'Mercedes-Benz', 'WMX': 'Mercedes-Benz', 'WDF': 'Mercedes-Benz', 'WDB': 'Mercedes-Benz',
    'WEB': 'Mercedes-Benz AMG', 'WME': 'Smart',
    'WP0': 'Porsche', 'WP1': 'Porsche',
    'W0L': 'Opel', 'WOL': 'Opel', 'KL1': 'Opel',
    
    // Europa - Czechy/Słowacja
    'TMB': 'Škoda', 'TMP': 'Škoda', 'TM9': 'Škoda',
    
    // Europa - Hiszpania
    'VSS': 'Seat', 'VSH': 'Seat',
    
    // Europa - Francja
    'VF1': 'Renault', 'VF2': 'Renault',
    'VF3': 'Peugeot', 'VF7': 'Citroën', 'VF5': 'Opel',
    'VF6': 'Dacia', 'UU1': 'Dacia',
    
    // Europa - Włochy
    'ZFA': 'Fiat', 'ZFC': 'Fiat', 'ZFF': 'Ferrari',
    'ZAR': 'Alfa Romeo', 'ZLA': 'Lancia',
    
    // Europa - Wielka Brytania
    'SCA': 'Rolls-Royce', 'SAL': 'Land Rover', 'SAR': 'Rover',
    'SAJ': 'Jaguar', 'SAT': 'Triumph',
    
    // Europa - Szwecja
    'YS3': 'Saab', 'YV1': 'Volvo', 'YV4': 'Volvo',
    
    // Europa - Inne
    'VX1': 'SsangYong',
    
    // Azja - Japonia
    'JHM': 'Honda', 'JHG': 'Honda',
    'JT1': 'Toyota', 'JT2': 'Toyota', 'JT3': 'Toyota', 'JT4': 'Toyota', 'JTD': 'Toyota', 'MR0': 'Toyota',
    'SJN': 'Nissan', 'VSK': 'Nissan', 'JN1': 'Nissan', 'JN8': 'Nissan',
    'MAL': 'Mitsubishi', 'JA3': 'Mitsubishi', 'JA4': 'Mitsubishi',
    'JF1': 'Subaru', 'JF2': 'Subaru',
    'JN3': 'Infiniti',
    'JSA': 'Suzuki', 'JS2': 'Suzuki',
    'JMZ': 'Mazda',
    'JHL': 'Acura',
    
    // Azja - Korea Południowa
    'KNA': 'Kia', 'KND': 'Kia', '3KP': 'Kia',
    'KMH': 'Hyundai', 'KMY': 'Hyundai', 'KM8': 'Hyundai',
    'KNM': 'Renault Samsung',
    
    // Azja - Chiny
    'L2C': 'BYD', 'LFV': 'Dongfeng', 'LGJ': 'Great Wall', 'LNB': 'Xpeng',
    'L6T': 'Geely', 'LLV': 'Lynk & Co', 'LSV': 'NIO', 'LVG': 'GAC',
    'LDC': 'Dongfeng Peugeot', 'LVS': 'Chang\'an Ford',
    
    // Azja - Indie
    'MAT': 'Tata', 'MA3': 'Maruti Suzuki', 'ME4': 'Mahindra',
    
    // USA
    '1G1': 'Chevrolet', '1GC': 'Chevrolet', '1G6': 'Cadillac', '1G4': 'Buick',
    '1FA': 'Ford', '1FB': 'Ford', '1FC': 'Ford', '1FD': 'Ford', '1FM': 'Ford', '1FT': 'Ford',
    '1C3': 'Chrysler', '1C4': 'Chrysler', '1C6': 'RAM', '1D7': 'Dodge',
    '1J4': 'Jeep', '1J8': 'Jeep',
    '4T1': 'Toyota', '4T3': 'Toyota',
    '1N4': 'Nissan', '1N6': 'Nissan',
    '1HD': 'Harley-Davidson',
    '2HM': 'Hyundai', '2HG': 'Honda',
    '3VW': 'Volkswagen', '3FA': 'Ford',
    
    // Marki elektryczne i nowe
    'LBV': 'Tesla', '5YJ': 'Tesla', '7SA': 'Tesla',
    '7JR': 'Rimac',
    'XP7': 'Rivian',
    'LRW': 'Lucid',
    'LFP': 'Fisker',
    'WMW': 'MINI',
    
    // Marki luksusowe
    'WDC': 'McLaren',
    'ZAM': 'Maserati',
    'ZHW': 'Lamborghini',
    'ZBN': 'Bentley',
    'ZAP': 'Pagani',
    
    // Marki użytkowe
    'WDB': 'Mercedes-Benz Vans',
    'VSE': 'Suzuki',
    'NMT': 'Toyota',
    'VNE': 'Isuzu'
  };
  
  return manufacturerMap[wmi] || null;
};

/**
 * Określenie kraju pochodzenia na podstawie kodu WMI
 * @param {string} wmi - Kod WMI (3 pierwsze znaki VIN)
 * @returns {string} - Kraj pochodzenia
 */
export const getCountryOfOrigin = (wmi) => {
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
 * Sprawdza czy marka jest europejska
 * @param {string} manufacturer - Nazwa marki
 * @returns {boolean} - True jeśli marka jest europejska
 */
export const isEuropeanBrand = (manufacturer) => {
  const europeanBrands = [
    'Volkswagen', 'Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Opel',
    'Škoda', 'Seat', 'Renault', 'Peugeot', 'Citroën', 'Dacia',
    'Fiat', 'Ferrari', 'Alfa Romeo', 'Lancia', 'Rolls-Royce',
    'Land Rover', 'Rover', 'Jaguar', 'Saab', 'Volvo', 'Smart',
    'MINI', 'McLaren', 'Maserati', 'Lamborghini', 'Bentley', 'Pagani'
  ];
  
  return europeanBrands.includes(manufacturer);
};

/**
 * Sprawdza czy marka jest azjatycka
 * @param {string} manufacturer - Nazwa marki
 * @returns {boolean} - True jeśli marka jest azjatycka
 */
export const isAsianBrand = (manufacturer) => {
  const asianBrands = [
    'Honda', 'Toyota', 'Nissan', 'Mitsubishi', 'Subaru', 'Infiniti',
    'Suzuki', 'Mazda', 'Acura', 'Kia', 'Hyundai', 'BYD', 'Dongfeng',
    'Great Wall', 'Xpeng', 'Geely', 'Lynk & Co', 'NIO', 'Tata',
    'Maruti Suzuki', 'Mahindra'
  ];
  
  return asianBrands.includes(manufacturer);
};
