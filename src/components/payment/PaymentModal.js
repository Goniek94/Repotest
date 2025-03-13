import React, { useState } from 'react';
import { X, CreditCard, Check } from 'lucide-react';
import api from '../../services/api';

const PaymentModal = ({ isOpen, onClose, amount, listingType, adId, onPaymentComplete }) => {
  // Wszystkie hooki useState na górze komponentu
  const [paymentStep, setPaymentStep] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Funkcje obsługi formularza
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    // Add spaces every 4 digits
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (cardNumber.replace(/\s/g, '').length !== 16 || 
        !cardName.trim() ||
        expiry.length !== 5 ||
        cvv.length !== 3) {
      setError('Proszę wypełnić wszystkie pola poprawnie');
      return;
    }
    
    // Simulate payment processing
    setLoading(true);
    
    try {
      // Symulacja płatności - w prawdziwej implementacji tutaj byłoby połączenie
      // z zewnętrznym serwisem płatności
      if (adId) {
        // Używamy naszego API zamiast bezpośrednio axios
        await api.updateAdStatus(adId, 'opublikowane');
      }
      
      // Symulujemy opóźnienie płatności
      setTimeout(() => {
        setLoading(false);
        setPaymentStep(2);
        
        // Powiadom rodzica po 2 sekundach
        setTimeout(() => {
          onPaymentComplete();
        }, 2000);
      }, 2000);
    } catch (err) {
      console.error('Błąd podczas przetwarzania płatności:', err);
      if (err.response) {
        console.error('Status odpowiedzi:', err.response.status);
        console.error('Dane odpowiedzi:', err.response.data);
        setError(err.response.data.message || 'Wystąpił błąd podczas przetwarzania płatności');
      } else if (err.request) {
        console.error('Brak odpowiedzi od serwera:', err.request);
        setError('Brak odpowiedzi od serwera. Sprawdź połączenie z internetem.');
      } else {
        console.error('Błąd konfiguracji żądania:', err.message);
        setError('Wystąpił błąd podczas przetwarzania płatności');
      }
      setLoading(false);
    }
  };

  // Renderujemy tylko gdy modal jest otwarty - po wszystkich definicjach funkcji i hooków
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-[#35530A] text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Płatność za ogłoszenie</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          {paymentStep === 1 ? (
            <>
              <div className="mb-6 text-center">
                <p className="text-lg font-medium text-gray-700">
                  Ogłoszenie {listingType === 'wyróżnione' ? 'wyróżnione' : 'standardowe'}
                </p>
                <p className="text-3xl font-bold text-[#35530A] mt-2">
                  {listingType === 'wyróżnione' ? '50,00 zł' : '30,00 zł'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  za 30 dni publikacji
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Card number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numer karty
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none"
                      required
                    />
                  </div>
                  
                  {/* Card name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imię i nazwisko na karcie
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Jan Kowalski"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none"
                      required
                    />
                  </div>
                  
                  {/* Expiry and CVV */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data ważności
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kod CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-[#35530A] text-white py-3 rounded-md hover:bg-[#2A4208] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      Przetwarzanie...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Zapłać {listingType === 'wyróżnione' ? '50,00 zł' : '30,00 zł'}
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Płatność zatwierdzona!</h2>
              <p className="text-gray-600">
                Twoje ogłoszenie zostało opublikowane i będzie widoczne przez 30 dni.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;