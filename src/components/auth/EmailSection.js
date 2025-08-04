import React from 'react';
import { FaTimes, FaSpinner, FaCheck, FaPaperPlane } from 'react-icons/fa';

const EmailSection = ({ 
  email, 
  confirmEmail,
  emailCode,
  onChange, 
  onBlur, 
  onSendCode,
  error, 
  confirmEmailError,
  isChecking = false,
  isValid = false,
  codeSent = false,
  codeVerified = false,
  sendingCode = false,
  verificationTimer = 0
}) => {
  const isEmailValid = email && email.includes('@') && !error && !isChecking;
  const emailsMatch = email && confirmEmail && email === confirmEmail;

  return (
    <div className="space-y-3">
      <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
        Email *
      </label>
      
      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
          placeholder="twoj@email.com"
          required
        />
        {isChecking && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaSpinner className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
        {!isChecking && isValid && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaCheck className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>

      {/* Powtórz Email */}
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
          Powtórz Email *
        </label>
        <div className="relative">
          <input
            type="email"
            name="confirmEmail"
            value={confirmEmail}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
            placeholder="Powtórz adres email"
            required
          />
          {email && confirmEmail && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {emailsMatch ? (
                <FaCheck className="h-5 w-5 text-green-500" />
              ) : (
                <FaTimes className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {email && confirmEmail && (
          <div className="mt-2 flex items-center">
            {emailsMatch ? (
              <>
                <FaCheck className="text-green-500 mr-2" />
                <span className="text-sm text-green-500">Adresy email są zgodne</span>
              </>
            ) : (
              <>
                <FaTimes className="text-red-500 mr-2" />
                <span className="text-sm text-red-500">Adresy email nie są zgodne</span>
              </>
            )}
          </div>
        )}
        {confirmEmailError && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaTimes className="mr-1" /> {confirmEmailError}
          </p>
        )}
      </div>

      {/* Przycisk wysyłania linku weryfikacyjnego - tylko gdy emaile się zgadzają */}
      {emailsMatch && (
        <div>
          <button
            type="button"
            onClick={onSendCode}
            disabled={!isEmailValid || sendingCode || verificationTimer > 0}
            className="w-full px-4 py-3 bg-[#35530A] hover:bg-[#2D4A06] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {sendingCode ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Wysyłanie...
              </>
            ) : verificationTimer > 0 ? (
              `Wyślij ponownie za ${verificationTimer}s`
            ) : (
              <>
                <FaPaperPlane className="mr-2" /> Wyślij link weryfikacyjny na email
              </>
            )}
          </button>
        </div>
      )}

      {/* Informacja o wysłanym linku */}
      {codeSent && (
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <div className="flex items-start">
            <FaCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-green-800 font-medium mb-2">
                🎭 SYMULACJA: Email zweryfikowany automatycznie!
              </h4>
              <p className="text-green-700 text-sm mb-3">
                <strong>To jest SYMULACJA</strong> - weryfikacja przebiega automatycznie. 
                W rzeczywistości sprawdziłbyś swoją skrzynkę pocztową <strong>{email}</strong>.
              </p>
              <div className="bg-white p-3 rounded border border-green-300">
                <p className="text-xs text-green-600 mb-1">
                  <strong>🎭 SYMULACJA:</strong>
                </p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• Email został automatycznie zweryfikowany</li>
                  <li>• Nie musisz sprawdzać skrzynki pocztowej</li>
                  <li>• Weryfikacja przebiega natychmiastowo</li>
                </ul>
              </div>
              {codeVerified && (
                <div className="mt-3 flex items-center text-green-600">
                  <FaCheck className="mr-2" />
                  <span className="text-sm font-medium">🎭 SYMULACJA: Email został zweryfikowany automatycznie!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <FaTimes className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

export default EmailSection;
