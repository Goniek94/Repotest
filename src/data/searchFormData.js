/**
 * Dane statyczne dla formularza wyszukiwania pojazdów
 */

// Dane marek i modeli samochodów - teraz pobierane z backendu
// Removed hardcoded data - now fetched from backend API
export const carData = {};

// Typy nadwozia
export const bodyTypes = [
  'Sedan', 'Hatchback', 'SUV', 'Kombi', 'Coupé', 'Cabrio', 'VAN', 'Pickup'
];

// Zaawansowane opcje wyszukiwania
export const advancedOptions = {
  damageStatus: ['Brak uszkodzeń', 'Lekko uszkodzony', 'Poważnie uszkodzony', 'Uszkodzony', 'Bezwypadkowy'],
  country: ['Polska', 'Niemcy', 'Francja', 'Włochy', 'Inne państwa europejskie'],
  fuelType: ['Benzyna', 'Diesel', 'Elektryczny', 'Hybrydowy', 'LPG', 'CNG'],
  driveType: ['Przedni', 'Tylny', '4x4', 'Na przód'],
  transmission: ['Automatyczna', 'Manualna'],
  color: ['Biały', 'Czarny', 'Srebrny', 'Czerwony', 'Niebieski', 'Zielony', 'Żółty', 'Inny'],
  doorCount: ['2/3', '4/5'],
  tuning: ['Tak', 'Nie'],
  vehicleCondition: ['Używany', 'Nowy', 'Powypadkowy'],
  sellingForm: ['Sprzedaż', 'Zamiana', 'Wynajem', 'Leasing'],
  sellerType: ['Prywatny', 'Firma'],
  vehicleStatus: ['Uszkodzony', 'Bezwypadkowy', 'Kierownica po prawej', 'Przystosowany dla niepełnosprawnych'],
};

// Województwa
export const regions = [
  'Dolnośląskie', 'Kujawsko-pomorskie', 'Lubelskie', 'Lubuskie', 'Łódzkie', 
  'Małopolskie', 'Mazowieckie', 'Opolskie', 'Podkarpackie', 'Podlaskie',
  'Pomorskie', 'Śląskie', 'Świętokrzyskie', 'Warmińsko-mazurskie', 'Wielkopolskie', 'Zachodniopomorskie'
];

// Domyślne wartości formularza
export const defaultFormValues = {
  make: '',
  model: '',
  priceFrom: '',
  priceTo: '',
  yearFrom: '',
  yearTo: '',
  bodyType: '',
  damageStatus: '',
  country: '',
  region: '',
  fuelType: '',
  driveType: '',
  mileageFrom: '',
  mileageTo: '',
  location: '',
  transmission: '',
  enginePowerFrom: '',
  enginePowerTo: '',
  engineCapacityFrom: '',
  engineCapacityTo: '',
  color: '',
  doorCount: '',
  tuning: '',
  vehicleCondition: '',
  sellingForm: '',
  sellerType: '',
  vat: false,
  invoiceOptions: false,
};
