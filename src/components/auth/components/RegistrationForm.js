// src/components/auth/components/RegistrationForm.js
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

// Import modular components
import InputText from '../InputText';
import InputPassword from '../InputPassword';
import PasswordStrength from '../PasswordStrength';
import PhoneSection from '../PhoneSection';
import EmailSection from '../EmailSection';
import DatePicker from '../DatePicker';
import TermsCheckboxes from '../TermsCheckboxes';

const RegistrationForm = ({
  formData,
  errors,
  isSubmitting,
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
  onSubmit,
  // Verification states
  phoneCodeSent,
  emailCodeSent,
  phoneCodeVerified,
  emailCodeVerified,
  sendingPhoneCode,
  sendingEmailCode,
  verificationTimers,
  onSendVerificationCode
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputText
          label="Imię"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          required
        />
        
        <InputText
          label="Nazwisko"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          required
        />
      </div>

      {/* Date of Birth */}
      <DatePicker
        label="Data urodzenia"
        name="dob"
        value={formData.dob}
        onChange={handleInputChange}
        error={errors.dob}
        required
        minAge={16}
        maxAge={100}
      />

      {/* Email Section */}
      <EmailSection
        email={formData.email}
        confirmEmail={formData.confirmEmail}
        emailCode={formData.emailCode}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onSendCode={() => onSendVerificationCode('email')}
        error={errors.email}
        confirmEmailError={errors.confirmEmail}
        isChecking={isCheckingEmail}
        isValid={formData.email && !errors.email && !isCheckingEmail}
        codeSent={emailCodeSent}
        codeVerified={emailCodeVerified}
        sendingCode={sendingEmailCode}
        verificationTimer={verificationTimers.email}
      />

      {/* Phone Section */}
      <PhoneSection
        phonePrefix={formData.phonePrefix}
        phone={formData.phone}
        phoneCode={formData.phoneCode}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onSendCode={() => onSendVerificationCode('phone')}
        error={errors.phone}
        isChecking={isCheckingPhone}
        codeSent={phoneCodeSent}
        codeVerified={phoneCodeVerified}
        sendingCode={sendingPhoneCode}
        verificationTimer={verificationTimers.phone}
      />

      {/* Password Strength Indicator */}
      <PasswordStrength
        password={formData.password}
        passwordStrength={passwordStrength}
        showPasswordInfo={showPasswordInfo}
        togglePasswordInfo={() => setShowPasswordInfo(!showPasswordInfo)}
      />

      {/* Password Fields */}
      <InputPassword
        label="Hasło"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        required
        showPassword={showPassword}
        togglePasswordVisibility={() => togglePasswordVisibility('password')}
      />

      <InputPassword
        label="Potwierdź hasło"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        error={errors.confirmPassword}
        required
        showPassword={showConfirmPassword}
        togglePasswordVisibility={() => togglePasswordVisibility('confirmPassword')}
        showConfirmation
        confirmValue={formData.password}
      />

      {/* Terms and Conditions */}
      <TermsCheckboxes
        termsAccepted={formData.termsAccepted}
        dataProcessingAccepted={formData.dataProcessingAccepted}
        marketingAccepted={formData.marketingAccepted}
        onChange={handleInputChange}
        error={errors.agreements}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || isCheckingEmail || isCheckingPhone}
        className="w-full bg-[#35530A] hover:bg-[#2D4A06] text-white font-bold py-3 px-4 rounded uppercase transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin mr-2" /> Przetwarzanie...
          </>
        ) : (
          'ZAREJESTRUJ'
        )}
      </button>
    </form>
  );
};

export default RegistrationForm;
