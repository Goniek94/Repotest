import { useState, useEffect, useMemo } from 'react';
import AdsService from '../services/ads';

/**
 * Hook do filtrowania ogłoszeń na frontendzie
 * Pobiera wszystkie ogłoszenia z API i filtruje je lokalnie
 * Dodatkowo wyciąga marki i modele z rzeczywistych ogłoszeń
 */
export const useFrontendFilters = (filters = {}) => {
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobierz wszystkie ogłoszenia przy pierwszym załadowaniu
  useEffect(() => {
    const fetchAllAds = async () => {
      try {
        setLoading(true);
        console.log('🔄 Pobieranie wszystkich ogłoszeń...');
        // Pobierz wszystkie ogłoszenia bez filtrów (duży limit)
        const response = await AdsService.getAll({ limit: 10000 });
        const ads = response.data.ads || [];
        setAllAds(ads);
        setError(null);
        
        console.log(`✅ Pobrano ${ads.length} ogłoszeń`);
        console.log('🔍 Przykładowe ogłoszenie:', ads[0]);
      } catch (err) {
        console.error('❌ Błąd podczas pobierania ogłoszeń:', err);
        setError(err.message);
        setAllAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAds();
  }, []);

  // Wyciągnij unikalne marki i modele z pobranych ogłoszeń
  const { availableBrands, availableModels } = useMemo(() => {
    if (!allAds.length) return { availableBrands: [], availableModels: {} };

    const brands = [...new Set(allAds.map(ad => ad.brand).filter(Boolean))].sort();
    const models = {};
    
    brands.forEach(brand => {
      models[brand] = [...new Set(
        allAds.filter(ad => ad.brand === brand)
               .map(ad => ad.model)
               .filter(Boolean)
      )].sort();
    });

    console.log('🏷️ Dostępne marki:', brands);
    console.log('🚗 Dostępne modele:', models);

    return { availableBrands: brands, availableModels: models };
  }, [allAds]);

  // Funkcja do parsowania zakresu mocy silnika
  const parseEnginePowerRange = (range) => {
    if (!range) return { min: null, max: null };
    
    if (range === 'do 60 KM') return { min: 0, max: 60 };
    if (range === '60-80 KM') return { min: 60, max: 80 };
    if (range === '80-100 KM') return { min: 80, max: 100 };
    if (range === '100-120 KM') return { min: 100, max: 120 };
    if (range === '120-150 KM') return { min: 120, max: 150 };
    if (range === '150-200 KM') return { min: 150, max: 200 };
    if (range === '200-250 KM') return { min: 200, max: 250 };
    if (range === '250-300 KM') return { min: 250, max: 300 };
    if (range === '300+ KM') return { min: 300, max: null };
    
    return { min: null, max: null };
  };

  // Funkcja filtrowania ogłoszeń - obsługuje wszystkie filtry
  const filterAds = (ads, filters) => {
    return ads.filter(ad => {
      // Filtr marki (brand w API)
      if (filters.make && ad.brand !== filters.make) {
        return false;
      }

      // Filtr modelu
      if (filters.model && ad.model !== filters.model) {
        return false;
      }

      // Filtr rodzaju paliwa
      if (filters.fuelType && ad.fuelType !== filters.fuelType) {
        return false;
      }

      // Filtr skrzyni biegów
      if (filters.transmission && ad.transmission !== filters.transmission) {
        return false;
      }

      // Filtr ceny - od
      if (filters.priceFrom && ad.price < parseFloat(filters.priceFrom)) {
        return false;
      }

      // Filtr ceny - do
      if (filters.priceTo && ad.price > parseFloat(filters.priceTo)) {
        return false;
      }

      // Filtr roku - od
      if (filters.yearFrom && ad.year < parseInt(filters.yearFrom)) {
        return false;
      }

      // Filtr roku - do
      if (filters.yearTo && ad.year > parseInt(filters.yearTo)) {
        return false;
      }

      // Filtr przebiegu - od
      if (filters.mileageFrom && ad.mileage < parseInt(filters.mileageFrom)) {
        return false;
      }

      // Filtr przebiegu - do
      if (filters.mileageTo && ad.mileage > parseInt(filters.mileageTo)) {
        return false;
      }

      // Filtr zakresu mocy silnika
      if (filters.enginePowerRange && ad.power) {
        const { min, max } = parseEnginePowerRange(filters.enginePowerRange);
        if (min !== null && ad.power < min) return false;
        if (max !== null && ad.power > max) return false;
      }

      // Filtr pojemności silnika - od
      if (filters.engineCapacityFrom && ad.engineCapacity && ad.engineCapacity < parseInt(filters.engineCapacityFrom)) {
        return false;
      }

      // Filtr pojemności silnika - do
      if (filters.engineCapacityTo && ad.engineCapacity && ad.engineCapacity > parseInt(filters.engineCapacityTo)) {
        return false;
      }

      // Filtr wagi pojazdu - od
      if (filters.weightFrom && ad.weight && ad.weight < parseInt(filters.weightFrom)) {
        return false;
      }

      // Filtr wagi pojazdu - do
      if (filters.weightTo && ad.weight && ad.weight > parseInt(filters.weightTo)) {
        return false;
      }

      // Filtr napędu
      if (filters.driveType && ad.driveType !== filters.driveType) {
        return false;
      }

      // Filtr stanu technicznego
      if (filters.condition && ad.condition !== filters.condition) {
        return false;
      }

      // Filtr wypadkowości
      if (filters.accidentStatus && ad.accidentStatus !== filters.accidentStatus) {
        return false;
      }

      // Filtr uszkodzeń
      if (filters.damageStatus && ad.damageStatus !== filters.damageStatus) {
        return false;
      }

      // Filtr tuningu
      if (filters.tuning && ad.tuning !== filters.tuning) {
        return false;
      }

      // Filtr kraju pochodzenia
      if (filters.countryOfOrigin && ad.countryOfOrigin !== filters.countryOfOrigin) {
        return false;
      }

      // Filtr wykończenia lakieru
      if (filters.finish && ad.finish !== filters.finish) {
        return false;
      }

      // Filtr typu sprzedawcy
      if (filters.sellerType && ad.sellerType !== filters.sellerType) {
        return false;
      }

      // Filtry Tak/Nie (teraz jako selecty)
      if (filters.imported === 'Tak' && !ad.imported) {
        return false;
      }
      if (filters.imported === 'Nie' && ad.imported) {
        return false;
      }

      if (filters.registeredInPL === 'Tak' && !ad.registeredInPL) {
        return false;
      }
      if (filters.registeredInPL === 'Nie' && ad.registeredInPL) {
        return false;
      }

      if (filters.firstOwner === 'Tak' && !ad.firstOwner) {
        return false;
      }
      if (filters.firstOwner === 'Nie' && ad.firstOwner) {
        return false;
      }

      if (filters.disabledAdapted === 'Tak' && !ad.disabledAdapted) {
        return false;
      }
      if (filters.disabledAdapted === 'Nie' && ad.disabledAdapted) {
        return false;
      }

      // Filtr statusu ogłoszenia (tylko aktywne)
      if (ad.status !== 'active') {
        return false;
      }

      return true;
    });
  };

  // Przefiltrowane ogłoszenia na podstawie aktualnych filtrów
  const filteredAds = useMemo(() => {
    if (!allAds.length) return [];
    
    // Usuń puste filtry
    const cleanFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        cleanFilters[key] = value;
      }
    });

    return filterAds(allAds, cleanFilters);
  }, [allAds, filters]);

  return {
    allAds,
    filteredAds,
    loading,
    error,
    totalCount: allAds.length,
    filteredCount: filteredAds.length,
    // Dodatkowe dane wyciągnięte z ogłoszeń
    availableBrands,
    availableModels
  };
};

export default useFrontendFilters;
