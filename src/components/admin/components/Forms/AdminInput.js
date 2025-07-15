import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const AdminInput = ({
  type = 'text',
  label = '',
  placeholder = '',
  value = '',
  onChange = null,
  onBlur = null,
  onFocus = null,
  required = false,
  disabled = false,
  error = null,
  helperText = '',
  className = '',
  inputClassName = '',
  size = 'medium',
  icon: Icon = null,
  iconPosition = 'left',
  showPasswordToggle = false,
  maxLength = null,
  minLength = null,
  pattern = null,
  autoComplete = null,
  autoFocus = false,
  id = null,
  name = null
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

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
      onChange(e);
    }
  };

  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const baseInputClasses = `
    w-full border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : focused ? 'border-green-500' : 'border-gray-300'}
    ${getSizeClasses(size)}
  `;

  const labelClasses = `
    block text-sm font-medium text-gray-700 mb-1
    ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={16} />
          </div>
        )}

        {/* Input */}
        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={`
            ${baseInputClasses}
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${(type === 'password' && showPasswordToggle) || error ? 'pr-10' : ''}
            ${inputClassName}
          `}
        />

        {/* Right icon */}
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={16} />
          </div>
        )}

        {/* Password toggle */}
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {/* Error icon */}
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
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

      {/* Character count */}
      {maxLength && (
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminInput;