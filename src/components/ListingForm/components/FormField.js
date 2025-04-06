import React from 'react';
/**
 * Uniwersalny komponent pola formularza
 * Obsługuje różne typy pól: text, number, select, textarea
 */
const FormField = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  options = [],
  disabled = false,
  min,
  max,
  maxLength,
  className = '',
  required = false
}) => {
  // Wspólne klasy CSS dla wszystkich typów pól
  const baseClasses = `
    w-full p-2 border rounded-[2px]
    focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
  `;
  
  // Renderowanie label-a
  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <label className="block mb-1 font-bold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {error && <span className="text-red-500 ml-1 text-sm">({error})</span>}
      </label>
    );
  };
  
  // Renderowanie pola w zależności od typu
  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e)}
            disabled={disabled}
            className={baseClasses}
          >
            <option value="">{placeholder || '---'}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e)}
            placeholder={placeholder}
            disabled={disabled}
            className={baseClasses}
            rows="4"
            maxLength={maxLength}
          ></textarea>
        );
        
      default:
        return (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e)}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            maxLength={maxLength}
            className={baseClasses}
          />
        );
    }
  };
  
  // Renderowanie błędu
  const renderError = () => {
    if (!error) return null;
    
    return (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    );
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      {renderLabel()}
      {renderField()}
      {renderError()}
    </div>
  );
};

export default FormField;