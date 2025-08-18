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
  // Simple getters don't need useCallback - they're fast and don't cause re-renders
  const getBrandCount = (brand) => filterCounts.brands?.[brand] || 0;
  const getModelCount = (model) => filterCounts.models?.[model] || 0;
  const getGenerationCount = (generation) => filterCounts.generations?.[generation] || 0;
  const getBodyTypeCount = (bodyType) => filterCounts.bodyTypes?.[bodyType] || 0;
  const getFuelTypeCount = (fuelType) => filterCounts.fuelTypes?.[fuelType] || 0;
  const getTransmissionCount = (transmission) => filterCounts.transmissions?.[transmission] || 0;
  const getDriveTypeCount = (driveType) => filterCounts.driveTypes?.[driveType] || 0;
  const getColorCount = (color) => filterCounts.colors?.[color] || 0;
  const getConditionCount = (condition) => filterCounts.conditions?.[condition] || 0;
  const getAccidentStatusCount = (accidentStatus) => filterCounts.accidentStatuses?.[accidentStatus] || 0;
  const getRegionCount = (region) => filterCounts.regions?.[region] || 0;
  const getCityCount = (city) => filterCounts.cities?.[city] || 0;

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
