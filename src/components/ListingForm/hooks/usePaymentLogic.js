import { useState } from 'react';

const usePaymentLogic = () => {
  // Stany dla ogłoszenia
  const [listingType, setListingType] = useState('standardowe');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [carConditionConfirmed, setCarConditionConfirmed] = useState(false);
  
  // Stany dla faktury VAT
  const [needsInvoice, setNeedsInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    companyName: '',
    nip: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  // Stan dla kodu promocyjnego
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  
  // Funkcja sprawdzania kodu promocyjnego
  const checkPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Wprowadź kod promocyjny');
      return;
    }
    
    setIsCheckingPromo(true);
    setPromoError('');
    
    try {
      // Symulacja sprawdzania kodu promocyjnego
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Przykładowe kody promocyjne
      const validCodes = {
        'NOWY10': 10,
        'PREMIUM15': 15,
        'WIOSNA20': 20,
        'AUTOSELL5': 5
      };
      
      const discount = validCodes[promoCode.toUpperCase()];
      
      if (discount) {
        setPromoDiscount(discount);
        setPromoApplied(true);
        setPromoError('');
      } else {
        setPromoError('Nieprawidłowy kod promocyjny');
        setPromoDiscount(0);
        setPromoApplied(false);
      }
    } catch (error) {
      setPromoError('Błąd podczas sprawdzania kodu promocyjnego');
      setPromoDiscount(0);
      setPromoApplied(false);
    } finally {
      setIsCheckingPromo(false);
    }
  };
  
  // Funkcja usuwania kodu promocyjnego
  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
    setPromoError('');
  };
  
  // Funkcja obsługi zmiany danych faktury
  const handleInvoiceDataChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    // Listing states
    listingType,
    setListingType,
    acceptedTerms,
    setAcceptedTerms,
    carConditionConfirmed,
    setCarConditionConfirmed,
    
    // Invoice states
    needsInvoice,
    setNeedsInvoice,
    invoiceData,
    handleInvoiceDataChange,
    
    // Promo code states
    promoCode,
    setPromoCode,
    promoDiscount,
    promoError,
    promoApplied,
    isCheckingPromo,
    checkPromoCode,
    removePromoCode
  };
};

export { usePaymentLogic };
