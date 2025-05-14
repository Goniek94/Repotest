import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carData, defaultFormValues } from '../../../data/searchFormData';
import apiClient from '../../../services/api/client';

/**
 * Hook zawierający logikę formularza wyszukiwania
 * @param {Object} initialValues - Początkowe wartości formularza
 * @returns {Object} - Dane i funkcje formularza
 */
export const useSearchForm = (initialValues = {}) => {
  const navigate = useNavigate();

  // Dane formularza
  const [formData, setFormData] = useState(() => ({
    ...defaultFormValues,
    ...initialValues
  }));

  // Lista dostępnych marek i modeli
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Czy pokazywać zaawansowane filtry
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Rzeczywista liczba pasujących ogłoszeń
  const [matchingResults, setMatchingResults] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  // Funkcja pobierająca rzeczywistą liczbę pasujących ogłoszeń z API
  const fetchMatchingResultsCount = async (currentFormData) => {
    try {
      setIsLoadingCount(true);
      
      // Budowanie parametrów zapytania
      const params = new URLSearchParams();
      
      // Przygotuj dane do wyszukiwania
      const searchData = { ...currentFormData };
      
      // Obsługa niestandardowej marki
      if (currentFormData.make === 'Inne' && currentFormData.customMake) {
        searchData.make = currentFormData.customMake;
      }
      
      // Obsługa niestandardowego modelu
      if (currentFormData.model === 'Inny model' && currentFormData.customModel) {
        searchData.model = currentFormData.customModel;
      }
      
      // Dodaj tylko niepuste wartości do parametrów
      Object.entries(searchData).forEach(([key, value]) => {
        // Pomijamy customMake i customModel, ponieważ zostały już uwzględnione
        if (key === 'customMake' || key === 'customModel') {
          return;
        }
        
        if (value !== '' && value !== null && value !== undefined) {
          // Konwertuj wartości boolowskie na stringi
          if (typeof value === 'boolean') {
            params.append(key, value.toString());
          } else {
            params.append(key, value);
          }
        }
      });
      
      // Dodaj limit=0, aby pobrać tylko liczbę ogłoszeń bez samych ogłoszeń
      params.append('limit', '0');
      
      // Wywołaj API używając apiClient zamiast fetch
      const response = await apiClient.get(`/api/ads/search`, { params });
      const data = response.data;
      
      // Ustaw liczbę pasujących ogłoszeń
      setMatchingResults(data.totalAds || 0);
    } catch (error) {
      console.error('Błąd podczas pobierania liczby pasujących ogłoszeń:', error);
      setMatchingResults(0);
    } finally {
      setIsLoadingCount(false);
    }
  };

  // Funkcja pobierająca dostępne marki z API
  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      const response = await apiClient.get('/api/ads/brands');
      const data = response.data;
      
      if (Array.isArray(data)) {
        setAvailableBrands(data);
      } else {
        // Fallback do statycznych danych, jeśli API nie zwróci tablicy
        setAvailableBrands(Object.keys(carData));
      }
    } catch (error) {
      console.error('Błąd podczas pobierania marek:', error);
      // Fallback do statycznych danych w przypadku błędu
      setAvailableBrands(Object.keys(carData));
    } finally {
      setLoadingBrands(false);
    }
  };

  // Funkcja pobierająca dostępne modele dla wybranej marki z API
  const fetchModels = async (brand) => {
    if (!brand) {
      setAvailableModels([]);
      return;
    }
    
    try {
      setLoadingModels(true);
      const response = await apiClient.get(`/api/ads/models`, { params: { brand } });
      const data = response.data;
      
      if (Array.isArray(data)) {
        setAvailableModels(data);
      } else {
        // Fallback do statycznych danych, jeśli API nie zwróci tablicy
        setAvailableModels(carData[brand] || []);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania modeli:', error);
      // Fallback do statycznych danych w przypadku błędu
      setAvailableModels(carData[brand] || []);
    } finally {
      setLoadingModels(false);
    }
  };

  // Pobierz dostępne marki przy pierwszym renderowaniu
  useEffect(() => {
    fetchBrands();
  }, []);

  // Aktualizuj dostępne modele na podstawie wybranej marki
  useEffect(() => {
    fetchModels(formData.make);
  }, [formData.make]);

  // Pobierz liczbę pasujących ogłoszeń przy zmianie formData
  useEffect(() => {
    // Dodajemy opóźnienie, aby nie wysyłać zapytania przy każdej zmianie
    const timer = setTimeout(() => {
      fetchMatchingResultsCount(formData);
    }, 800); // Zwiększone opóźnienie dla mniejszej liczby zapytań
    
    return () => clearTimeout(timer);
  }, [formData]);
  
  // Memoizacja funkcji handleInputChange dla lepszej wydajności
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      // Nie pozwalamy na wartości ujemne w polach numerycznych
      let finalValue = value;
      if (['priceFrom', 'priceTo', 'mileageFrom', 'mileageTo', 'enginePowerFrom', 'enginePowerTo', 'engineCapacityFrom', 'engineCapacityTo'].includes(name)) {
        if (Number(value) < 0) finalValue = 0;
      }
      
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  // Obsługa przycisku "Pokaż ogłoszenia"
  const handleSearch = () => {
    // Budowanie parametrów URL z formularza
    const searchParams = new URLSearchParams();
    
    // Przygotuj dane do wyszukiwania
    const searchData = { ...formData };
    
    // Obsługa niestandardowej marki
    if (formData.make === 'Inne' && formData.customMake) {
      searchData.make = formData.customMake;
    }
    
    // Obsługa niestandardowego modelu
    if (formData.model === 'Inny model' && formData.customModel) {
      searchData.model = formData.customModel;
    }
    
    // Dodaj tylko niepuste wartości do parametrów URL
    Object.entries(searchData).forEach(([key, value]) => {
      // Pomijamy customMake i customModel, ponieważ zostały już uwzględnione
      if (key === 'customMake' || key === 'customModel') {
        return;
      }
      
      if (value !== '' && value !== null && value !== undefined) {
        // Konwertuj wartości boolowskie na stringi
        if (typeof value === 'boolean') {
          searchParams.append(key, value.toString());
        } else {
          searchParams.append(key, value);
        }
      }
    });
    
    // Dodaj parametr sortowania według trafności
    searchParams.append('sortBy', 'relevance');
    
    // Przekieruj na stronę wyników z parametrami
    navigate(`/listings?${searchParams.toString()}`);
  };

  return {
    formData,
    availableBrands,
    availableModels,
    loadingBrands,
    loadingModels,
    showAdvanced,
    setShowAdvanced,
    matchingResults,
    isLoadingCount,
    handleInputChange,
    handleSearch
  };
};

export default useSearchForm;
