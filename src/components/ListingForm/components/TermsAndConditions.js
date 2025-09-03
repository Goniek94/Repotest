import React from 'react';

const TermsAndConditions = ({ 
  acceptedTerms, 
  setAcceptedTerms, 
  carConditionConfirmed, 
  setCarConditionConfirmed 
}) => {
  return (
    <div className="space-y-4">
        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 accent-[#35530A]"
          />
          <span className="text-sm text-gray-700">
            Oświadczam, że zapoznałem(-am) się z <b>Regulaminem serwisu</b> i akceptuję jego postanowienia.
          </span>
        </label>

        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={carConditionConfirmed}
            onChange={(e) => setCarConditionConfirmed(e.target.checked)}
            className="mt-1 accent-[#35530A]"
          />
          <span className="text-sm text-gray-700">
            Oświadczam, że stan samochodu jest zgodny z opisem i stanem faktycznym.
          </span>
        </label>
    </div>
  );
};

export default TermsAndConditions;
