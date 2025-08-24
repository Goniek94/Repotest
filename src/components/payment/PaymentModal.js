import React, { useState } from 'react';
import { X, CreditCard, Check, Smartphone, Building2 } from 'lucide-react';

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
  // Stany dla wyboru metody płatności
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Stany dla formularza płatności kartą
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Stany dla BLIK
  const [blikCode, setBlikCode] = useState('');
  
  // Stany ogólne
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Formatowanie numeru karty (dodanie spacji co 4 cyfry)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
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
  
  
  // Obsługa płatności
  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Pomiń walidację i od razu przejdź do symulacji sukcesu
    setIsProcessing(true);
    
    // Symulacja udanej płatności
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPaymentSuccess(true);
    
    // Po 2 sekundach zamknij modal i powiadom rodzica o sukcesie
    setTimeout(() => {
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 2000);
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
          <div>
            {/* Wybór metody płatności */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Wybierz metodę płatności</h3>
              <div className="space-y-3">
                {/* Karta płatnicza */}
                <label className={`
                  flex items-center p-4 border rounded-[2px] cursor-pointer transition-colors
                  ${paymentMethod === 'card' ? 'border-[#35530A] bg-green-50' : 'border-gray-300 hover:bg-gray-50'}
                `}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 accent-[#35530A]"
                    disabled={isProcessing}
                  />
                  <CreditCard className="w-6 h-6 mr-3 text-gray-600" />
                  <div>
                    <div className="font-medium">Karta płatnicza</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard, Maestro</div>
                  </div>
                </label>

                {/* BLIK */}
                <label className={`
                  flex items-center p-4 border rounded-[2px] cursor-pointer transition-colors
                  ${paymentMethod === 'blik' ? 'border-[#35530A] bg-green-50' : 'border-gray-300 hover:bg-gray-50'}
                `}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="blik"
                    checked={paymentMethod === 'blik'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 accent-[#35530A]"
                    disabled={isProcessing}
                  />
                  <Smartphone className="w-6 h-6 mr-3 text-gray-600" />
                  <div>
                    <div className="font-medium">BLIK</div>
                    <div className="text-sm text-gray-500">Płatność kodem z aplikacji bankowej</div>
                  </div>
                </label>

                {/* Przelewy24 */}
                <label className={`
                  flex items-center p-4 border rounded-[2px] cursor-pointer transition-colors
                  ${paymentMethod === 'p24' ? 'border-[#35530A] bg-green-50' : 'border-gray-300 hover:bg-gray-50'}
                `}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="p24"
                    checked={paymentMethod === 'p24'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 accent-[#35530A]"
                    disabled={isProcessing}
                  />
                  <Building2 className="w-6 h-6 mr-3 text-gray-600" />
                  <div>
                    <div className="font-medium">Przelewy24</div>
                    <div className="text-sm text-gray-500">Przelew bankowy online</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Formularz płatności */}
            <form onSubmit={handlePayment}>
              {/* Błąd ogólny */}
              {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-red-700">{errors.general}</p>
                </div>
              )}

              {/* Formularz dla karty płatniczej */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  {/* Numer karty */}
                  <div>
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
                  <div>
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
                  <div className="flex space-x-4">
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
                </div>
              )}

              {/* Formularz dla BLIK */}
              {paymentMethod === 'blik' && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">
                    Kod BLIK
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={blikCode}
                      onChange={(e) => setBlikCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                      placeholder="123456"
                      maxLength="6"
                      className={`
                        w-full p-3 pl-10 border rounded-[2px] text-center text-2xl tracking-widest
                        focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none
                        ${errors.blikCode ? 'border-red-500' : 'border-gray-300'}
                      `}
                      disabled={isProcessing}
                    />
                    <Smartphone className="absolute top-3 left-3 text-gray-400" size={20} />
                  </div>
                  {errors.blikCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.blikCode}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Wygeneruj kod BLIK w aplikacji bankowej i wprowadź go powyżej
                  </p>
                </div>
              )}

              {/* Formularz dla Przelewy24 */}
              {paymentMethod === 'p24' && (
                <div className="mb-6 p-4 bg-blue-50 rounded-[2px]">
                  <div className="flex items-center mb-2">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium text-blue-800">Przelewy24</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Po kliknięciu "Zapłać" zostaniesz przekierowany do serwisu Przelewy24, 
                    gdzie będziesz mógł wybrać swój bank i dokończyć płatność.
                  </p>
                </div>
              )}
              
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
