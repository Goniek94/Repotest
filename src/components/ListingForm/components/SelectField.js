import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectField = ({ 
  name, 
  label, 
  options = [], 
  value, 
  onChange, 
  error, 
  required = false, 
  placeholder = 'Wybierz opcję...', 
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (option) => {
    if (onChange) {
      // Jeśli onChange oczekuje event-like object
      if (typeof onChange === 'function') {
        const syntheticEvent = {
          target: {
            name,
            value: option.value || option
          }
        };
        onChange(syntheticEvent);
      }
    }
    setIsOpen(false);
  };

  const displayValue = value || '';
  const displayOptions = options.map(option => 
    typeof option === 'string' ? { label: option, value: option } : option
  );

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full border rounded-[2px] p-3 text-left flex items-center justify-between
            focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]
            transition-colors duration-200
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
            ${displayValue ? 'text-gray-700' : 'text-gray-500'}
          `}
        >
          <span className="truncate">
            {displayValue || placeholder}
          </span>
          <ChevronDown 
            className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            } ${disabled ? 'text-gray-400' : 'text-gray-600'}`} 
          />
        </button>
        
        {isOpen && !disabled && displayOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg max-h-48 overflow-y-auto">
            {displayOptions.map((option, index) => (
              <div 
                key={index}
                className={`
                  px-3 py-2 cursor-pointer transition-colors text-sm
                  ${(option.value || option.label) === displayValue 
                    ? 'bg-[#35530A] text-white' 
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                `}
                onClick={() => handleOptionSelect(option)}
              >
                {option.label || option.value || option}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SelectField;
