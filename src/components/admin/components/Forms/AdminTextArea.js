import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const AdminTextArea = ({
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
  textareaClassName = '',
  rows = 4,
  cols = null,
  maxLength = null,
  minLength = null,
  resize = 'vertical',
  autoFocus = false,
  id = null,
  name = null
}) => {
  const [focused, setFocused] = useState(false);

  const getResizeClasses = (resize) => {
    switch (resize) {
      case 'none':
        return 'resize-none';
      case 'vertical':
        return 'resize-y';
      case 'horizontal':
        return 'resize-x';
      case 'both':
        return 'resize';
      default:
        return 'resize-y';
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

  const textareaId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseTextareaClasses = `
    w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : focused ? 'border-green-500' : 'border-gray-300'}
    ${getResizeClasses(resize)}
  `;

  const labelClasses = `
    block text-sm font-medium text-gray-700 mb-1
    ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={textareaId} className={labelClasses}>
          {label}
        </label>
      )}

      {/* Textarea container */}
      <div className="relative">
        {/* Textarea */}
        <textarea
          id={textareaId}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          cols={cols}
          maxLength={maxLength}
          minLength={minLength}
          autoFocus={autoFocus}
          className={`
            ${baseTextareaClasses}
            ${error ? 'pr-10' : ''}
            ${textareaClassName}
          `}
        />

        {/* Error icon */}
        {error && (
          <div className="absolute right-3 top-3 text-red-500">
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
          <p className={`text-xs ${value.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
            {value.length}/{maxLength}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminTextArea;