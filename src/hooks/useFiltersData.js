import { useState, useEffect } from 'react';
import { 
  FUEL_TYPES, 
  TRANSMISSION_TYPES, 
  DRIVE_TYPES, 
  COUNTRIES, 
  COLORS,
  PRICE_RANGES,
  MILEAGE_RANGES,
  BOOLEAN_OPTIONS
} from '../constants/vehicleOptions';

/**
 * Hook do zarządzania wszystkimi danymi filtrów
 * Używa tylko statycznych danych z vehicleOptions.js
 * Marki i modele będą pobierane z useFrontendFilters (z rzeczywistych ogłoszeń)
 */
export const useFiltersData = () => {
  const [bodyTypes, setBodyTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState({});
  const [loading, setLoading] = useState({
    bodyTypes: false,
    brands: false,
    filtersData: false
  });
  const [error, setError] = useState(null);

  // Inicjalizacja statycznych danych
  useEffect(() => {
    console.log('🔄 Inicjalizuję statyczne dane filtrów...');
    setLoading(prev => ({ ...prev, filtersData: true }));
    
    try {
      // Używamy statycznych danych z vehicleOptions
      const staticBodyTypes = ['Sedan', 'Hatchback', 'SUV', 'Kombi', 'Coupé', 'Cabrio', 'Terenowe', 'Minivan'];
      const staticBrands = ['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Opel', 'Peugeot', 'Renault', 'Kia', 'Hyundai', 'Volvo', 'Skoda', 'Seat', 'Fiat', 'Citroen', 'Mazda', 'Nissan', 'Mitsubishi'];
      
      setBodyTypes(staticBodyTypes);
      setBrands(staticBrands);
      setModels({}); // Modele będą pobierane dynamicznie z ogłoszeń
      
      console.log('✅ Załadowano statyczne dane filtrów:', {
        brands: staticBrands.length,
        bodyTypes: staticBodyTypes.length
      });
      
      setError(null);
    } catch (err) {
      console.error('❌ Błąd podczas inicjalizacji danych filtrów:', err);
      setError('Nie udało się zainicjalizować danych filtrów');
    } finally {
      setLoading(prev => ({ ...prev, filtersData: false }));
      console.log('✅ Zakończono inicjalizację danych filtrów');
    }
  }, []);

  // Funkcja do generowania opcji dla dropdownów z zakresami
  const generateRangeOptions = (ranges, placeholder = 'Wybierz zakres') => {
    return [
      { label: placeholder, value: '' },
      ...ranges.map(range => ({
        label: range.label,
        value: range.value
      }))
    ];
  };

  // Funkcja do generowania opcji dla zwykłych dropdownów
  const generateSelectOptions = (options, placeholder = 'Wybierz opcję') => {
    return [
      { label: placeholder, value: '' },
      ...options.map(option => ({
        label: option,
        value: option
      }))
    ];
  };

  // Funkcja do generowania opcji boolean (Tak/Nie/Bez znaczenia)
  const generateBooleanOptions = (placeholder = 'Wybierz opcję') => {
    return [
      { label: placeholder, value: '' },
      { label: 'Tak', value: true },
      { label: 'Nie', value: false },
      { label: 'Bez znaczenia', value: '' }
    ];
  };

  return {
    // Dane dynamiczne z backendu
    brands,
    models,
    bodyTypes,
    
    // Dane statyczne z constants
    fuelTypes: FUEL_TYPES,
    transmissionTypes: TRANSMISSION_TYPES,
    driveTypes: DRIVE_TYPES,
    countries: COUNTRIES,
    colors: COLORS,
    priceRanges: PRICE_RANGES,
    mileageRanges: MILEAGE_RANGES,
    booleanOptions: BOOLEAN_OPTIONS,
    
    // Stany ładowania
    loading,
    error,
    
    // Funkcje pomocnicze do generowania opcji dla dropdownów
    generateRangeOptions,
    generateSelectOptions,
    generateBooleanOptions,
    
    // Gotowe opcje dla dropdownów
    priceRangeOptions: generateRangeOptions(PRICE_RANGES, 'Wybierz zakres ceny'),
    mileageRangeOptions: generateRangeOptions(MILEAGE_RANGES, 'Wybierz zakres przebiegu'),
    fuelTypeOptions: generateSelectOptions(FUEL_TYPES, 'Wybierz typ paliwa'),
    transmissionOptions: generateSelectOptions(TRANSMISSION_TYPES, 'Wybierz skrzynię biegów'),
    driveTypeOptions: generateSelectOptions(DRIVE_TYPES, 'Wybierz napęd'),
    bodyTypeOptions: generateSelectOptions(bodyTypes, 'Wybierz typ nadwozia'),
    countryOptions: generateSelectOptions(COUNTRIES, 'Wybierz kraj pochodzenia'),
    colorOptions: generateSelectOptions(COLORS, 'Wybierz kolor'),
    brandOptions: generateSelectOptions(brands, 'Wybierz markę'),
    
    // Opcje boolean dla różnych filtrów
    damagedOptions: generateBooleanOptions('Uszkodzony?'),
    registeredOptions: generateBooleanOptions('Zarejestrowany?'),
    firstOwnerOptions: generateBooleanOptions('Pierwszy właściciel?'),
    
    // Funkcje pomocnicze
    isLoadingBodyTypes: loading.bodyTypes,
    isLoadingFiltersData: loading.filtersData
  };
};

export default useFiltersData;
