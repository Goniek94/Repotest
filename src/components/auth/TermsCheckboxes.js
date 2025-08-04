import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TermsCheckboxes = ({ 
  termsAccepted, 
  dataProcessingAccepted, 
  marketingAccepted, 
  onChange, 
  error 
}) => {
  return (
    <div className="space-y-4 border-t pt-6">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={termsAccepted}
            onChange={onChange}
            className="h-5 w-5 text-[#35530A] border-gray-300 rounded focus:ring-[#35530A]"
            required
          />
        </div>
        <label className="ml-3 text-sm text-gray-700">
          * Oświadczam, że zapoznałem się z{' '}
          <a href="/regulamin" className="text-[#35530A] hover:text-[#2D4A06] font-medium">
            regulaminem
          </a>{' '}
          i akceptuję jego postanowienia
        </label>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            name="dataProcessingAccepted"
            checked={dataProcessingAccepted}
            onChange={onChange}
            className="h-5 w-5 text-[#35530A] border-gray-300 rounded focus:ring-[#35530A]"
            required
          />
        </div>
        <label className="ml-3 text-sm text-gray-700">
          * Wyrażam zgodę na przetwarzanie moich danych osobowych
          zgodnie z{' '}
          <a href="/polityka-prywatnosci" className="text-[#35530A] hover:text-[#2D4A06] font-medium">
            polityką prywatności
          </a>
        </label>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            name="marketingAccepted"
            checked={marketingAccepted}
            onChange={onChange}
            className="h-5 w-5 text-[#35530A] border-gray-300 rounded focus:ring-[#35530A]"
          />
        </div>
        <label className="ml-3 text-sm text-gray-700">
          Wyrażam zgodę na otrzymywanie informacji marketingowych i handlowych drogą elektroniczną
        </label>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <FaTimes className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

export default TermsCheckboxes;
