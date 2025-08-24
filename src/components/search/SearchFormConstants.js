// SearchFormConstants.js
// All static data for the search form
import {
  BODY_TYPES,
  COLORS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  DRIVE_TYPES,
  COUNTRIES,
  PAINT_FINISHES,
  DOOR_OPTIONS,
  SEAT_OPTIONS,
  CONDITION_OPTIONS,
  ACCIDENT_STATUS_OPTIONS,
  DAMAGE_STATUS_OPTIONS,
  TUNING_OPTIONS,
  SELLER_TYPE_OPTIONS,
  IMPORTED_OPTIONS,
  REGISTERED_IN_PL_OPTIONS,
  FIRST_OWNER_OPTIONS,
  DISABLED_ADAPTED_OPTIONS
} from '../../contexts/constants/vehicleOptions';

// Mapowanie województw do miast
export const regionToCities = {
  'Dolnośląskie': ['Wrocław', 'Wałbrzych', 'Legnica', 'Jelenia Góra', 'Lubin', 'Głogów', 'Świdnica', 'Bolesławiec', 'Oleśnica', 'Dzierżoniów'],
  'Kujawsko-pomorskie': ['Bydgoszcz', 'Toruń', 'Włocławek', 'Grudziądz', 'Inowrocław', 'Brodnica', 'Świecie', 'Chełmno', 'Nakło nad Notecią', 'Rypin'],
  'Lubelskie': ['Lublin', 'Zamość', 'Chełm', 'Biała Podlaska', 'Puławy', 'Świdnik', 'Kraśnik', 'Łuków', 'Biłgoraj', 'Lubartów'],
  'Lubuskie': ['Zielona Góra', 'Gorzów Wielkopolski', 'Nowa Sól', 'Żary', 'Żagań', 'Świebodzin', 'Międzyrzecz', 'Sulechów', 'Słubice', 'Gubin'],
  'Łódzkie': ['Łódź', 'Piotrków Trybunalski', 'Pabianice', 'Tomaszów Mazowiecki', 'Bełchatów', 'Zgierz', 'Skierniewice', 'Radomsko', 'Kutno', 'Sieradz'],
  'Małopolskie': ['Kraków', 'Tarnów', 'Nowy Sącz', 'Oświęcim', 'Chrzanów', 'Olkusz', 'Nowy Targ', 'Bochnia', 'Gorlice', 'Zakopane'],
  'Mazowieckie': ['Warszawa', 'Radom', 'Płock', 'Siedlce', 'Pruszków', 'Legionowo', 'Ostrołęka', 'Piaseczno', 'Ciechanów', 'Żyrardów'],
  'Opolskie': ['Opole', 'Kędzierzyn-Koźle', 'Nysa', 'Brzeg', 'Kluczbork', 'Prudnik', 'Strzelce Opolskie', 'Krapkowice', 'Głubczyce', 'Namysłów'],
  'Podkarpackie': ['Rzeszów', 'Przemyśl', 'Stalowa Wola', 'Mielec', 'Tarnobrzeg', 'Krosno', 'Dębica', 'Jarosław', 'Sanok', 'Jasło'],
  'Podlaskie': ['Białystok', 'Suwałki', 'Łomża', 'Augustów', 'Bielsk Podlaski', 'Hajnówka', 'Grajewo', 'Zambrów', 'Sokółka', 'Mońki'],
  'Pomorskie': ['Gdańsk', 'Gdynia', 'Słupsk', 'Tczew', 'Starogard Gdański', 'Wejherowo', 'Rumia', 'Chojnice', 'Malbork', 'Kwidzyn'],
  'Śląskie': ['Katowice', 'Częstochowa', 'Sosnowiec', 'Gliwice', 'Zabrze', 'Bielsko-Biała', 'Bytom', 'Rybnik', 'Ruda Śląska', 'Tychy'],
  'Świętokrzyskie': ['Kielce', 'Ostrowiec Świętokrzyski', 'Starachowice', 'Skarżysko-Kamienna', 'Sandomierz', 'Końskie', 'Jędrzejów', 'Busko-Zdrój', 'Staszów', 'Pińczów'],
  'Warmińsko-mazurskie': ['Olsztyn', 'Elbląg', 'Ełk', 'Ostróda', 'Iława', 'Giżycko', 'Kętrzyn', 'Szczytno', 'Bartoszyce', 'Mrągowo'],
  'Wielkopolskie': ['Poznań', 'Kalisz', 'Konin', 'Piła', 'Ostrów Wielkopolski', 'Gniezno', 'Leszno', 'Swarzędz', 'Śrem', 'Krotoszyn'],
  'Zachodniopomorskie': ['Szczecin', 'Koszalin', 'Stargard', 'Kołobrzeg', 'Świnoujście', 'Szczecinek', 'Police', 'Wałcz', 'Białogard', 'Goleniów']
};

// carData will be loaded dynamically from backend API
// Dodajemy pusty obiekt jako fallback
export const carData = {}; // Fallback dla statycznych danych

export const bodyTypes = BODY_TYPES;

