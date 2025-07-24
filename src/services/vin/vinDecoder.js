// VIN Decoder Service
// Main VIN decoding logic that combines all other services

import { getManufacturerFromWMI, getCountryOfOrigin } from './manufacturerMapping';
import { getEngineData, getTransmissionType, getDriveType, getColorFromVin, getPaintFinish } from './engineData';
import { getVehicleStatus, calculateMileage, getSeatsCount, generateRegistrationNumber } from './vehicleStatus';

/**
 * Dokładniejsze dekodowanie numeru VIN
 * Dekoduje informacje z numeru VIN zgodnie ze standardem ISO 3779
 * 
 * @param {string} vin - 17-znakowy numer VIN
 * @returns {object} - Zdekodowane dane pojazdu
 */
export const decodeVin = (vin) => {
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
  
  // Podstawowy model selection - w rzeczywistej implementacji byłoby to bardziej zaawansowane
  const basicModels = ['Model A', 'Model B', 'Model C', 'Model D', 'Model E'];
  const modelIndex = getModelIndexFromVin(vin, basicModels.length);
  const model = basicModels[modelIndex];
  
  // Dekodowanie roku produkcji
  const productionYear = decodeProductionYear(vin.charAt(9));
  
  // Pozostałe dane pojazdu bazujące na fragmentach VIN
  const engineCode = vds.substring(0, 2);
  const engineData = getEngineData(manufacturer, engineCode);
  
  // Pobieranie statusu pojazdu
  const vehicleStatus = getVehicleStatus(vin, wmi);
  
  // Generowanie numeru rejestracyjnego
  const registrationNumber = generateRegistrationNumber(vin);
  
  return {
    // Podstawowe informacje
    brand: manufacturer,
    model: model,
    generation: '',
    version: engineData.version,
    productionYear: productionYear,
    
    // Dane silnika i napędu
    fuelType: engineData.fuelType,
    engineSize: engineData.engineSize,
    power: engineData.power,
    transmission: getTransmissionType(vin.charAt(4)),
    drive: getDriveType(vin.charAt(5), manufacturer),
    
    // Dane wizualne
    color: getColorFromVin(vin.charAt(6)),
    paintFinish: getPaintFinish(vin.charAt(7)),
    
    // Status pojazdu
    condition: vehicleStatus.condition,
    accidentStatus: vehicleStatus.accidentStatus,
    damageStatus: vehicleStatus.damageStatus,
    
    // Pola obowiązkowe z VehicleStatusSection
    imported: vehicleStatus.imported,
    registeredInPL: vehicleStatus.registeredInPL,
    firstOwner: vehicleStatus.firstOwner,
    disabledAdapted: vehicleStatus.disabledAdapted,
    
    // Dane techniczne
    mileage: calculateMileage(vin, productionYear),
    seats: getSeatsCount(manufacturer, model),
    
    // Dane rejestracyjne
    countryOfOrigin: getCountryOfOrigin(wmi),
    registrationNumber: registrationNumber,
    
    // VIN
    vin: vin,
    
    // Dodatkowe pola
    negotiable: true // Domyślnie true
  };
};

/**
 * Dekodowanie roku produkcji z numeru VIN
 * @param {string} yearChar - Znak z VIN reprezentujący rok
 * @returns {string} - Rok produkcji
 */
export const decodeProductionYear = (yearChar) => {
  const yearMap = {
    'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013', 'E': '2014',
    'F': '2015', 'G': '2016', 'H': '2017', 'J': '2018', 'K': '2019',
    'L': '2020', 'M': '2021', 'N': '2022', 'P': '2023', 'R': '2024',
    'S': '2025', 'T': '2026', 'V': '2027', 'W': '2028', 'X': '2029',
    'Y': '2030',
    '1': '2001', '2': '2002', '3': '2003', '4': '2004', '5': '2005',
    '6': '2006', '7': '2007', '8': '2008', '9': '2009', '0': '2000'
  };
  
  return yearMap[yearChar] || '2020';
};

