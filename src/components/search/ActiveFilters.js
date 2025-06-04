// ActiveFilters.js
import React from 'react';

/**
 * Komponent wyświetlający aktywne filtry jako tagi, które można kliknąć, aby je usunąć
 * @param {object} props
 * @param {object} props.formData - dane formularza z aktywnymi filtrami
 * @param {function} props.removeFilter - funkcja do usuwania filtra (name, value)
 * @param {object} props.filterLabels - mapa nazw filtrów do etykiet wyświetlanych
 * @returns {JSX.Element}
 */
const ActiveFilters = ({ formData, removeFilter, filterLabels = {} }) => {
  // Filtry, które chcemy pokazać jako tagi (pomijamy puste wartości)
  const activeFilters = Object.entries(formData).filter(([_, value]) => {
    if (value === '' || value === null || value === undefined) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  if (activeFilters.length === 0) return null;

  // Formatowanie wartości do wyświetlenia
  const formatValue = (name, value) => {
    if (typeof value === 'boolean') return value ? 'Tak' : 'Nie';
    
    if (name.includes('From')) {
      const baseName = name.replace('From', '');
      const label = filterLabels[baseName] || baseName;
      return `${label} od: ${value}`;
    }
    
    if (name.includes('To')) {
      const baseName = name.replace('To', '');
      const label = filterLabels[baseName] || baseName;
      return `${label} do: ${value}`;
    }
    
    return value;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <span className="text-sm font-medium text-gray-600">Aktywne filtry:</span>
      {activeFilters.map(([name, value]) => {
        const label = filterLabels[name] || name;
        const displayValue = formatValue(name, value);
        
        return (
          <div 
            key={`${name}-${value}`}
            className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm"
          >
            <span className="mr-1 font-medium">{label}:</span> 
            <span>{displayValue}</span>
            <button
              type="button"
              onClick={() => removeFilter(name, value)}
              className="ml-2 text-gray-500 hover:text-red-500"
              aria-label={`Usuń filtr ${label}`}
            >
              ×
            </button>
          </div>
        );
      })}
      <button 
        type="button"
        onClick={() => removeFilter('all')}
        className="text-sm text-[#35530A] hover:underline ml-2"
      >
        Wyczyść wszystkie
      </button>
    </div>
  );
};

export default ActiveFilters;