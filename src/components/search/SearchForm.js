import React, { lazy, Suspense, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Hook zawierający logikę formularza
import useSearchForm from './hooks/useSearchForm';

// Komponenty podstawowe (zawsze ładowane)
import BasicFilters from './BasicFilters';
import SearchFormButtons from './SearchFormButtons';

// Komponenty zaawansowane (ładowane leniwie)
const EngineFilters = lazy(() => import(/* webpackChunkName: "engine-filters" */ './EngineFilters'));
const SaleFilters = lazy(() => import(/* webpackChunkName: "sale-filters" */ './SaleFilters'));
const BodyFilters = lazy(() => import(/* webpackChunkName: "body-filters" */ './BodyFilters'));

// Preload zaawansowanych filtrów po załadowaniu strony
const preloadAdvancedFilters = () => {
  // Użyj requestIdleCallback do załadowania komponentów w czasie bezczynności
  if (typeof window !== 'undefined') {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        import(/* webpackChunkName: "engine-filters" */ './EngineFilters');
        import(/* webpackChunkName: "sale-filters" */ './SaleFilters');
        import(/* webpackChunkName: "body-filters" */ './BodyFilters');
      });
    } else {
      // Fallback dla przeglądarek bez requestIdleCallback
      setTimeout(() => {
        import(/* webpackChunkName: "engine-filters" */ './EngineFilters');
        import(/* webpackChunkName: "sale-filters" */ './SaleFilters');
        import(/* webpackChunkName: "body-filters" */ './BodyFilters');
      }, 1000);
    }
  }
};

/**
 * Główny komponent formularza wyszukiwania pojazdów
 * @param {Object} props - Właściwości komponentu
 * @param {Object} props.initialValues - Początkowe wartości formularza
 * @returns {JSX.Element} - Komponent formularza wyszukiwania
 */
const SearchForm = ({ initialValues = {} }) => {
  // Użyj hooka z logiką formularza
  const {
    formData,
    availableBrands,
    availableModels,
    loadingBrands,
    showAdvanced,
    setShowAdvanced,
    matchingResults,
    handleInputChange,
    handleSearch
  } = useSearchForm(initialValues);
  
  // Preload zaawansowanych filtrów po załadowaniu komponentu
  useEffect(() => {
    preloadAdvancedFilters();
  }, []);

  // Komponent ładujący dla Suspense
  const LoadingFallback = () => (
    <div className="py-4 text-center text-gray-500">
      <svg className="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Ładowanie filtrów...
    </div>
  );

  return (
    <section className="bg-[#F5F7F9] py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#35530A] text-center mb-5 uppercase">
          Wyszukaj pojazd
        </h2>

        {/* FORMULARZ WYSZUKIWANIA */}
        <div className="bg-white p-5 shadow-md rounded-[2px] mb-4">
          {/* PODSTAWOWE FILTRY */}
          <BasicFilters 
            formData={formData}
            handleInputChange={handleInputChange}
            availableBrands={availableBrands}
            availableModels={availableModels}
            loadingBrands={loadingBrands}
          />

          {/* ZAAWANSOWANE FILTRY - ładowane leniwie */}
          {showAdvanced && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Suspense fallback={<LoadingFallback />}>
                {/* Silnik i napęd */}
                <EngineFilters 
                  formData={formData}
                  handleInputChange={handleInputChange}
                />

                {/* Forma sprzedaży i lokalizacja */}
                <SaleFilters 
                  formData={formData}
                  handleInputChange={handleInputChange}
                />

                {/* Nadwozie */}
                <BodyFilters 
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </Suspense>
            </div>
          )}

          {/* PRZYCISKI FORMULARZA */}
          <SearchFormButtons 
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            handleSearch={handleSearch}
            matchingResults={matchingResults}
          />
        </div>
      </div>
    </section>
  );
};

SearchForm.propTypes = {
  initialValues: PropTypes.object
};

export default SearchForm;
