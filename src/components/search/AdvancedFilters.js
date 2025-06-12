// AdvancedFilters.js
import React, { useState } from "react";

/**
 * AdvancedFilters component - zoptymalizowany z checklistami jak w BasicFilters
 * @param {object} props
 * @returns {JSX.Element}
 */
export default function AdvancedFilters({
  formData,
  handleInputChange,
  advancedOptions,
  regions,
  carData = {}
}) {
  // State do zarządzania otwartymi/zamkniętymi checklistami
  const [openChecklists, setOpenChecklists] = useState({});

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

  // Funkcja do obsługi zmian w radio buttonach
  const handleRadioChange = (name, value) => {
    handleInputChange({
      target: {
        name,
        value
      }
    });
  };

  // Komponent checklisty
  const ChecklistFilter = ({ name, label, options, placeholder }) => (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleChecklist(name)}
          className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
        >
          <span className="text-gray-500">
            {formData[name]?.length > 0 
              ? `Wybrano: ${formData[name].length}` 
              : placeholder
            }
          </span>
          <span className={`transform transition-transform ${openChecklists[name] ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {openChecklists[name] && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
            {options.map((option) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Komponent dla zakresów (cena, przebieg, rok)
  const RangeFilter = ({ nameFrom, nameTo, label, unit = "" }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          name={nameFrom}
          placeholder={`Od${unit ? ` (${unit})` : ""}`}
          min="0"
          value={formData[nameFrom] || ''}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
        />
        <input
          type="number"
          name={nameTo}
          placeholder={`Do${unit ? ` (${unit})` : ""}`}
          min="0"
          value={formData[nameTo] || ''}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
        />
      </div>
    </div>
  );

  // Komponent dla checkboxów
  const CheckboxFilter = ({ name, label }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        &nbsp;
      </label>
      <div className="flex items-center h-10">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={formData[name] || false}
          onChange={handleInputChange}
          className="mr-2 text-[#35530A] focus:ring-[#35530A] border-gray-300 rounded"
        />
        <label htmlFor={name} className="text-sm">
          {label}
        </label>
      </div>
    </div>
  );

  // Komponent dla radio buttonów
  const RadioFilter = ({ name, label, options }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleChecklist(name)}
          className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
        >
          <span className="text-gray-500">
            {formData[name] 
              ? formData[name] 
              : `Wybierz ${label.toLowerCase()}`
            }
          </span>
          <span className={`transform transition-transform ${openChecklists[name] ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {openChecklists[name] && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
            {options.map((option) => (
              <label 
                key={option} 
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={formData[name] === option}
                  onChange={() => handleRadioChange(name, option)}
                  className="mr-2 text-[#35530A] focus:ring-[#35530A] border-gray-300"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Dostępne opcje
  const driveTypes = advancedOptions?.driveType || [];
  const conditions = advancedOptions?.condition || [];
  const accidentStatuses = advancedOptions?.accidentStatus || [];
  const damageStatuses = advancedOptions?.damageStatus || [];
  const tuningOptions = advancedOptions?.tuning || [];
  const countriesOfOrigin = advancedOptions?.countryOfOrigin || [];
  const finishTypes = advancedOptions?.finish || [];
  const sellerTypes = advancedOptions?.sellerType || [];
  
  // Dostępne marki z carData
  const availableBrands = Object.keys(carData || {}).sort();
  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4">
        {/* Napęd */}
        <RadioFilter
          name="driveType"
          label="Napęd"
          options={driveTypes}
        />
        
        {/* Moc silnika */}
        <RangeFilter
          nameFrom="enginePowerFrom"
          nameTo="enginePowerTo"
          label="Moc silnika"
          unit="KM"
        />
        {/* Dodatkowy wybór marek - użyteczne dla zaawansowanego filtrowania */}
        {availableBrands.length > 0 && (
          <ChecklistFilter
            name="make"
            label="Marka (zaawansowane)"
            options={availableBrands}
            placeholder="Wybierz markę"
          />
        )}
        {/* Pojemność silnika */}
        <RangeFilter
          nameFrom="engineCapacityFrom"
          nameTo="engineCapacityTo"
          label="Pojemność silnika"
          unit="cm³"
        />
        
        {/* Stan techniczny */}
        <ChecklistFilter
          name="condition"
          label="Stan techniczny"
          options={conditions}
          placeholder="Wybierz stan"
        />

        {/* Wypadkowość */}
        <RadioFilter
          name="accidentStatus"
          label="Wypadkowość"
          options={accidentStatuses}
        />

        {/* Stan uszkodzeń */}
        <RadioFilter
          name="damageStatus"
          label="Uszkodzenia"
          options={damageStatuses}
        />

        {/* Tuning */}
        <RadioFilter
          name="tuning"
          label="Tuning"
          options={tuningOptions}
        />
        
        {/* Kraj pochodzenia */}
        <ChecklistFilter
          name="countryOfOrigin"
          label="Kraj pochodzenia"
          options={countriesOfOrigin}
          placeholder="Wybierz kraj"
        />
        
        {/* Wykończenie lakieru */}
        <ChecklistFilter
          name="finish"
          label="Wykończenie lakieru"
          options={finishTypes}
          placeholder="Wybierz wykończenie"
        />
        
        {/* Waga pojazdu */}
        <RangeFilter
          nameFrom="weightFrom"
          nameTo="weightTo"
          label="Waga pojazdu"
          unit="kg"
        />
        
        {/* Typ sprzedawcy */}
        <RadioFilter
          name="sellerType"
          label="Typ sprzedawcy"
          options={sellerTypes}
        />
        
        {/* Importowany */}
        <CheckboxFilter 
          name="imported" 
          label="Importowany" 
        />
        
        {/* Zarejestrowany w PL */}
        <CheckboxFilter 
          name="registeredInPL" 
          label="Zarejestrowany w PL" 
        />
        
        {/* Pierwszy właściciel */}
        <CheckboxFilter 
          name="firstOwner" 
          label="Pierwszy właściciel" 
        />
        
        {/* Przystosowany dla niepełnosprawnych */}
        <CheckboxFilter 
          name="disabledAdapted" 
          label="Przystosowany dla niepełnosprawnych" 
        />
      </div>

      {/* PRZYCISK RESET FILTRÓW */}
      <div className="pt-4 mt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            // Lista pól w zaawansowanych filtrach do zresetowania
            const advancedFilterFields = [
              'driveType', 'enginePowerFrom', 'enginePowerTo', 'engineCapacityFrom', 'engineCapacityTo',
              'condition', 'accidentStatus', 'damageStatus', 'tuning', 'countryOfOrigin',
              'finish', 'weightFrom', 'weightTo', 'sellerType', 'imported', 
              'registeredInPL', 'firstOwner', 'disabledAdapted'
            ];
            
            // Stwórz obiekt z wyzerowanymi wartościami
            const resetValues = advancedFilterFields.reduce((acc, field) => {
              // Dla checkboxów ustawiamy false, dla pozostałych pól - pustą wartość
              if (['imported', 'registeredInPL', 'firstOwner', 'disabledAdapted'].includes(field)) {
                acc[field] = false;
              } else {
                acc[field] = Array.isArray(formData[field]) ? [] : '';
              }
              return acc;
            }, {});
            
            // Zresetuj każde pole używając handleInputChange
            Object.entries(resetValues).forEach(([name, value]) => {
              handleInputChange({
                target: { name, value }
              });
            });
          }}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-[2px] hover:bg-gray-50 transition-colors"
        >
          Wyczyść wszystkie filtry
        </button>
      </div>
    </div>
  );
}