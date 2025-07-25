import { useState, useEffect, useCallback } from 'react';
import AdsService from '../../../services/ads';

/**
 * Hook do zarządzania statystykami wyszukiwania w czasie rzeczywistym
 * Pobiera liczniki marek i modeli na podstawie aktualnych filtrów
 */
const useSearchStats = (filters = {}) => {
  const [stats, setStats] = useState({
    totalCount: 0,
    brandCounts: {},
    modelCounts: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funkcja do pobierania statystyk
  const fetchStats = useCallback(async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Pobieranie statystyk wyszukiwania z filtrami:', searchFilters);
      
      const response = await AdsService.getSearchStats(searchFilters);
      
      console.log('Otrzymane statystyki:', response.data);
      
      setStats({
        totalCount: response.data.totalCount || 0,
        brandCounts: response.data.brandCounts || {},
        modelCounts: response.data.modelCounts || {}
      });
      
    } catch (err) {
      console.error('Błąd podczas pobierania statystyk wyszukiwania:', err);
      setError(err.message || 'Błąd podczas pobierania statystyk');
      
      // Ustaw puste statystyki w przypadku błędu
      setStats({
        totalCount: 0,
        brandCounts: {},
        modelCounts: {}
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Pobierz statystyki przy zmianie filtrów
  useEffect(() => {
    // Debounce - opóźnij wywołanie o 300ms
    const timeoutId = setTimeout(() => {
      fetchStats(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, fetchStats]);

  // Funkcja do ręcznego odświeżenia statystyk
  const refreshStats = useCallback(() => {
    fetchStats(filters);
  }, [filters, fetchStats]);

  // Funkcja pomocnicza do formatowania liczników z nawiasami
  const formatBrandCount = useCallback((brand) => {
    const count = stats.brandCounts[brand];
    return count ? `${brand} (${count})` : brand;
  }, [stats.brandCounts]);

  const formatModelCount = useCallback((brand, model) => {
    const count = stats.modelCounts[brand]?.[model];
    return count ? `${model} (${count})` : model;
  }, [stats.modelCounts]);

  // Funkcja do pobierania dostępnych marek (z licznikami > 0)
  const getAvailableBrands = useCallback(() => {
    return Object.keys(stats.brandCounts).filter(brand => stats.brandCounts[brand] > 0);
  }, [stats.brandCounts]);

  // Funkcja do pobierania dostępnych modeli dla marki (z licznikami > 0)
  const getAvailableModels = useCallback((brand) => {
    if (!brand || !stats.modelCounts[brand]) return [];
    return Object.keys(stats.modelCounts[brand]).filter(model => stats.modelCounts[brand][model] > 0);
  }, [stats.modelCounts]);

  return {
    stats,
    loading,
    error,
    refreshStats,
    formatBrandCount,
    formatModelCount,
    getAvailableBrands,
    getAvailableModels
  };
};

export default useSearchStats;
