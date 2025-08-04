import React, { useState } from 'react';
import { X, Mail, Shield, Check, AlertCircle } from 'lucide-react';

/**
 * 📧 CHANGE EMAIL MODAL - Modal do zmiany adresu email z weryfikacją
 * 
 * Proces:
 * 1. Wpisanie nowego emaila
 * 2. Wysłanie kodu weryfikacyjnego
 * 3. Wpisanie kodu i potwierdzenie zmiany
 */
const ChangeEmailModal = ({ isOpen, onClose, currentEmail, onEmailChanged }) => {
  const [step, setStep] = useState(1); // 1: nowy email, 2: kod weryfikacyjny
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setNewEmail('');
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

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Send verification code
  const handleSendCode = async () => {
    if (!newEmail.trim()) {
      setError('Proszę wpisać nowy adres email');
      return;
    }

    if (!isValidEmail(newEmail)) {
      setError('Proszę wpisać prawidłowy adres email');
      return;
    }

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError('Nowy email musi być różny od obecnego');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call to send verification code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success
      setCodeSent(true);
      setStep(2);
      setTimeLeft(300); // 5 minutes
      setSuccess(`Kod weryfikacyjny został wysłany na adres: ${newEmail}`);
    } catch (err) {
      setError('Wystąpił błąd podczas wysyłania kodu. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeLeft(300); // Reset timer
      setSuccess('Kod weryfikacyjny został wysłany ponownie');
    } catch (err) {
      setError('Wystąpił błąd podczas ponownego wysyłania kodu');
    } finally {
      setLoading(false);
    }
  };

  // Verify code and change email
  const handleVerifyAndChange = async () => {
    if (!verificationCode.trim()) {
      setError('Proszę wpisać kod weryfikacyjny');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Kod weryfikacyjny musi mieć 6 cyfr');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call to verify code and change email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification (accept any 6-digit code for demo)
      if (verificationCode === '000000') {
        throw new Error('Nieprawidłowy kod weryfikacyjny');
      }

      // Success
      setSuccess('Email został pomyślnie zmieniony!');
      
      // Notify parent component
      if (onEmailChanged) {
        onEmailChanged(newEmail);
      }

      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Nieprawidłowy kod weryfikacyjny');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Zmień adres email</h2>
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

          {/* Step 1: New Email */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Obecny email: <span className="font-medium">{currentEmail}</span>
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nowy adres email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="np. nowy@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={loading}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Bezpieczeństwo</p>
                    <p>Na nowy adres email zostanie wysłany kod weryfikacyjny. Zmiana zostanie potwierdzona dopiero po jego wpisaniu.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendCode}
                disabled={loading || !newEmail.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  loading || !newEmail.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Wysyłanie kodu...
                  </div>
                ) : (
                  'Wyślij kod weryfikacyjny'
                )}
              </button>
            </div>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Kod weryfikacyjny został wysłany na: <span className="font-medium">{newEmail}</span>
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kod weryfikacyjny (6 cyfr)
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-2xl font-mono tracking-widest"
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
                  onClick={handleResendCode}
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
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
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
                  Wróć do zmiany emaila
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailModal;
