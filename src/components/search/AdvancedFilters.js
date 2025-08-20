// AdvancedFilters.js
import React, { useState } from "react";
import { enginePowerRanges, engineCapacityRanges, weightRanges } from "./SearchFormConstants";
import SearchableDropdown from './SearchableDropdown';

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
  carData = {},
  resetAllFilters
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
  const fuelTypes = advancedOptions?.fuelType || [];
  const transmissionTypes = advancedOptions?.transmission || [];
  const bodyTypes = advancedOptions?.bodyType || [];
  const colors = advancedOptions?.color || [];
  const seatOptions = advancedOptions?.seats || [];
  
  // Dostępne marki z carData
  const availableBrands = Object.keys(carData || {}).sort();
  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4">
        {/* Typ paliwa */}
        <RadioFilter
          name="fuelType"
          label="Typ paliwa"
          options={fuelTypes || []}
        />
        
        {/* Skrzynia biegów */}
        <RadioFilter
          name="transmission"
          label="Skrzynia biegów"
          options={transmissionTypes || []}
        />
        
        
        {/* Typ nadwozia */}
        <RadioFilter
          name="bodyType"
          label="Typ nadwozia"
          options={bodyTypes || []}
        />
        
        {/* Kolor - SearchableDropdown */}
        <SearchableDropdown
          name="color"
          label="Kolor"
          options={colors || []}
          placeholder="Wybierz kolor"
          value={formData.color ? [formData.color] : []}
          onChange={(e) => handleInputChange({ target: { name: e.target.name, value: e.target.value[0] || '' } })}
          multiSelect={false}
        />
        
        {/* Wykończenie lakieru - SearchableDropdown */}
        <SearchableDropdown
          name="finish"
          label="Wykończenie lakieru"
          options={finishTypes || []}
          placeholder="Wybierz wykończenie"
          value={formData.finish ? [formData.finish] : []}
          onChange={(e) => handleInputChange({ target: { name: e.target.name, value: e.target.value[0] || '' } })}
          multiSelect={false}
        />
        
        {/* Liczba drzwi */}
        <RadioFilter
          name="doorCount"
          label="Liczba drzwi"
          options={advancedOptions?.doorCount || []}
        />
        
        {/* Liczba miejsc */}
        <RadioFilter
          name="seats"
          label="Liczba miejsc"
          options={seatOptions || []}
        />
        
        {/* Moc silnika - Od/Do Selecty z ograniczoną wysokością */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Moc silnika (KM)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {/* Od - moc silnika */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleChecklist('enginePowerFrom')}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
              >
                <span className={`${formData.enginePowerFrom ? 'text-gray-700' : 'text-gray-500'}`}>
                  {formData.enginePowerFrom ? enginePowerRanges.find(p => p.value === formData.enginePowerFrom)?.label || formData.enginePowerFrom : 'Od'}
                </span>
                <span className={`transform transition-transform ${openChecklists.enginePowerFrom ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openChecklists.enginePowerFrom && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
                  <div 
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => {
                      handleInputChange({ target: { name: 'enginePowerFrom', value: '' } });
                      setOpenChecklists(prev => ({ ...prev, enginePowerFrom: false }));
                    }}
                  >
                    Od
                  </div>
                  {enginePowerRanges.map((power) => (
                    <div 
                      key={power.value}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => {
                        handleInputChange({ target: { name: 'enginePowerFrom', value: power.value } });
                        setOpenChecklists(prev => ({ ...prev, enginePowerFrom: false }));
                      }}
                    >
                      {power.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Do - moc silnika */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleChecklist('enginePowerTo')}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
              >
                <span className={`${formData.enginePowerTo ? 'text-gray-700' : 'text-gray-500'}`}>
                  {formData.enginePowerTo ? enginePowerRanges.find(p => p.value === formData.enginePowerTo)?.label || formData.enginePowerTo : 'Do'}
                </span>
                <span className={`transform transition-transform ${openChecklists.enginePowerTo ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openChecklists.enginePowerTo && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
                  <div 
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => {
                      handleInputChange({ target: { name: 'enginePowerTo', value: '' } });
                      setOpenChecklists(prev => ({ ...prev, enginePowerTo: false }));
                    }}
                  >
                    Do
                  </div>
                  {enginePowerRanges.map((power) => (
                    <div 
                      key={power.value}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => {
                        handleInputChange({ target: { name: 'enginePowerTo', value: power.value } });
                        setOpenChecklists(prev => ({ ...prev, enginePowerTo: false }));
                      }}
                    >
                      {power.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Pojemność silnika - Od/Do Selecty z ograniczoną wysokością */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Pojemność silnika (cm³)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {/* Od - pojemność silnika */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleChecklist('engineCapacityFrom')}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
              >
                <span className={`${formData.engineCapacityFrom ? 'text-gray-700' : 'text-gray-500'}`}>
                  {formData.engineCapacityFrom ? engineCapacityRanges.find(c => c.value === formData.engineCapacityFrom)?.label || formData.engineCapacityFrom : 'Od'}
                </span>
                <span className={`transform transition-transform ${openChecklists.engineCapacityFrom ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openChecklists.engineCapacityFrom && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
                  <div 
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => {
                      handleInputChange({ target: { name: 'engineCapacityFrom', value: '' } });
                      setOpenChecklists(prev => ({ ...prev, engineCapacityFrom: false }));
                    }}
                  >
                    Od
                  </div>
                  {engineCapacityRanges.map((capacity) => (
                    <div 
                      key={capacity.value}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => {
                        handleInputChange({ target: { name: 'engineCapacityFrom', value: capacity.value } });
                        setOpenChecklists(prev => ({ ...prev, engineCapacityFrom: false }));
                      }}
                    >
                      {capacity.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Do - pojemność silnika */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleChecklist('engineCapacityTo')}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
              >
                <span className={`${formData.engineCapacityTo ? 'text-gray-700' : 'text-gray-500'}`}>
                  {formData.engineCapacityTo ? engineCapacityRanges.find(c => c.value === formData.engineCapacityTo)?.label || formData.engineCapacityTo : 'Do'}
                </span>
                <span className={`transform transition-transform ${openChecklists.engineCapacityTo ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openChecklists.engineCapacityTo && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
                  <div 
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => {
                      handleInputChange({ target: { name: 'engineCapacityTo', value: '' } });
                      setOpenChecklists(prev => ({ ...prev, engineCapacityTo: false }));
                    }}
                  >
                    Do
                  </div>
                  {engineCapacityRanges.map((capacity) => (
                    <div 
                      key={capacity.value}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => {
                        handleInputChange({ target: { name: 'engineCapacityTo', value: capacity.value } });
                        setOpenChecklists(prev => ({ ...prev, engineCapacityTo: false }));
                      }}
                    >
                      {capacity.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stan techniczny */}
        <RadioFilter
          name="condition"
          label="Stan techniczny"
          options={conditions || []}
        />

        {/* Wypadkowość */}
        <RadioFilter
          name="accidentStatus"
          label="Wypadkowość"
          options={accidentStatuses || []}
        />

        {/* Stan uszkodzeń */}
        <RadioFilter
          name="damageStatus"
          label="Uszkodzenia"
          options={damageStatuses || []}
        />

        {/* Tuning */}
        <RadioFilter
          name="tuning"
          label="Tuning"
          options={tuningOptions || []}
        />
        
        {/* Kraj pochodzenia - SearchableDropdown */}
        <SearchableDropdown
          name="countryOfOrigin"
          label="Kraj pochodzenia"
          options={countriesOfOrigin || []}
          placeholder="Wybierz kraj pochodzenia"
          value={formData.countryOfOrigin ? [formData.countryOfOrigin] : []}
          onChange={(e) => handleInputChange({ target: { name: e.target.name, value: e.target.value[0] || '' } })}
          multiSelect={false}
        />
        
        {/* Typ sprzedawcy - SearchableDropdown */}
        <SearchableDropdown
          name="sellerType"
          label="Typ sprzedawcy"
          options={sellerTypes || []}
          placeholder="Wybierz typ sprzedawcy"
          value={formData.sellerType ? [formData.sellerType] : []}
          onChange={(e) => handleInputChange({ target: { name: e.target.name, value: e.target.value[0] || '' } })}
          multiSelect={false}
        />
        
        {/* Waga pojazdu - Od/Do Selecty z ograniczoną wysokością */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Waga pojazdu (kg)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {/* Od - waga pojazdu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleChecklist('weightFrom')}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
              >
                <span className={`${formData.weightFrom ? 'text-gray-700' : 'text-gray-500'}`}>
                  {formData.weightFrom ? weightRanges.find(w => w.value === formData.weightFrom)?.label || formData.weightFrom : 'Od'}
                </span>
                <span className={`transform transition-transform ${openChecklists.weightFrom ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openChecklists.weightFrom && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
                  <div 
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => {
                      handleInputChange({ target: { name: 'weightFrom', value: '' } });
                      setOpenChecklists(prev => ({ ...prev, weightFrom: false }));
                    }}
                  >
                    Od
                  </div>
                  {weightRanges.map((weight) => (
                    <div 
                      key={weight.value}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => {
                        handleInputChange({ target: { name: 'weightFrom', value: weight.value } });
                        setOpenChecklists(prev => ({ ...prev, weightFrom: false }));
                      }}
                    >
                      {weight.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Do - waga pojazdu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleChecklist('weightTo')}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
              >
                <span className={`${formData.weightTo ? 'text-gray-700' : 'text-gray-500'}`}>
                  {formData.weightTo ? weightRanges.find(w => w.value === formData.weightTo)?.label || formData.weightTo : 'Do'}
                </span>
                <span className={`transform transition-transform ${openChecklists.weightTo ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openChecklists.weightTo && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
                  <div 
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => {
                      handleInputChange({ target: { name: 'weightTo', value: '' } });
                      setOpenChecklists(prev => ({ ...prev, weightTo: false }));
                    }}
                  >
                    Do
                  </div>
                  {weightRanges.map((weight) => (
                    <div 
                      key={weight.value}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => {
                        handleInputChange({ target: { name: 'weightTo', value: weight.value } });
                        setOpenChecklists(prev => ({ ...prev, weightTo: false }));
                      }}
                    >
                      {weight.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Importowany */}
        <RadioFilter
          name="imported"
          label="Importowany"
          options={advancedOptions?.imported || []}
        />
        
        {/* Zarejestrowany w PL */}
        <RadioFilter
          name="registeredInPL"
          label="Zarejestrowany w PL"
          options={advancedOptions?.registeredInPL || []}
        />
        
        {/* Pierwszy właściciel */}
        <RadioFilter
          name="firstOwner"
          label="Pierwszy właściciel"
          options={advancedOptions?.firstOwner || []}
        />
        
        {/* Przystosowany dla niepełnosprawnych */}
        <RadioFilter
          name="disabledAdapted"
          label="Przystosowany dla niepełnosprawnych"
          options={advancedOptions?.disabledAdapted || []}
        />
      </div>

      {/* PRZYCISK RESET FILTRÓW */}
      <div className="pt-4 mt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={resetAllFilters}
          className="px-4 py-2 text-sm text-[#35530A] hover:text-[#2a4208] border border-[#35530A] rounded-[2px] hover:bg-[#35530A]/5 transition-colors"
        >
          Wyczyść wszystkie filtry
        </button>
      </div>
    </div>
  );
}
