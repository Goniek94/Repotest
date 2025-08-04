import React from 'react';
import { FaTimes } from 'react-icons/fa';

const DatePicker = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  minAge = 16,
  maxAge = 100
}) => {
  // Calculate min and max dates based on age requirements
  const today = new Date();
  const maxDate = new Date(today.setFullYear(today.getFullYear() - minAge)).toISOString().split('T')[0];
  const minDate = new Date(today.setFullYear(today.getFullYear() - maxAge + minAge)).toISOString().split('T')[0];

  return (
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
        {label} {required && '*'} (musisz mieć {minAge}-{maxAge} lat)
      </label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
        required={required}
        max={maxDate}
        min={minDate}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <FaTimes className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

export default DatePicker;
