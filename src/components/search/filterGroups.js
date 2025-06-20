// filterGroups.js
import { bodyTypes, advancedOptions } from './SearchFormConstants';

/**
 * Generowanie opcji lat
 * @returns {Array} lista lat od bieżącego roku wstecz
 */
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
  
  return years.map(year => ({
    label: String(year),
    value: year
  }));
};

/**
 * Generowanie przedziałów lat
 * @returns {Array} lista przedziałów lat
 */
const generateYearRanges = () => [
  { label: 'Nowe (2023-2024)', value: 'new', from: 2023, to: 2024 },
  { label: 'Do 2 lat', value: 'up_to_2', from: 2022, to: 2024 },
  { label: 'Do 5 lat', value: 'up_to_5', from: 2019, to: 2024 },
  { label: 'Do 10 lat', value: 'up_to_10', from: 2014, to: 2024 },
  { label: 'Starsze niż 10 lat', value: 'older_than_10', from: 1900, to: 2013 }
];

/**
 * Generowanie pustej listy przedziałów cenowych
 * @returns {Array} pusta lista przedziałów cenowych
 */
const generatePriceRanges = () => [];

/**
 * Konwersja tablicy wartości na format opcji
 * @param {Array} values tablica wartości
 * @returns {Array} tablica opcji w formacie {label, value}
 */
const convertToOptions = (values) => {
  return values.map(value => ({
    label: value,
    value: value
  }));
};

/**
 * Konfiguracja grup filtrów
 */
export const filterGroups = {
  bodyType: {
    label: 'Nadwozie',
    options: convertToOptions(bodyTypes)
  },
  make: {
    label: 'Marka',
    options: [], // Wypełniane dynamicznie
    isParent: true,
    childGroup: 'model'
  },
  model: {
    label: 'Model',
    options: [], // Wypełniane dynamicznie
    dependsOn: 'make'
  },
  yearRange: {
    label: 'Rok produkcji',
    options: generateYearRanges(),
    customInput: {
      type: 'range',
      fromName: 'yearFrom',
      toName: 'yearTo'
    }
  },
  price: {
    label: 'Cena',
    options: [],
    customInput: {
      type: 'range',
      fromName: 'priceFrom',
      toName: 'priceTo'
    }
  },
  mileage: {
    label: 'Przebieg',
    options: [
      { label: 'do 10 000 km', value: 'up_to_10k', from: 0, to: 10000 },
      { label: '10 000 - 50 000 km', value: '10k_50k', from: 10000, to: 50000 },
      { label: '50 000 - 100 000 km', value: '50k_100k', from: 50000, to: 100000 },
      { label: '100 000 - 200 000 km', value: '100k_200k', from: 100000, to: 200000 },
      { label: 'powyżej 200 000 km', value: 'above_200k', from: 200000, to: null }
    ],
    customInput: {
      type: 'range',
      fromName: 'mileageFrom',
      toName: 'mileageTo'
    }
  },
  fuelType: {
    label: 'Rodzaj paliwa',
    options: convertToOptions(advancedOptions.fuelType)
  },
  transmission: {
    label: 'Skrzynia biegów',
    options: convertToOptions(advancedOptions.transmission)
  },
  driveType: {
    label: 'Napęd',
    options: convertToOptions(advancedOptions.driveType)
  },
  condition: {
    label: 'Stan',
    options: [
      { label: 'Nowy', value: 'Nowy' },
      { label: 'Używany', value: 'Używany' },
      { label: 'Uszkodzony', value: 'Uszkodzony' }
    ]
  }
};

/**
 * Etykiety filtrów do wyświetlania w ActiveFilters
 */
export const filterLabels = {
  make: 'Marka',
  model: 'Model',
  bodyType: 'Nadwozie',
  yearFrom: 'Rok od',
  yearTo: 'Rok do',
  priceFrom: 'Cena od',
  priceTo: 'Cena do',
  mileageFrom: 'Przebieg od',
  mileageTo: 'Przebieg do',
  fuelType: 'Paliwo',
  transmission: 'Skrzynia biegów',
  driveType: 'Napęd',
  condition: 'Stan pojazdu',
  color: 'Kolor',
  sellerType: 'Sprzedawca',
  region: 'Województwo',
  city: 'Miasto',
  doorCount: 'Liczba drzwi',
  engineCapacityFrom: 'Pojemność od',
  engineCapacityTo: 'Pojemność do',
  enginePowerFrom: 'Moc od',
  enginePowerTo: 'Moc do'
};

export default filterGroups;
