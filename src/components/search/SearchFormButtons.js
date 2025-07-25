// SearchFormButtons.js
import React from "react";
import { useNavigate } from 'react-router-dom';

/**
 * SearchFormButtons component - zaktualizowany z przekierowaniem na /listings
 * @param {object} props
 * @returns {JSX.Element}
 */
export default function SearchFormButtons({
  formData,
  showAdvanced,
  setShowAdvanced,
  handleSearch,
  matchingResults = 0,
  totalResults,
  loading = false
}) {
  const navigate = useNavigate();

  // Funkcja do przekierowania na stronę listings z parametrami wyszukiwania
  const handleShowListings = () => {
    // Stwórz URL params z wszystkich filtrów
    const params = new URLSearchParams();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value && value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // Dla tablic (checkboxów), dodaj każdą wartość osobno
          value.forEach(v => {
            if (v && v !== '') {
              params.append(key, v);
            }
          });
        } else {
          // Dla pojedynczych wartości
          params.set(key, value);
        }
      }
    });
    
    console.log('Przekierowanie na /listings z parametrami:', params.toString());
    
    // Przekieruj na /listings z parametrami
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Przycisk / link „Zaawansowane" */}
        <button
          type="button"
          className="text-[#35530A] text-sm uppercase font-semibold
                     border border-transparent hover:border-[#35530A]
                     hover:bg-white hover:underline
                     px-2 py-1 transition-colors rounded-[2px]"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Ukryj zaawansowane" : "Zaawansowane ▼"}
        </button>

        {/* Główny przycisk – Pokaż ogłoszenia z przekierowaniem */}
        <button
          type="button"
          onClick={handleShowListings}
          disabled={loading}
          className="bg-[#35530A] text-white rounded-[2px] px-6 py-2
                     text-sm font-bold uppercase hover:bg-[#2D4A06]
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center min-w-[200px]"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wyszukiwanie...
            </span>
          ) : (
            <>
              Pokaż ogłoszenia
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-[2px]">
                ({matchingResults.toLocaleString()})
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
