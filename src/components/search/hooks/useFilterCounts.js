import { useState, useEffect, useCallback } from 'react';
import AdsService from '../../../services/ads';

/**
 * Hook do obsługi kaskadowego filtrowania z licznikami
 * Pobiera liczniki dla wszystkich filtrów na podstawie aktualnych wyborów użytkownika
 */
export const useFilterCounts = (formData, debounceMs = 300) => {
  const [filterCounts, setFilterCounts] = useState({
    brands: {},
    models: {},
    generations: {},
    bodyTypes: {},
    fuelTypes: {},
    transmissions: {},
    driveTypes: {},
    colors: {},
    conditions: {},
    accidentStatuses: {},
    regions: {},
    cities: {},
    yearRanges: {},
    priceRanges: {},
    mileageRanges: {}
  });
  
  const [totalMatching, setTotalMatching] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced function to fetch filter counts
  const fetchFilterCounts = useCallback(
    debounce(async (filters) => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Pobieranie liczników filtrów dla:', filters);
        
        // Prepare parameters for AdsService
        const params = {};
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '' && value !== null && value !== undefined) {
            if (Array.isArray(value) && value.length > 0) {
              // For arrays (checkboxes), join with comma or send as array
              const validValues = value.filter(v => v && v !== '');
              if (validValues.length > 0) {
                params[key] = validValues;
              }
            } else if (!Array.isArray(value)) {
              // For single values
              params[key] = value;
            }
          }
        });
        
        const response = await AdsService.getFilterCounts(params);
        const data = response.data;
        
        console.log('Otrzymane liczniki filtrów:', data);
        
        setFilterCounts(data.filterCounts || {});
        setTotalMatching(data.totalMatching || 0);
        
      } catch (err) {
        console.error('Błąd podczas pobierania liczników filtrów:', err);
        setError(err.message);
        setFilterCounts({
          brands: {},
          models: {},
          generations: {},
          bodyTypes: {},
          fuelTypes: {},
          transmissions: {},
          driveTypes: {},
          colors: {},
          conditions: {},
          accidentStatuses: {},
          regions: {},
          cities: {},
          yearRanges: {},
          priceRanges: {},
          mileageRanges: {}
        });
        setTotalMatching(0);
      } finally {
        setLoading(false);
      }
    }, debounceMs),
    [debounceMs]
  );

  // Effect to fetch counts when formData changes
  useEffect(() => {
    fetchFilterCounts(formData);
  }, [formData, fetchFilterCounts]);

  // Helper functions to get counts for specific filter types
  const getBrandCount = useCallback((brand) => {
    return filterCounts.brands?.[brand] || 0;
  }, [filterCounts.brands]);

  const getModelCount = useCallback((model) => {
    return filterCounts.models?.[model] || 0;
  }, [filterCounts.models]);

  const getGenerationCount = useCallback((generation) => {
    return filterCounts.generations?.[generation] || 0;
  }, [filterCounts.generations]);

  const getBodyTypeCount = useCallback((bodyType) => {
    return filterCounts.bodyTypes?.[bodyType] || 0;
  }, [filterCounts.bodyTypes]);

  const getFuelTypeCount = useCallback((fuelType) => {
    return filterCounts.fuelTypes?.[fuelType] || 0;
  }, [filterCounts.fuelTypes]);

  const getTransmissionCount = useCallback((transmission) => {
    return filterCounts.transmissions?.[transmission] || 0;
  }, [filterCounts.transmissions]);

  const getDriveTypeCount = useCallback((driveType) => {
    return filterCounts.driveTypes?.[driveType] || 0;
  }, [filterCounts.driveTypes]);

  const getColorCount = useCallback((color) => {
    return filterCounts.colors?.[color] || 0;
  }, [filterCounts.colors]);

  const getConditionCount = useCallback((condition) => {
    return filterCounts.conditions?.[condition] || 0;
  }, [filterCounts.conditions]);

  const getAccidentStatusCount = useCallback((accidentStatus) => {
    return filterCounts.accidentStatuses?.[accidentStatus] || 0;
  }, [filterCounts.accidentStatuses]);

  const getRegionCount = useCallback((region) => {
    return filterCounts.regions?.[region] || 0;
  }, [filterCounts.regions]);

  const getCityCount = useCallback((city) => {
    return filterCounts.cities?.[city] || 0;
  }, [filterCounts.cities]);

  // Function to refresh counts manually
  const refreshCounts = useCallback(() => {
    fetchFilterCounts(formData);
  }, [formData, fetchFilterCounts]);

  return {
    // Raw data
    filterCounts,
    totalMatching,
    loading,
    error,
    
    // Helper functions
    getBrandCount,
    getModelCount,
    getGenerationCount,
    getBodyTypeCount,
    getFuelTypeCount,
    getTransmissionCount,
    getDriveTypeCount,
    getColorCount,
    getConditionCount,
    getAccidentStatusCount,
    getRegionCount,
    getCityCount,
    
    // Actions
    refreshCounts
  };
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default useFilterCounts;
