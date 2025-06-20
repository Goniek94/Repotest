import React from 'react';

/**
 * Reusable SelectField component for dropdown selects across form sections
 * 
 * @param {object} props Component props
 * @param {string} props.name Field name
 * @param {string} props.label Field label
 * @param {Array} props.options Array of options to display in the dropdown
 * @param {string} props.value Current field value
 * @param {function} props.onChange Function to call when an option is selected
 * @param {object} props.openDropdowns State object tracking open dropdowns
 * @param {function} props.toggleDropdown Function to toggle dropdown open/closed
 * @param {boolean} props.required Whether the field is required
 * @param {string} props.error Error message for the field
 * @param {boolean} props.disabled Whether the field is disabled
 * @param {string} props.placeholder Placeholder text when no value is selected
 * @returns {JSX.Element}
 */
const SelectField = ({ 
  name, 
  label, 
  options, 
  value, 
  onChange, 
  openDropdowns, 
  toggleDropdown, 
  required = false, 
  error = null, 
  disabled = false,
  placeholder = "Wybierz"
}) => {
  return (
    <div className="relative">
      <label className="block font-semibold mb-3 text-gray-800 flex items-center">
        <span>{label}</span>
        {required && <span className="text-red-500 ml-1 inline-flex items-center">*</span>}
        {error && <span className="text-red-500 ml-1 text-sm inline-flex items-center">({error})</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown(name)}
          disabled={disabled}
          className={`w-full h-10 text-sm px-3 border ${error ? 'border-red-500' : disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300'} rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className={`${value ? 'text-gray-700' : 'text-gray-500'}`}>
            {value || placeholder}
          </span>
          <span className={`transform transition-transform ${openDropdowns[name] ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {openDropdowns[name] && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg overflow-y-auto max-h-48">
            {options && options.length > 0 ? (
              options.map((option) => (
                <div 
                  key={option} 
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onChange(name, option)}
                >
                  <span className={`text-sm ${value === option ? 'font-semibold text-[#35530A]' : ''}`}>
                    {option}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 italic">
                Brak dostępnych opcji
              </div>
            )}
          </div>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
};

export default SelectField;
