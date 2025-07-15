import React, { useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

const AdminSelect = ({
  label = '',
  placeholder = 'Wybierz opcję...',
  value = '',
  onChange = null,
  onBlur = null,
  onFocus = null,
  options = [],
  required = false,
  disabled = false,
  error = null,
  helperText = '',
  className = '',
  selectClassName = '',
  size = 'medium',
  multiple = false,
  searchable = false,
  clearable = false,
  loading = false,
  id = null,
  name = null
}) => {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm';
      case 'medium':
        return 'px-3 py-2 text-sm';
      case 'large':
        return 'px-4 py-3 text-base';
      default:
        return 'px-3 py-2 text-sm';
    }
  };

  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleChange = (e) => {
    if (onChange) {
      if (multiple) {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        onChange(selectedOptions);
      } else {
        onChange(e.target.value);
      }
    }
  };

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseSelectClasses = `
    w-full border rounded-lg transition-all duration-200 appearance-none
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : focused ? 'border-green-500' : 'border-gray-300'}
    ${getSizeClasses(size)}
    ${multiple ? 'pr-3' : 'pr-10'}
  `;

  const labelClasses = `
    block text-sm font-medium text-gray-700 mb-1
    ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={selectId} className={labelClasses}>
          {label}
        </label>
      )}

      {/* Select container */}
      <div className="relative">
        {/* Search input for searchable select */}
        {searchable && (
          <input
            type="text"
            placeholder="Szukaj opcji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        )}

        {/* Select */}
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          disabled={disabled || loading}
          multiple={multiple}
          className={`
            ${baseSelectClasses}
            ${searchable ? 'rounded-t-none border-t-0' : ''}
            ${selectClassName}
          `}
        >
          {/* Placeholder option */}
          {!multiple && placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {/* Loading option */}
          {loading && (
            <option value="" disabled>
              Ładowanie...
            </option>
          )}

          {/* Options */}
          {!loading && filteredOptions.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}

          {/* No options found */}
          {!loading && searchable && filteredOptions.length === 0 && (
            <option value="" disabled>
              Nie znaleziono opcji
            </option>
          )}
        </select>

        {/* Dropdown arrow */}
        {!multiple && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        )}

        {/* Error icon */}
        {error && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle size={16} />
          </div>
        )}
      </div>

      {/* Helper text or error */}
      {(helperText || error) && (
        <div className="flex items-center space-x-1">
          {error && <AlertCircle size={14} className="text-red-500" />}
          <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        </div>
      )}

      {/* Multiple selection display */}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((val) => {
            const option = options.find(opt => opt.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
              >
                {option?.label || val}
                {clearable && (
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = value.filter(v => v !== val);
                      if (onChange) {
                        onChange(newValue);
                      }
                    }}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminSelect;