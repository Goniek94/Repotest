import React, { useState } from 'react';
import { X, Phone, Shield, Check, AlertCircle } from 'lucide-react';

/**
 * 📱 CHANGE PHONE MODAL - Modal do zmiany numeru telefonu z weryfikacją SMS
 * 
 * Proces:
 * 1. Wpisanie nowego numeru telefonu
 * 2. Wysłanie kodu SMS
 * 3. Wpisanie kodu i potwierdzenie zmiany
 */
const ChangePhoneModal = ({ isOpen, onClose, currentPhone, onPhoneChanged }) => {
  const [step, setStep] = useState(1); // 1: nowy telefon, 2: kod SMS
  const [phonePrefix, setPhonePrefix] = useState('+48');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Phone prefixes
  const phonePrefixes = [
    { code: '+48', country: 'Polska', flag: '🇵🇱' },
    { code: '+49', country: 'Niemcy', flag: '🇩🇪' },
    { code: '+33', country: 'Francja', flag: '🇫🇷' },
    { code: '+44', country: 'Wielka Brytania', flag: '🇬🇧' },
    { code: '+1', country: 'USA/Kanada', flag: '🇺🇸' },
    { code: '+39', country: 'Włochy', flag: '🇮🇹' },
    { code: '+34', country: 'Hiszpania', flag: '🇪🇸' },
    { code: '+31', country: 'Holandia', flag: '🇳🇱' },
  ];

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhonePrefix('+48');
      setPhoneNumber('');
      setVerificationCode('');
      setError('');
      setSuccess('');
      setCodeSent(false);
      setTimeLeft(0);
    }
  }, [isOpen]);

  // Timer countdown
  React.useEffect(() => {
    let interval = null;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Validate phone number
  const isValidPhone = (phone) => {
    // Basic validation - at least 9 digits
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 9 && cleanPhone.length <= 15;
  };

  // Format phone number for display
  const formatPhoneNumber = (prefix, number) => {
    return `${prefix} ${number}`;
  };

  // Send SMS verification code
  const handleSendSMS = async () => {
    if (!phoneNumber.trim()) {
      setError('Proszę wpisać numer telefonu');
      return;
    }

    if (!isValidPhone(phoneNumber)) {
      setError('Proszę wpisać prawidłowy numer telefonu (9-15 cyfr)');
      return;
    }

    const newFullPhone = formatPhoneNumber(phonePrefix, phoneNumber);
    if (newFullPhone === currentPhone) {
      setError('Nowy numer telefonu musi być różny od obecnego');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call to send SMS code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success
      setCodeSent(true);
      setStep(2);
      setTimeLeft(300); // 5 minutes
      setSuccess(`Kod SMS został wysłany na numer: ${newFullPhone}`);
    } catch (err) {
      setError('Wystąpił błąd podczas wysyłania SMS. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  // Resend SMS code
  const handleResendSMS = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeLeft(300); // Reset timer
      setSuccess('Kod SMS został wysłany ponownie');
    } catch (err) {
      setError('Wystąpił błąd podczas ponownego wysyłania SMS');
    } finally {
      setLoading(false);
    }
  };

  // Verify SMS code and change phone
  const handleVerifyAndChange = async () => {
    if (!verificationCode.trim()) {
      setError('Proszę wpisać kod z SMS');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Kod SMS musi mieć 6 cyfr');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call to verify SMS code and change phone
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification (accept any 6-digit code except 000000 for demo)
      if (verificationCode === '000000') {
        throw new Error('Nieprawidłowy kod SMS');
      }

      // Success
      const newPhone = formatPhoneNumber(phonePrefix, phoneNumber);
      setSuccess('Numer telefonu został pomyślnie zmieniony!');
      
      // Notify parent component
      if (onPhoneChanged) {
        onPhoneChanged(newPhone);
      }

      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Nieprawidłowy kod SMS');
    } finally {
      setLoading(false);
    }
  };

  // Format time left
  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle phone number input (only digits)
  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Zmień numer telefonu</h2>
              <p className="text-sm text-gray-500">Krok {step} z 2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
              <Check className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Step 1: New Phone Number */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Obecny telefon: <span className="font-medium">{currentPhone}</span>
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nowy numer telefonu
                </label>
                
                <div className="flex space-x-2">
                  {/* Country Code Selector */}
                  <select
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    disabled={loading}
                  >
                    {phonePrefixes.map((prefix) => (
                      <option key={prefix.code} value={prefix.code}>
                        {prefix.flag} {prefix.code}
                      </option>
                    ))}
                  </select>
                  
                  {/* Phone Number Input */}
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneInput}
                    placeholder="123456789"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    disabled={loading}
                    maxLength={15}
                  />
                </div>
                
                {phoneNumber && (
                  <p className="text-sm text-gray-500 mt-2">
                    Pełny numer: <span className="font-medium">{formatPhoneNumber(phonePrefix, phoneNumber)}</span>
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Weryfikacja SMS</p>
                    <p>Na nowy numer telefonu zostanie wysłany kod SMS. Zmiana zostanie potwierdzona dopiero po jego wpisaniu.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendSMS}
                disabled={loading || !phoneNumber.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  loading || !phoneNumber.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Wysyłanie SMS...
                  </div>
                ) : (
                  'Wyślij kod SMS'
                )}
              </button>
            </div>
          )}

          {/* Step 2: SMS Verification Code */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Kod SMS został wysłany na: <span className="font-medium">{formatPhoneNumber(phonePrefix, phoneNumber)}</span>
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kod SMS (6 cyfr)
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center text-2xl font-mono tracking-widest"
                  disabled={loading}
                  maxLength={6}
                />
              </div>

              {timeLeft > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Kod wygaśnie za: <span className="font-medium text-red-600">{formatTimeLeft(timeLeft)}</span>
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleResendSMS}
                  disabled={loading || timeLeft > 240} // Allow resend after 1 minute
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    loading || timeLeft > 240
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Wyślij ponownie
                </button>
                
                <button
                  onClick={handleVerifyAndChange}
                  disabled={loading || verificationCode.length !== 6}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    loading || verificationCode.length !== 6
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Weryfikacja...
                    </div>
                  ) : (
                    'Potwierdź zmianę'
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                  disabled={loading}
                >
                  Wróć do zmiany numeru
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePhoneModal;
