import React from 'react';
import ListingTypeSelector from './ListingTypeSelector';
import PromoCodeSection from './PromoCodeSection';
import InvoiceSection from './InvoiceSection';
import TermsAndConditions from './TermsAndConditions';
import ActionButtons from './ActionButtons';

const FinalizationPanel = ({
  listingType,
  setListingType,
  promoCode,
  setPromoCode,
  promoDiscount,
  promoError,
  promoApplied,
  isCheckingPromo,
  checkPromoCode,
  removePromoCode,
  needsInvoice,
  setNeedsInvoice,
  invoiceData,
  handleInvoiceDataChange,
  acceptedTerms,
  setAcceptedTerms,
  carConditionConfirmed,
  setCarConditionConfirmed,
  isSubmitting,
  paymentCompleted,
  onPublish,
  onBackToEdit
}) => {
  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Panel header */}
      <div className="bg-gradient-to-r from-[#35530A] to-[#4A6B0F] px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          Finalizacja ogłoszenia
        </h3>
        <p className="text-white/80 text-sm mt-1">Wybierz rodzaj ogłoszenia i opcje płatności</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Step 1: Listing type selection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[#35530A] to-[#4A6B0F] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">1</div>
            <div>
              <h4 className="text-xl font-bold text-gray-800">Wybierz rodzaj ogłoszenia</h4>
              <p className="text-sm text-gray-600">Standardowe lub wyróżnione z większą widocznością</p>
            </div>
          </div>
          
          <ListingTypeSelector 
            listingType={listingType}
            setListingType={setListingType}
          />
        </div>

        {/* Step 2 & 3: Promo code and Invoice in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Step 2: Promo code section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">2</div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Kod promocyjny</h4>
                <p className="text-sm text-gray-600">Masz kod zniżkowy? (opcjonalnie)</p>
              </div>
            </div>
            
            <PromoCodeSection
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              promoDiscount={promoDiscount}
              promoError={promoError}
              promoApplied={promoApplied}
              isCheckingPromo={isCheckingPromo}
              checkPromoCode={checkPromoCode}
              removePromoCode={removePromoCode}
            />
          </div>

          {/* Step 3: Invoice section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">3</div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Faktura VAT</h4>
                <p className="text-sm text-gray-600">Potrzebujesz faktury na firmę? (opcjonalnie)</p>
              </div>
            </div>
            
            <InvoiceSection
              needsInvoice={needsInvoice}
              setNeedsInvoice={setNeedsInvoice}
              invoiceData={invoiceData}
              handleInvoiceDataChange={handleInvoiceDataChange}
            />
          </div>
        </div>

        {/* Step 4: Terms and conditions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">4</div>
            <div>
              <h4 className="text-xl font-bold text-gray-800">Zgody i regulamin</h4>
              <p className="text-sm text-gray-600">Wymagane potwierdzenia przed publikacją</p>
            </div>
          </div>
          
          <TermsAndConditions
            acceptedTerms={acceptedTerms}
            setAcceptedTerms={setAcceptedTerms}
            carConditionConfirmed={carConditionConfirmed}
            setCarConditionConfirmed={setCarConditionConfirmed}
          />
        </div>

        {/* Price summary */}
        <div className="bg-gradient-to-r from-[#35530A] to-[#4A6B0F] text-white rounded-lg p-6 shadow-lg">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Podsumowanie płatności
          </h4>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-medium">
                {listingType === 'wyróżnione' ? 'Ogłoszenie wyróżnione' : 'Ogłoszenie standardowe'}
              </span>
              <div className="text-sm text-white/80">30 dni widoczności</div>
            </div>
            <div className="text-right">
              {promoApplied && promoDiscount > 0 ? (
                <>
                  <span className="text-lg text-white/70 line-through">
                    {listingType === 'wyróżnione' ? '50' : '30'} zł
                  </span>
                  <div className="text-3xl font-bold">
                    {(() => {
                      const baseAmount = listingType === 'wyróżnione' ? 50 : 30;
                      const discountAmount = Math.round(baseAmount * (promoDiscount / 100));
                      return Math.max(baseAmount - discountAmount, 1);
                    })()} zł
                  </div>
                  <div className="text-sm text-green-200 font-medium">
                    Zniżka {promoDiscount}% ({promoCode})
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold">
                  {listingType === 'wyróżnione' ? '50' : '30'} zł
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <ActionButtons
            isSubmitting={isSubmitting}
            paymentCompleted={paymentCompleted}
            onPublish={onPublish}
            onBackToEdit={onBackToEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default FinalizationPanel;
