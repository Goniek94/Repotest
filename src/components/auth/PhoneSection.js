import React from 'react';
import { FaTimes, FaSpinner, FaPaperPlane, FaCheck } from 'react-icons/fa';

const PhoneSection = ({ 
  phonePrefix, 
  phone, 
  phoneCode,
  onChange, 
  onBlur, 
  onSendCode,
  error, 
  isChecking = false,
  codeSent = false,
  codeVerified = false,
  sendingCode = false,
  verificationTimer = 0
}) => {
  const isPhoneValid = phone && phone.length >= 9 && !error;

  return (
    <div className="space-y-3">
      <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
        Numer telefonu *
      </label>
      
      {/* Numer telefonu */}
      <div className="flex gap-2">
        <div className="w-1/4">
          <select
            name="phonePrefix"
            value={phonePrefix}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
          >
            <option value="+48">+48 (Polska)</option>
            <option value="+49">+49 (Niemcy)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+1">+1 (USA/Kanada)</option>
            <option value="+33">+33 (Francja)</option>
            <option value="+39">+39 (Włochy)</option>
            <option value="+34">+34 (Hiszpania)</option>
          </select>
        </div>
        <div className="w-1/2 relative">
          <input
            type="tel"
            name="phone"
            value={phone || ''}
            onChange={(e) => {
              // Pozwól tylko na cyfry
              const numericValue = e.target.value.replace(/[^0-9]/g, '');
              // Utwórz nowy event z przefiltrowaną wartością
              const event = {
                target: {
                  name: 'phone',
                  value: numericValue
                }
              };
              onChange(event);
            }}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
            placeholder="np. 123456789"
            required
            maxLength={phonePrefix === '+48' ? 9 : 14}
          />
          {isChecking && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSpinner className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
        <div className="w-1/4">
          <button
            type="button"
            onClick={onSendCode}
            disabled={!isPhoneValid || sendingCode || verificationTimer > 0}
            className="w-full px-4 py-3 bg-[#35530A] hover:bg-[#2D4A06] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
          >
            {sendingCode ? (
              <FaSpinner className="animate-spin" />
            ) : verificationTimer > 0 ? (
              `${verificationTimer}s`
            ) : (
              <>
                <FaPaperPlane className="mr-1" /> Wyślij kod
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pole kodu weryfikacyjnego */}
      {codeSent && (
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <label className="block text-blue-800 text-sm font-medium mb-2">
            Kod weryfikacyjny SMS
          </label>
          <div className="relative">
            <input
              type="text"
              name="phoneCode"
              value={phoneCode}
              onChange={onChange}
              placeholder="Wprowadź kod z SMS"
              className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center tracking-widest"
              maxLength="6"
            />
            {codeVerified && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaCheck className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          <p className="text-xs text-blue-600 mt-1">
            🎭 <strong>SYMULACJA:</strong> Kod testowy: <strong>123456</strong>
          </p>
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

export default PhoneSection;
