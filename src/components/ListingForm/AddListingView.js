import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload } from 'lucide-react';
import PaymentModal from '../payment/PaymentModal';
import { useImageUpload } from '../../hooks/useImageUpload';
import { usePaymentLogic } from './hooks/usePaymentLogic';
import { useListingSubmission } from './hooks/useListingSubmission';
import ListingPreview from './components/ListingPreview';
import FinalizationPanel from './components/FinalizationPanel';

const AddListingView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadImages, isUploading, uploadProgress, error: uploadError } = useImageUpload();
  
  // Initialize listing data from location state
  const [listingData, setListingData] = useState(() => {
    const data = location.state?.listingData || {};
    return data;
  });

  // Redirect to form if no data
  useEffect(() => {
    if (!location.state?.listingData || Object.keys(location.state.listingData).length === 0) {
      navigate('/create-listing');
    }
  }, [location.state, navigate, listingData]);

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Use custom hooks
  const {
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
    setCarConditionConfirmed
  } = usePaymentLogic();

  const {
    isSubmitting,
    adId,
    error,
    success,
    setError,
    setSuccess,
    publishListing,
    handlePaymentComplete
  } = useListingSubmission(uploadImages);

  // Handle back to edit navigation
  const handleBackToEdit = () => {
    try {
      // Prepare data for saving - remove problematic objects
      const tempData = { ...listingData };
      
      // Remove base64 photos that cause localStorage limit issues
      if (tempData.photos) {
        delete tempData.photos;
      }
      
      // Keep only basic image information
      if (tempData.images && Array.isArray(tempData.images)) {
        tempData.images = tempData.images.map(img => {
          if (typeof img === 'string') {
            return img; // URL string
          }
          if (img && typeof img === 'object') {
            return {
              url: img.url || img.src || '',
              name: img.name || ''
            };
          }
          return img;
        });
      }
      
      // Remove other potentially problematic fields
      delete tempData.file;
      delete tempData.files;
      
      // Save data to localStorage
      localStorage.setItem('auto_sell_temp_form', JSON.stringify(tempData));
      
      // Navigate to form
      navigate('/create-listing?from=preview');
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      
      // If saving fails, navigate without saving
      alert('Nie udało się zapisać danych formularza. Przejdziesz do pustego formularza.');
      navigate('/create-listing');
    }
  };

  // Handle publish listing
  const handlePublish = async () => {
    const result = await publishListing(
      listingData,
      listingType,
      acceptedTerms,
      carConditionConfirmed,
      setListingData
    );
    
    if (result) {
      setIsPaymentModalOpen(true);
    }
  };

  // Handle payment completion
  const handlePaymentCompleteWrapper = async () => {
    setPaymentCompleted(true);
    setIsPaymentModalOpen(false);
    await handlePaymentComplete(navigate);
  };

  // Check if we have minimal data to display preview
  const hasMinimalData = listingData && (
    listingData.brand || 
    listingData.model || 
    listingData.price || 
    listingData.description ||
    Object.keys(listingData).length > 5
  );

  // Show loader if no minimal data
  if (!hasMinimalData) {
    // Set timeout for redirect if data doesn't load
    setTimeout(() => {
      if (!hasMinimalData) {
        navigate('/create-listing');
      }
    }, 2000);

    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35530A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie podglądu ogłoszenia...</p>
          <p className="mt-2 text-sm text-gray-500">Jeśli ładowanie trwa zbyt długo, zostaniesz przekierowany do formularza</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%]">
      {/* Preview information */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700 font-medium">
          Podsumowanie formularza - sprawdź poprawność wprowadzonych danych przed kontynuacją
        </p>
      </div>

      {/* Error and success messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      {uploadError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">Błąd przesyłania zdjęć: {uploadError}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700 font-medium">{success}</p>
        </div>
      )}

      {/* Upload progress indicator */}
      {isUploading && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-blue-600 animate-pulse" />
            <div className="flex-1">
              <p className="text-blue-700 font-medium">Przetwarzanie zdjęć...</p>
              <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-blue-600 mt-1">{uploadProgress}% ukończone</p>
            </div>
          </div>
        </div>
      )}

      {/* Listing preview */}
      <ListingPreview 
        listingData={listingData}
        listingType={listingType}
      />

      {/* Finalization panel */}
      <FinalizationPanel
        listingType={listingType}
        setListingType={setListingType}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        promoDiscount={promoDiscount}
        promoError={promoError}
        promoApplied={promoApplied}
        isCheckingPromo={isCheckingPromo}
        checkPromoCode={checkPromoCode}
        removePromoCode={removePromoCode}
        needsInvoice={needsInvoice}
        setNeedsInvoice={setNeedsInvoice}
        invoiceData={invoiceData}
        handleInvoiceDataChange={handleInvoiceDataChange}
        acceptedTerms={acceptedTerms}
        setAcceptedTerms={setAcceptedTerms}
        carConditionConfirmed={carConditionConfirmed}
        setCarConditionConfirmed={setCarConditionConfirmed}
        isSubmitting={isSubmitting}
        paymentCompleted={paymentCompleted}
        onPublish={handlePublish}
        onBackToEdit={handleBackToEdit}
      />

      {/* Payment modal */}
      {isPaymentModalOpen && adId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={(() => {
            const baseAmount = listingType === 'wyróżnione' ? 50 : 30;
            if (promoApplied && promoDiscount > 0) {
              const discountAmount = Math.round(baseAmount * (promoDiscount / 100));
              return Math.max(baseAmount - discountAmount, 1); // Minimum 1 zł
            }
            return baseAmount;
          })()}
          originalAmount={listingType === 'wyróżnione' ? 50 : 30}
          promoCode={promoApplied ? promoCode : null}
          promoDiscount={promoApplied ? promoDiscount : 0}
          needsInvoice={needsInvoice}
          invoiceData={needsInvoice ? invoiceData : null}
          listingType={listingType}
          adId={adId}
          onPaymentComplete={handlePaymentCompleteWrapper}
        />
      )}
    </div>
  );
};

export default AddListingView;
