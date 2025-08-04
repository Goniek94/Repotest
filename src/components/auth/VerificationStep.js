import React from 'react';
import { FaInfoCircle, FaTimes, FaSpinner } from 'react-icons/fa';

const VerificationStep = ({ 
  type, 
  phonePrefix, 
  phone, 
  email, 
  code, 
  onChange, 
  onSendCode, 
  onBack, 
  error, 
  verificationTimer, 
  isSubmitting 
}) => {
  const displayContact = type === 'phone' ? `${phonePrefix}${phone}` : email;
  const codeFieldName = `${type}Code`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Weryfikacja {type === 'phone' ? 'numeru telefonu' : 'adresu email'}
        </h3>
        <p className="text-gray-600 mb-4">
          Wprowadź kod weryfikacyjny wysłany na {displayContact}
        </p>
        <div className="bg-blue-50 p-3 rounded text-blue-800 mb-4 text-sm">
          <p className="font-medium flex items-center">
            <FaInfoCircle className="mr-2" /> 🎭 SYMULACJA:
          </p>
          <p>
            To jest SYMULACJA - weryfikacja przebiega automatycznie. 
            Użyj kodu <span className="font-bold">123456</span> aby kontynuować.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          name={codeFieldName}
          value={code}
          onChange={onChange}
          placeholder="Wprowadź kod"
          className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
          maxLength="6"
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaTimes className="mr-1" /> {error}
          </p>
        )}

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onSendCode}
            disabled={verificationTimer > 0 || isSubmitting}
            className="text-[#35530A] hover:text-[#2D4A06] font-medium disabled:text-gray-400"
          >
            {verificationTimer > 0
              ? `Wyślij ponownie (${verificationTimer}s)`
              : 'Wyślij ponownie kod'}
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 border border-[#35530A] text-[#35530A] hover:bg-gray-50 font-bold py-3 px-4 rounded uppercase transition-colors"
        >
          Wstecz
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-2/3 bg-[#35530A] hover:bg-[#2D4A06] text-white font-bold py-3 px-4 rounded uppercase transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Weryfikacja...
            </>
          ) : (
            'Weryfikuj'
          )}
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;
