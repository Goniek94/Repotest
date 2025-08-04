import React from 'react';
import { FaEye, FaEyeSlash, FaTimes, FaCheck } from 'react-icons/fa';

const InputPassword = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  showPassword,
  togglePasswordVisibility,
  showConfirmation = false,
  confirmValue = '',
  placeholder = ''
}) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
          required={required}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#35530A] focus:outline-none"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      
      {/* Password confirmation indicator */}
      {showConfirmation && value && confirmValue && (
        <div className="mt-2 flex items-center">
          {value === confirmValue ? (
            <>
              <FaCheck className="text-green-500 mr-2" />
              <span className="text-sm text-green-500">Hasła są zgodne</span>
            </>
          ) : (
            <>
              <FaTimes className="text-red-500 mr-2" />
              <span className="text-sm text-red-500">Hasła nie są zgodne</span>
            </>
          )}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <FaTimes className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

export default InputPassword;