export const advancedOptions = {
  // Dane techniczne - usunięto fuelType (duplikat z podstawowych)
  // Usunięto driveType (duplikat z podstawowych)
  tuning: TUNING_OPTIONS,
  
  // Stan pojazdu
  condition: CONDITION_OPTIONS,
  accidentStatus: ACCIDENT_STATUS_OPTIONS,
  damageStatus: DAMAGE_STATUS_OPTIONS,
  
  // Nadwozie
  color: COLORS,
  finish: PAINT_FINISHES,
  doorCount: DOOR_OPTIONS,
  seats: SEAT_OPTIONS,
  
  // Pochodzenie i sprzedawca
  sellerType: SELLER_TYPE_OPTIONS,
  
  // Statusy pojazdu
  imported: IMPORTED_OPTIONS,
  registeredInPL: REGISTERED_IN_PL_OPTIONS,
  firstOwner: FIRST_OWNER_OPTIONS,
  disabledAdapted: DISABLED_ADAPTED_OPTIONS,
  
  // Zachowane dla kompatybilności wstecznej
  // Usunięto country (duplikat z podstawowych)
  vehicleCondition: [...CONDITION_OPTIONS, ...ACCIDENT_STATUS_OPTIONS, ...DAMAGE_STATUS_OPTIONS],
  vehicleStatus: ['Uszkodzony', 'Bezwypadkowy', 'Kierownica po prawej', 'Przystosowany dla niepełnosprawnych', 'Pierwszy właściciel', 'Serwisowany w ASO', 'Zarejestrowany w Polsce', 'Sprowadzony'],
  sellingForm: ['Sprzedaż', 'Zamiana', 'Wynajem', 'Leasing']
};

export const regions = [
  'Dolnośląskie', 'Kujawsko-pomorskie', 'Lubelskie', 'Lubuskie', 'Łódzkie', 
  'Małopolskie', 'Mazowieckie', 'Opolskie', 'Podkarpackie', 'Podlaskie',
  'Pomorskie', 'Śląskie', 'Świętokrzyskie', 'Warmińsko-mazurskie', 'Wielkopolskie', 'Zachodniopomorskie'
];

/**
 * Funkcja generująca listę lat do filtrów rocznika pojazdu
 * @param {number} startYear - Rok początkowy (domyślnie 1900)
 * @returns {Array} - Tablica lat od startYear do obecnego roku, w kolejności malejącej
 */
export const generateYearOptions = (startYear = 1900) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
};

/**
 * Logiczne przedziały cenowe w PLN
 */
export const priceRanges = [
  { label: '5 000', value: 5000 },
  { label: '10 000', value: 10000 },
  { label: '15 000', value: 15000 },
  { label: '20 000', value: 20000 },
  { label: '25 000', value: 25000 },
  { label: '30 000', value: 30000 },
  { label: '40 000', value: 40000 },
  { label: '50 000', value: 50000 },
  { label: '60 000', value: 60000 },
  { label: '70 000', value: 70000 },
  { label: '80 000', value: 80000 },
  { label: '90 000', value: 90000 },
  { label: '100 000', value: 100000 },
  { label: '120 000', value: 120000 },
  { label: '150 000', value: 150000 },
  { label: '200 000', value: 200000 },
  { label: '250 000', value: 250000 },
  { label: '300 000', value: 300000 },
  { label: '400 000', value: 400000 },
  { label: '500 000', value: 500000 }
];

/**
 * Logiczne przedziały przebiegu w km
 */
export const mileageRanges = [
  { label: '10 000', value: 10000 },
  { label: '20 000', value: 20000 },
  { label: '30 000', value: 30000 },
  { label: '40 000', value: 40000 },
  { label: '50 000', value: 50000 },
  { label: '60 000', value: 60000 },
  { label: '70 000', value: 70000 },
  { label: '80 000', value: 80000 },
  { label: '90 000', value: 90000 },
  { label: '100 000', value: 100000 },
  { label: '120 000', value: 120000 },
  { label: '150 000', value: 150000 },
  { label: '200 000', value: 200000 },
  { label: '250 000', value: 250000 },
  { label: '300 000', value: 300000 },
  { label: '400 000', value: 400000 },
  { label: '500 000', value: 500000 }
];

/**
 * Logiczne przedziały mocy silnika w KM
 */
export const enginePowerRanges = [
  { label: '50', value: 50 },
  { label: '75', value: 75 },
  { label: '100', value: 100 },
  { label: '125', value: 125 },
  { label: '150', value: 150 },
  { label: '175', value: 175 },
  { label: '200', value: 200 },
  { label: '250', value: 250 },
  { label: '300', value: 300 },
  { label: '350', value: 350 },
  { label: '400', value: 400 },
  { label: '450', value: 450 },
  { label: '500', value: 500 },
  { label: '600', value: 600 },
  { label: '700', value: 700 },
  { label: '800', value: 800 }
];

/**
 * Logiczne przedziały pojemności silnika w cm³
 */
export const engineCapacityRanges = [
  { label: '800', value: 800 },
  { label: '1000', value: 1000 },
  { label: '1200', value: 1200 },
  { label: '1400', value: 1400 },
  { label: '1600', value: 1600 },
  { label: '1800', value: 1800 },
  { label: '2000', value: 2000 },
  { label: '2200', value: 2200 },
  { label: '2500', value: 2500 },
  { label: '3000', value: 3000 },
  { label: '3500', value: 3500 },
  { label: '4000', value: 4000 },
  { label: '4500', value: 4500 },
  { label: '5000', value: 5000 },
  { label: '6000', value: 6000 }
];

/**
 * Logiczne przedziały wagi pojazdu w kg
 */
export const weightRanges = [
  { label: '800', value: 800 },
  { label: '1000', value: 1000 },
  { label: '1200', value: 1200 },
  { label: '1400', value: 1400 },
  { label: '1600', value: 1600 },
  { label: '1800', value: 1800 },
  { label: '2000', value: 2000 },
  { label: '2200', value: 2200 },
  { label: '2500', value: 2500 },
  { label: '3000', value: 3000 },
  { label: '3500', value: 3500 },
  { label: '4000', value: 4000 },
  { label: '5000', value: 5000 },
  { label: '6000', value: 6000 }
];
