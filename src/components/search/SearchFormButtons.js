import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Komponent zawierający przyciski formularza wyszukiwania
 * @param {Object} props - Właściwości komponentu
 * @param {boolean} props.showAdvanced - Czy pokazywać zaawansowane filtry
 * @param {Function} props.setShowAdvanced - Funkcja zmieniająca widoczność zaawansowanych filtrów
 * @param {Function} props.handleSearch - Funkcja obsługująca wyszukiwanie
 * @param {number} props.matchingResults - Liczba pasujących wyników
 * @returns {JSX.Element} - Komponent przycisków formularza
 */
const SearchFormButtons = ({ 
  showAdvanced, 
  setShowAdvanced, 
  handleSearch, 
  matchingResults 
}) => {
  // Obsługa kliknięcia przycisku zaawansowanych filtrów
  const toggleAdvanced = React.useCallback(() => {
    setShowAdvanced(prev => !prev);
  }, [setShowAdvanced]);

  // Obsługa kliknięcia przycisku wyszukiwania
  const onSearch = React.useCallback(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
      {/* Przycisk / link „Zaawansowane" */}
      <button
        type="button"
        className="text-[#35530A] text-sm uppercase font-semibold
                   border border-transparent hover:border-[#35530A]
                   hover:bg-white hover:underline
                   px-2 py-1 transition-colors rounded-[2px]"
        onClick={toggleAdvanced}
        aria-expanded={showAdvanced}
        aria-controls="advanced-filters"
      >
        {showAdvanced ? 'Ukryj zaawansowane' : 'Zaawansowane ▼'}
      </button>

      {/* Główny przycisk – Pokaż ogłoszenia */}
      <button
        type="button"
        onClick={onSearch}
        className="bg-[#35530A] text-white rounded-[2px] px-6 py-2
                   text-sm font-bold uppercase hover:bg-[#2D4A06]
                   transition-colors"
        aria-label={`Pokaż ogłoszenia (${matchingResults} wyników)`}
      >
        Pokaż ogłoszenia
        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-[2px]" aria-hidden="true">
          ({matchingResults})
        </span>
      </button>
    </div>
  );
};

SearchFormButtons.propTypes = {
  showAdvanced: PropTypes.bool.isRequired,
  setShowAdvanced: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  matchingResults: PropTypes.number.isRequired
};

// Użycie memo zapobiega niepotrzebnym renderowaniom
export default memo(SearchFormButtons);