/**
 * Deterministyczny wybór modelu na podstawie VIN
 * @param {string} vin - Numer VIN
 * @param {number} modelsCount - Liczba dostępnych modeli
 * @returns {number} - Indeks modelu
 */
export const getModelIndexFromVin = (vin, modelsCount) => {
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
 * Sprawdza czy VIN jest poprawny strukturalnie
 * @param {string} vin - Numer VIN do sprawdzenia
 * @returns {boolean} - True jeśli VIN ma poprawną strukturę
 */
export const isValidVinStructure = (vin) => {
  if (!vin || typeof vin !== 'string' || vin.length !== 17) {
    return false;
  }
  
  // Sprawdzenie czy zawiera tylko dozwolone znaki (bez I, O, Q)
  const allowedChars = /^[A-HJ-NPR-Z0-9]+$/;
  if (!allowedChars.test(vin)) {
    return false;
  }
  
  // Sprawdzenie czy WMI jest rozpoznawalny
  const wmi = vin.substring(0, 3);
  const manufacturer = getManufacturerFromWMI(wmi);
  
  return manufacturer !== null;
};

/**
 * Pobiera informacje o segmentach VIN
 * @param {string} vin - Numer VIN
 * @returns {object} - Obiekt z informacjami o segmentach
 */
export const getVinSegments = (vin) => {
  if (!vin || vin.length !== 17) {
    return null;
  }
  
  return {
    wmi: vin.substring(0, 3),    // World Manufacturer Identifier
    vds: vin.substring(3, 9),    // Vehicle Descriptor Section
    vis: vin.substring(9, 17),   // Vehicle Identifier Section
    checkDigit: vin.charAt(8),   // Check digit (9th position)
    modelYear: vin.charAt(9),    // Model year (10th position)
    plantCode: vin.charAt(10),   // Assembly plant (11th position)
    serialNumber: vin.substring(11, 17) // Serial number (12-17th positions)
  };
};

/**
 * Formatuje VIN dla wyświetlania
 * @param {string} vin - Numer VIN
 * @returns {string} - Sformatowany VIN
 */
export const formatVinForDisplay = (vin) => {
  if (!vin || vin.length !== 17) {
    return vin;
  }
  
  const segments = getVinSegments(vin);
  return `${segments.wmi}-${segments.vds}-${segments.vis}`;
};

/**
 * Pobiera szczegółowe informacje o producencie
 * @param {string} vin - Numer VIN
 * @returns {object} - Informacje o producencie
 */
export const getManufacturerInfo = (vin) => {
  if (!vin || vin.length < 3) {
    return null;
  }
  
  const wmi = vin.substring(0, 3);
  const manufacturer = getManufacturerFromWMI(wmi);
  const country = getCountryOfOrigin(wmi);
  
  if (!manufacturer) {
    return null;
  }
  
  return {
    name: manufacturer,
    country: country,
    wmi: wmi,
    region: getRegionFromCountry(country)
  };
};

/**
 * Określa region na podstawie kraju
 * @param {string} country - Nazwa kraju
 * @returns {string} - Region
 */
const getRegionFromCountry = (country) => {
  const europeanCountries = ['Niemcy', 'Francja', 'Włochy', 'Hiszpania', 'Wielka Brytania', 'Szwecja', 'Belgia', 'Szwajcaria', 'Polska'];
  const asianCountries = ['Japonia', 'Korea Południowa', 'Chiny', 'Indie', 'Tajwan', 'Filipiny', 'Turcja'];
  const americanCountries = ['USA', 'Kanada', 'Meksyk', 'Brazylia', 'Argentyna'];
  
  if (europeanCountries.includes(country)) {
    return 'Europa';
  } else if (asianCountries.includes(country)) {
    return 'Azja';
  } else if (americanCountries.includes(country)) {
    return 'Ameryka';
  } else {
    return 'Inne';
  }
};
