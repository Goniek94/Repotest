// src/components/auth/Register.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

// Import custom hooks
import { useRegistrationForm } from './hooks/useRegistrationForm';
import { useRegistrationLogic } from './hooks/useRegistrationLogic';

// Import components
import RegistrationForm from './components/RegistrationForm';
import SuccessModal from './components/SuccessModal';
import VerificationStep from './VerificationStep';

function Register() {
  // Form state and validation logic
  const {
    formData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    isCheckingEmail,
    isCheckingPhone,
    passwordStrength,
    showPassword,
    showConfirmPassword,
    showPasswordInfo,
    setShowPasswordInfo,
    handleInputChange,
    handleBlur,
    togglePasswordVisibility,
    validateForm
  } = useRegistrationForm();

  // Registration flow logic
  const {
    step,
    setStep,
    showSuccessModal,
    verificationTimers,
    phoneCodeSent,
    emailCodeSent,
    phoneCodeVerified,
    emailCodeVerified,
    sendingPhoneCode,
    sendingEmailCode,
    handleSendVerificationCode,
    handleSuccessModalClose,
    handleSubmit
  } = useRegistrationLogic();

  // Handle form submission
  const onSubmit = (e) => {
    handleSubmit(e, formData, validateForm, setErrors, setIsSubmitting);
  };

  // Handle verification code sending
  const onSendVerificationCode = (type) => {
    handleSendVerificationCode(type, formData, setErrors);
  };

  // Render verification step
  const renderVerificationStep = (type) => (
    <VerificationStep
      type={type}
      phonePrefix={formData.phonePrefix}
      phone={formData.phone}
      email={formData.email}
      code={formData[`${type}Code`]}
      onChange={handleInputChange}
      onSendCode={() => onSendVerificationCode(type)}
      onBack={() => setStep(step - 1)}
      error={errors[`${type}Code`]}
      verificationTimer={verificationTimers[type]}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="w-full max-w-2xl p-10 bg-white rounded-xl shadow-2xl mx-4 my-12 border border-gray-100">
        
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center text-[#35530A] uppercase">
            {step === 1
              ? 'Zarejestruj się'
              : step === 2
              ? 'Weryfikacja telefonu'
              : 'Weryfikacja email'}
          </h2>
          {step > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#35530A]' : 'bg-gray-300'}`} />
              <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#35530A]' : 'bg-gray-300'}`} />
              <span className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-[#35530A]' : 'bg-gray-300'}`} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
            <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{errors.general}</p>
          </div>
        )}

        {/* Main Content */}
        {step === 1 && (
          <>
            <RegistrationForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              isCheckingEmail={isCheckingEmail}
              isCheckingPhone={isCheckingPhone}
              passwordStrength={passwordStrength}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              showPasswordInfo={showPasswordInfo}
              setShowPasswordInfo={setShowPasswordInfo}
              handleInputChange={handleInputChange}
              handleBlur={handleBlur}
              togglePasswordVisibility={togglePasswordVisibility}
              onSubmit={onSubmit}
              // Verification states
              phoneCodeSent={phoneCodeSent}
              emailCodeSent={emailCodeSent}
              phoneCodeVerified={phoneCodeVerified}
              emailCodeVerified={emailCodeVerified}
              sendingPhoneCode={sendingPhoneCode}
              sendingEmailCode={sendingEmailCode}
              verificationTimers={verificationTimers}
              onSendVerificationCode={onSendVerificationCode}
            />

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Masz już konto?{' '}
                <Link to="/login" className="text-[#35530A] hover:text-[#2D4A06] font-medium uppercase">
                  Zaloguj się
                </Link>
              </p>
            </div>
          </>
        )}

        {/* Verification Steps */}
        {step === 2 && renderVerificationStep('phone')}
        {step === 3 && renderVerificationStep('email')}

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onClose={handleSuccessModalClose} />
      )}
    </div>
  );
}

export default Register;
