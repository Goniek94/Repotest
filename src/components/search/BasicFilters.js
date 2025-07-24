// BasicFilters.js
import React, { useState, useEffect } from "react";
import { regionToCities, priceRanges, mileageRanges, generateYearOptions } from "./SearchFormConstants";

/**
 * BasicFilters component with optimized checklist filters
 * @param {object} props
 * @returns {JSX.Element}
 */
export default function BasicFilters({
  formData,
  handleInputChange,
  carData,
  bodyTypes,
  availableModels,
  generateYearOptions,
  advancedOptions,
  regions,
  getGenerationsForModel,
}) {
  // State do zarządzania otwartymi/zamkniętymi checklistami
  const [openChecklists, setOpenChecklists] = useState({});
  
  // State dla dostępnych miast, zależny od wybranego województwa
  const [availableCities, setAvailableCities] = useState([]);
  
  // State dla dostępnych generacji, zależny od wybranej marki i modelu
  const [availableGenerations, setAvailableGenerations] = useState([]);
  
  // Aktualizacja dostępnych miast, gdy zmienia się wybrane województwo
  useEffect(() => {
    if (formData.region && formData.region.length > 0) {
      const selectedRegions = formData.region;
      let cities = [];
      
      // Zbierz miasta ze wszystkich wybranych województw
      selectedRegions.forEach(region => {
        if (regionToCities[region]) {
          cities = [...cities, ...regionToCities[region]];
        }
      });
      
      // Usuń duplikaty i posortuj
      cities = [...new Set(cities)].sort();
      setAvailableCities(cities);
      
      // Zresetuj wybrane miasta, jeśli nie należą do nowego zestawu województw
      if (formData.city && formData.city.length > 0) {
        const validCities = formData.city.filter(city => cities.includes(city));
        if (validCities.length !== formData.city.length) {
          handleInputChange({
            target: {
              name: 'city',
              value: validCities
            }
          });
        }
      }
    } else {
      // Jeśli nie wybrano województwa, wyczyść listę miast
      setAvailableCities([]);
      
      // Zresetuj wybrane miasta, jeśli jakieś były wybrane
      if (formData.city && formData.city.length > 0) {
        handleInputChange({
          target: {
            name: 'city',
            value: []
          }
        });
      }
    }
  }, [formData.region]);

  // Aktualizacja dostępnych generacji, gdy zmienia się wybrana marka i model
  useEffect(() => {
    const updateGenerations = async () => {
      if (formData.make && formData.make.length === 1 && formData.model && formData.model.length === 1 && getGenerationsForModel) {
        try {
          const generations = await getGenerationsForModel(formData.make[0], formData.model[0]);
          setAvailableGenerations(generations || []);
          console.log(`Pobrano generacje dla ${formData.make[0]} ${formData.model[0]}:`, generations);
        } catch (error) {
          console.warn('Błąd podczas pobierania generacji:', error);
          setAvailableGenerations([]);
        }
      } else {
        setAvailableGenerations([]);
        
        // Zresetuj wybrane generacje, jeśli jakieś były wybrane
        if (formData.generation && formData.generation.length > 0) {
          handleInputChange({
            target: {
              name: 'generation',
              value: []
            }
          });
        }
      }
    };
    
    updateGenerations();
  }, [formData.make, formData.model, getGenerationsForModel]);

  const toggleChecklist = (filterName) => {
    setOpenChecklists(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Funkcja do obsługi zmian w checklistach (wielokrotny wybór)
  const handleChecklistChange = (filterName, value, isChecked) => {
    const currentValues = formData[filterName] || [];
    let newValues;
    
    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    handleInputChange({
      target: {
        name: filterName,
        value: newValues
      }
    });
  };

  // Komponent checklisty z lepszym wyświetlaniem wybranych opcji
  const ChecklistFilter = ({ name, label, options = [], placeholder }) => {
    // Dodajemy diagnostykę dla listy modeli
    const isModelFilter = name === 'model';
    const isDisabled = isModelFilter && formData.make.length === 0;
    // Funkcja formatująca wyświetlanie wybranych opcji
    const formatSelectedOptions = () => {
      const selected = formData[name] || [];
      
      if (selected.length === 0) {
        return placeholder;
      } else if (selected.length === 1) {
        return selected[0];
      } else if (selected.length <= 2) {
        return selected.join(', ');
      } else {
        return `Wybrano: ${selected.length}`;
      }
    };
    
    return (
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          {/* Dodajemy wskaźnik dostępności dla modeli */}
          <button
            type="button"
            onClick={() => toggleChecklist(name)}
            className={`w-full h-10 text-sm px-3 border ${isDisabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white'} rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] text-left flex items-center justify-between ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={isDisabled}
          >
            <span className={`${formData[name]?.length > 0 ? 'text-gray-700' : 'text-gray-500'} truncate max-w-[90%]`}>
              {formatSelectedOptions()}
            </span>
            <span className={`transform transition-transform ${openChecklists[name] ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {/* Pokazujemy listę tylko jeśli nie jest to model bez wybranej marki */}
          {openChecklists[name] && !isDisabled && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
              {options.length > 0 ? (
                options.map((option) => (
                  <label 
                    key={option} 
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData[name]?.includes(option) || false}
                      onChange={(e) => handleChecklistChange(name, option, e.target.checked)}
                      className="mr-2 text-[#35530A] focus:ring-[#35530A] border-gray-300 rounded"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 italic">
                  Brak dostępnych opcji
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4">
      
      {/* Nadwozie - Checklist */}
      <ChecklistFilter
        name="bodyType"
        label="Nadwozie"
        options={bodyTypes}
        placeholder="Wybierz typ nadwozia"
      />

      {/* Marka - Checklist */}
      <ChecklistFilter
        name="make"
        label="Marka"
        options={Object.keys(carData)}
        placeholder="Wybierz markę"
      />

      {/* Model - Checklist (zależny od marki) */}
      <ChecklistFilter
        name="model"
        label="Model"
        options={availableModels}
        placeholder={formData.make?.length > 0 ? "Wybierz model" : "Najpierw wybierz markę"}
      />

      {/* Generacja - Checklist (zależny od marki i modelu) */}
      <ChecklistFilter
        name="generation"
        label="Generacja"
        options={availableGenerations}
        placeholder={
          formData.make?.length === 1 && formData.model?.length === 1 
            ? "Wybierz generację" 
            : "Najpierw wybierz jedną markę i jeden model"
        }
      />

      {/* Rok produkcji - Od/Do Selecty */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Rok produkcji
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            name="yearFrom"
            value={formData.yearFrom || ''}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Od</option>
            {generateYearOptions(1900).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            name="yearTo"
            value={formData.yearTo || ''}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Do</option>
            {generateYearOptions(1900).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cena - Od/Do Selecty */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Cena (PLN)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            name="priceFrom"
            value={formData.priceFrom || ''}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Od</option>
            {priceRanges.map((price) => (
              <option key={price.value} value={price.value}>
                {price.label}
              </option>
            ))}
          </select>
          <select
            name="priceTo"
            value={formData.priceTo || ''}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Do</option>
            {priceRanges.map((price) => (
              <option key={price.value} value={price.value}>
                {price.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Przebieg - Od/Do Selecty */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Przebieg (km)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            name="mileageFrom"
            value={formData.mileageFrom || ''}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Od</option>
            {mileageRanges.map((mileage) => (
              <option key={mileage.value} value={mileage.value}>
                {mileage.label}
              </option>
            ))}
          </select>
          <select
            name="mileageTo"
            value={formData.mileageTo || ''}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Do</option>
            {mileageRanges.map((mileage) => (
              <option key={mileage.value} value={mileage.value}>
                {mileage.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rodzaj paliwa - Checklist */}
      <ChecklistFilter
        name="fuelType"
        label="Rodzaj paliwa"
        options={advancedOptions?.fuelType || []}
        placeholder="Wybierz rodzaj paliwa"
      />

      {/* Skrzynia biegów - Checklist */}
      <ChecklistFilter
        name="transmission"
        label="Skrzynia biegów"
        options={advancedOptions?.transmission || []}
        placeholder="Wybierz skrzynię biegów"
      />

      {/* Województwo - Checklist */}
      <ChecklistFilter
        name="region"
        label="Województwo"
        options={regions || []}
        placeholder="Wybierz województwo"
      />

      {/* Miasto - Checklist */}
      <ChecklistFilter
        name="city"
        label="Miasto"
        options={availableCities}
        placeholder={formData.region?.length > 0 ? "Wybierz miasto" : "Najpierw wybierz województwo"}
      />

      {/* Kolor - Checklist */}
      <ChecklistFilter
        name="color"
        label="Kolor"
        options={advancedOptions?.color || []}
        placeholder="Wybierz kolor"
      />
      
    </div>
  );
}
