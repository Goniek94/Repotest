import React from 'react';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

const PasswordStrength = ({ 
  password, 
  passwordStrength, 
  showPasswordInfo, 
  togglePasswordInfo 
}) => {
  const getPasswordStrengthClass = () => {
    const { length, uppercase, lowercase, number, special } = passwordStrength;
    const strength = [length, uppercase, lowercase, number, special].filter(Boolean).length;
    if (strength === 0) return '';
    if (strength < 3) return 'bg-red-500';
    if (strength < 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={togglePasswordInfo}
          className="text-sm text-[#35530A] hover:underline flex items-center"
        >
          <FaInfoCircle className="mr-1" /> Wymagania hasła
        </button>
      </div>

      {showPasswordInfo && (
        <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded">
          <p className="text-sm font-medium mb-2">Hasło musi zawierać:</p>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center">
              {passwordStrength.length ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              Co najmniej 8 znaków
            </li>
            <li className="flex items-center">
              {passwordStrength.uppercase ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              Przynajmniej jedną wielką literę
            </li>
            <li className="flex items-center">
              {passwordStrength.lowercase ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              Przynajmniej jedną małą literę
            </li>
            <li className="flex items-center">
              {passwordStrength.number ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              Przynajmniej jedną cyfrę
            </li>
            <li className="flex items-center">
              {passwordStrength.special ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              Przynajmniej jeden znak specjalny <strong>(!@#$%^&*(),.?":{`|<>`})</strong>
            </li>
          </ul>
        </div>
      )}

      {/* Password strength bar */}
      {password && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full mt-2">
            <div
              className={`h-full rounded-full ${getPasswordStrengthClass()}`}
              style={{
                width: `${Object.values(passwordStrength).filter(Boolean).length * 20}%`
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
