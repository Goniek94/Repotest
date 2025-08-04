import React from 'react';
import { FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';

const InputText = ({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur,
  error, 
  required = false, 
  placeholder = '', 
  type = 'text',
  maxLength,
  isChecking = false,
  isValid = false
}) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
          required={required}
        />
        {isChecking && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaSpinner className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
        {!isChecking && isValid && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaCheck className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <FaTimes className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

export default InputText;
