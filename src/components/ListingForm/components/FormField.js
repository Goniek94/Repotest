import React from 'react';

const FormField = ({ 
  type = 'text', 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  min,
  max,
  step,
  className = '',
  disabled = false,
  rows,
  maxLength,
  options = [],
  ...props 
}) => {
  const baseInputClasses = `
    w-full border rounded-[2px] p-3 text-gray-700
    focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]
    transition-colors duration-200
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows || 4}
            maxLength={maxLength}
            className={baseInputClasses}
            {...props}
          />
        );
      
      case 'select':
        return (
          <select
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          >
            <option value="">{placeholder || 'Wybierz opcję...'}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={baseInputClasses}
            {...props}
          />
        );
      
      case 'email':
        return (
          <input
            type="email"
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          />
        );
      
      case 'tel':
        return (
          <input
            type="tel"
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          />
        );
      
      case 'password':
        return (
          <input
            type="password"
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          />
        );
      
      case 'text':
      default:
        return (
          <input
            type="text"
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            className={baseInputClasses}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      {maxLength && type === 'textarea' && (
        <div className="text-sm text-gray-500 text-right mt-1">
          {(value || '').length}/{maxLength} znaków
        </div>
      )}
    </div>
  );
};

export default FormField;
