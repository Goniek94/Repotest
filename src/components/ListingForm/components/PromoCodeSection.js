import React from 'react';

const PromoCodeSection = ({ 
  promoCode, 
  setPromoCode, 
  promoDiscount, 
  promoError, 
  promoApplied, 
  isCheckingPromo,
  checkPromoCode,
  removePromoCode 
}) => {
  return (
    <div className="space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Kod promocyjny"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm font-medium"
            disabled={promoApplied || isCheckingPromo}
          />
          {!promoApplied ? (
            <button
              type="button"
              onClick={checkPromoCode}
              disabled={isCheckingPromo || !promoCode.trim()}
              className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isCheckingPromo ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Sprawdź'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={removePromoCode}
              className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Usuń
            </button>
          )}
        </div>
        
        {promoError && (
          <p className="text-red-600 text-sm">{promoError}</p>
        )}
        
        {promoApplied && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-md">
            <p className="text-green-700 font-medium text-sm">
              ✅ Kod zastosowany! Zniżka: {promoDiscount}%
            </p>
          </div>
        )}
    </div>
  );
};

export default PromoCodeSection;
