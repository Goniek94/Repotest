// SearchableDropdown.js
import React, { useState, useRef, useEffect } from 'react';

/**
 * Komponent dropdown z możliwością wyszukiwania
 * @param {object} props
 * @param {string} props.name - nazwa pola
 * @param {string} props.label - etykieta pola
 * @param {Array} props.options - lista opcji do wyboru
 * @param {string} props.placeholder - placeholder
 * @param {Array} props.value - wybrane wartości (dla multi-select)
 * @param {function} props.onChange - funkcja obsługująca zmiany
 * @param {boolean} props.multiSelect - czy pozwalać na wielokrotny wybór
 * @param {boolean} props.disabled - czy pole jest wyłączone
 * @param {function} props.formatOption - funkcja formatująca opcje (np. z licznikami)
 * @returns {JSX.Element}
 */
export default function SearchableDropdown({
  name,
  label,
  options = [],
  placeholder,
  value = [],
  onChange,
  multiSelect = true,
  disabled = false,
  formatOption = (option) => option
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filtruj opcje na podstawie wyszukiwanego tekstu
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Zamknij dropdown przy kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obsługa zmiany w polu wyszukiwania
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Obsługa wyboru opcji
  const handleOptionSelect = (option) => {
    if (multiSelect) {
      const isSelected = value.includes(option);
      let newValue;
      
      if (isSelected) {
        newValue = value.filter(v => v !== option);
      } else {
        newValue = [...value, option];
      }
      
      onChange({
        target: {
          name,
          value: newValue
        }
      });
    } else {
      onChange({
        target: {
          name,
          value: option
        }
      });
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Obsługa kliknięcia na główny przycisk
  const handleButtonClick = () => {
    if (disabled) return;
    
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Obsługa klawiatury
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length === 1) {
        handleOptionSelect(filteredOptions[0]);
      }
    }
  };

  // Formatowanie wyświetlania wybranych opcji
  const formatSelectedOptions = () => {
    if (multiSelect) {
      if (value.length === 0) {
        return placeholder;
      } else if (value.length === 1) {
        return value[0];
      } else if (value.length <= 2) {
        return value.join(', ');
      } else {
        return `Wybrano: ${value.length}`;
      }
    } else {
      return value || placeholder;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={handleButtonClick}
          className={`w-full h-10 text-sm px-3 border ${
            disabled 
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 bg-white cursor-pointer'
          } rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] text-left flex items-center justify-between`}
          disabled={disabled}
        >
          <span className={`${
            (multiSelect ? value.length > 0 : value) ? 'text-gray-700' : 'text-gray-500'
          } truncate max-w-[90%]`}>
            {formatSelectedOptions()}
          </span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg">
            {/* Pole wyszukiwania */}
            <div className="p-2 border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder={`Szukaj ${label.toLowerCase()}...`}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-[#35530A] focus:border-[#35530A] outline-none"
              />
            </div>

            {/* Lista opcji */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <label 
                    key={option} 
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type={multiSelect ? "checkbox" : "radio"}
                      name={name}
                      checked={multiSelect ? value.includes(option) : value === option}
                      onChange={() => handleOptionSelect(option)}
                      className="mr-2 text-[#35530A] focus:ring-[#35530A] border-gray-300 rounded"
                    />
                    <span className="text-sm">{formatOption(option)}</span>
                  </label>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 italic">
                  {searchTerm ? `Brak wyników dla "${searchTerm}"` : 'Brak dostępnych opcji'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
