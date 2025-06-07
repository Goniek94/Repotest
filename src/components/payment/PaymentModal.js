import React, { useState } from 'react';
import { X, CreditCard, Check } from 'lucide-react';
import api from '../../services/api';

/**
 * Modal płatności
 * @param {Object} props - Właściwości komponentu
 * @param {boolean} props.isOpen - Czy modal jest otwarty
 * @param {Function} props.onClose - Funkcja zamykająca modal
 * @param {number} props.amount - Kwota do zapłaty
 * @param {string} props.listingType - Typ ogłoszenia (standardowe/wyróżnione)
 * @param {string} props.adId - ID ogłoszenia
 * @param {Function} props.onPaymentComplete - Callback po zakończeniu płatności
 */
const PaymentModal = ({ isOpen, onClose, amount, listingType, adId, onPaymentComplete }) => {
  // Wszystkie hooki muszą być wywołane przed jakimikolwiek warunkami
  // Stany dla formularza płatności
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Formatowanie numeru karty (dodanie spacji co 4 cyfry)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Formatowanie daty ważności (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    
    return v;
  };
  
  // Walidacja formularza
  const validateForm = () => {
    const newErrors = {};
    
    // Walidacja numeru karty
    if (!cardNumber) {
      newErrors.cardNumber = 'Numer karty jest wymagany';
    } else if (cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Numer karty powinien mieć 16 cyfr';
    }
    
    // Walidacja imienia i nazwiska
    if (!cardName) {
      newErrors.cardName = 'Imię i nazwisko jest wymagane';
    }
    
    // Walidacja daty ważności
    if (!expiryDate) {
      newErrors.expiryDate = 'Data ważności jest wymagana';
    } else {
      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (!month || !year || month < 1 || month > 12) {
        newErrors.expiryDate = 'Nieprawidłowy format daty (MM/YY)';
      } else if ((year < currentYear) || (year == currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Karta jest nieważna';
      }
    }
    
    // Walidacja CVV
    if (!cvv) {
      newErrors.cvv = 'Kod CVV jest wymagany';
    } else if (cvv.length !== 3) {
      newErrors.cvv = 'Kod CVV powinien mieć 3 cyfry';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Obsługa płatności
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      try {
        // Symulacja płatności - w rzeczywistości tutaj byłoby wywołanie API płatności
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Symulacja udanej płatności
        // W rzeczywistości tutaj byłoby sprawdzenie odpowiedzi z bramki płatności
        
        // Symulacja aktualizacji statusu płatności (będzie zaimplementowane przez rzeczywiste API)
        try {
          await api.updateAdStatus(adId, 'opłacone');
        } catch (error) {
          debug('Symulacja płatności - pomijam błąd API:', error);
          // Kontynuujemy pomimo błędu, bo to tylko symulacja
        }
        
        setPaymentSuccess(true);
        
        // Po 2 sekundach zamknij modal i powiadom rodzica o sukcesie
        setTimeout(() => {
          if (onPaymentComplete) {
            onPaymentComplete();
          }
        }, 2000);
        
      } catch (error) {
        console.error('Błąd podczas przetwarzania płatności:', error);
        setErrors({ general: 'Wystąpił błąd podczas przetwarzania płatności. Spróbuj ponownie.' });
        setIsProcessing(false);
      }
    }
  };
  
  // Jeśli modal nie jest otwarty, zwróć null (ale po zdefiniowaniu wszystkich hooków)
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-[2px] max-w-md w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Przycisk zamknięcia */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Zamknij"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Nagłówek */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {paymentSuccess ? 'Płatność zatwierdzona!' : 'Płatność za ogłoszenie'}
        </h2>
        
        {/* Podsumowanie */}
        <div className="bg-gray-50 p-4 rounded-[2px] mb-6">
          <div className="flex justify-between mb-2">
            <span>Ogłoszenie {listingType.toUpperCase()}</span>
            <span className="font-bold">{amount} PLN</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Razem do zapłaty:</span>
            <span>{amount} PLN</span>
          </div>
        </div>
        
        {paymentSuccess ? (
          // Widok sukcesu
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Check className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <p className="text-lg mb-4">
              Twoja płatność została zrealizowana pomyślnie!
            </p>
            <p className="text-gray-600">
              Ogłoszenie zostanie teraz opublikowane. Za chwilę nastąpi przekierowanie.
            </p>
          </div>
        ) : (
          // Formularz płatności
          <form onSubmit={handlePayment}>
            {/* Błąd ogólny */}
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{errors.general}</p>
              </div>
            )}
            
            {/* Numer karty */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Numer karty
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  className={`
                    w-full p-3 pl-10 border rounded-[2px]
                    focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none
                    ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}
                  `}
                  disabled={isProcessing}
                />
                <CreditCard className="absolute top-3 left-3 text-gray-400" size={20} />
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>
            
            {/* Imię i nazwisko */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Imię i nazwisko
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Jan Kowalski"
                className={`
                  w-full p-3 border rounded-[2px]
                  focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none
                  ${errors.cardName ? 'border-red-500' : 'border-gray-300'}
                `}
                disabled={isProcessing}
              />
              {errors.cardName && (
                <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
              )}
            </div>
            
            {/* Data ważności i CVV */}
            <div className="flex space-x-4 mb-6">
              <div className="w-1/2">
                <label className="block text-gray-700 font-bold mb-2">
                  Data ważności
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={`
                    w-full p-3 border rounded-[2px]
                    focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none
                    ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}
                  `}
                  disabled={isProcessing}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 font-bold mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                  placeholder="123"
                  maxLength="3"
                  className={`
                    w-full p-3 border rounded-[2px]
                    focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none
                    ${errors.cvv ? 'border-red-500' : 'border-gray-300'}
                  `}
                  disabled={isProcessing}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
            
            {/* Przycisk zapłaty */}
            <button
              type="submit"
              className="w-full bg-[#35530A] text-white py-3 px-4 rounded-[2px] hover:bg-[#2D4A06] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? 'Przetwarzanie...' : `Zapłać ${amount} PLN`}
            </button>
            
            {/* Informacja o bezpieczeństwie */}
            <p className="text-gray-500 text-sm text-center mt-4">
              Płatność jest zabezpieczona szyfrowaniem SSL
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;