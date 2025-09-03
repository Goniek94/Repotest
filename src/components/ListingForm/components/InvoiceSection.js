import React from 'react';

const InvoiceSection = ({ 
  needsInvoice, 
  setNeedsInvoice, 
  invoiceData, 
  handleInvoiceDataChange 
}) => {
  return (
    <div className="space-y-3">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={needsInvoice}
            onChange={(e) => setNeedsInvoice(e.target.checked)}
            className="mt-1 accent-[#35530A]"
          />
          <span className="text-sm text-gray-700">
            Chcę otrzymać fakturę VAT za płatność
          </span>
        </label>
        
        {needsInvoice && (
          <div className="bg-gray-50 p-4 rounded-md space-y-3 border border-gray-200">
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={invoiceData.companyName}
                onChange={(e) => handleInvoiceDataChange('companyName', e.target.value)}
                placeholder="Nazwa firmy *"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none text-sm"
                required
              />
              <input
                type="text"
                value={invoiceData.nip}
                onChange={(e) => handleInvoiceDataChange('nip', e.target.value)}
                placeholder="NIP *"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none text-sm"
                required
              />
              <input
                type="text"
                value={invoiceData.address}
                onChange={(e) => handleInvoiceDataChange('address', e.target.value)}
                placeholder="Adres *"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none text-sm"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={invoiceData.postalCode}
                  onChange={(e) => handleInvoiceDataChange('postalCode', e.target.value)}
                  placeholder="Kod pocztowy *"
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none text-sm"
                  required
                />
                <input
                  type="text"
                  value={invoiceData.city}
                  onChange={(e) => handleInvoiceDataChange('city', e.target.value)}
                  placeholder="Miasto *"
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none text-sm"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              * Pola wymagane. Faktura zostanie wysłana na adres email podany podczas rejestracji.
            </p>
          </div>
        )}
    </div>
  );
};

export default InvoiceSection;
