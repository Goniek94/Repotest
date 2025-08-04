import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkedAlt, FaGlobe, FaSave, FaChevronDown, FaChevronUp, FaCheck, FaCog, FaShieldAlt, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import ChangeEmailModal from './ChangeEmailModal';
import ChangePhoneModal from './ChangePhoneModal';
import AuthService from '../../../../services/api/authApi';

const UserDataSection = ({ formData, handleChange, handleSubmit, isSaving }) => {
  const [expandedCards, setExpandedCards] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Handler for saving individual field data
  const handleFieldSave = async (fieldName, newValue) => {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        // Update the form data
        const event = {
          target: {
            name: fieldName,
            value: newValue
          }
        };
        handleChange(event);
        resolve();
      }, 1000);
    });
  };

  // Handler for logout
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      // Przekierowanie na stronę główną po wylogowaniu
      window.location.href = '/';
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
      // Nawet jeśli wystąpi błąd, wylogowujemy lokalnie
      window.location.href = '/';
    }
  };

  // Funkcja sprawdzająca status weryfikacji
  const getVerificationStatus = () => {
    const isEmailVerified = formData.isEmailVerified || formData.emailVerified || true; // domyślnie true
    const isPhoneVerified = formData.isPhoneVerified || formData.phoneVerified || true; // domyślnie true
    const hasName = (formData.name || formData.firstName) && formData.lastName;
    const hasEmail = formData.email;
    
    const isFullyVerified = isEmailVerified && isPhoneVerified && hasName && hasEmail;
    
    return {
      isFullyVerified,
      isEmailVerified,
      isPhoneVerified,
      hasName,
      hasEmail,
      registrationType: formData.registrationType || 'standard'
    };
  };

  // Komponent statusu weryfikacji
  const VerificationStatus = () => {
    const status = getVerificationStatus();
    
    return (
      <div className={`p-4 rounded-xl border mb-4 ${
        status.isFullyVerified 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            status.isFullyVerified 
              ? 'bg-green-500' 
              : 'bg-yellow-500'
          }`}>
            {status.isFullyVerified ? (
              <FaShieldAlt className="text-white text-sm" />
            ) : (
              <FaExclamationTriangle className="text-white text-sm" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-semibold ${
              status.isFullyVerified ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {status.isFullyVerified ? 'Konto w pełni zweryfikowane' : 'Konto wymaga weryfikacji'}
            </h3>
            <p className={`text-xs ${
              status.isFullyVerified ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {status.isFullyVerified 
                ? `Wszystkie dane zostały zweryfikowane ${status.registrationType === 'google' ? '(Google)' : status.registrationType === 'facebook' ? '(Facebook)' : ''}` 
                : 'Niektóre dane wymagają weryfikacji'
              }
            </p>
          </div>
          {status.isFullyVerified && (
            <FaCheck className="text-green-500 text-sm" />
          )}
        </div>
        
        {!status.isFullyVerified && (
          <div className="mt-3 space-y-1">
            {!status.isEmailVerified && (
              <div className="flex items-center space-x-2 text-xs text-yellow-700">
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                <span>Email wymaga weryfikacji</span>
              </div>
            )}
            {!status.isPhoneVerified && (
              <div className="flex items-center space-x-2 text-xs text-yellow-700">
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                <span>Numer telefonu wymaga weryfikacji</span>
              </div>
            )}
            {!status.hasName && (
              <div className="flex items-center space-x-2 text-xs text-yellow-700">
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                <span>Imię i nazwisko wymagają uzupełnienia</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Unified card component - kompaktowy styl jak w powiadomieniach
  const DataCard = ({ id, icon: Icon, iconColor, label, value, isEditable = false, children }) => {
    const isExpanded = expandedCards[id];
    
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div 
          className={`p-4 flex items-center justify-between ${isEditable ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
          onClick={() => isEditable && toggleCard(id)}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center`}>
              <Icon className="text-white text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-600">{value || 'Nie podano'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Expand/Collapse Arrow */}
            {isEditable && (
              <div className="text-gray-400">
                {isExpanded ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
              </div>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isEditable && isExpanded && children && (
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Nagłówek - Zarządzaj danymi */}
      <div className="flex items-center space-x-4 p-6 bg-white rounded-xl border border-gray-200 mb-6 flex-shrink-0">
        <div className="w-12 h-12 bg-[#35530A] rounded-xl flex items-center justify-center">
          <FaCog className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Zarządzaj danymi</h2>
          <p className="text-gray-600 mt-1">Zarządzaj danymi swojego konta</p>
        </div>
      </div>

      {/* Karty z danymi - z suwakiem */}
      <div className="flex-1 overflow-y-auto px-6">
        {/* Status weryfikacji */}
        <VerificationStatus />
        
        <div className="space-y-2 pb-6">
          {/* Imię - nie edytowalne */}
          <DataCard
            id="firstName"
            icon={FaUser}
            iconColor="bg-[#35530A] shadow-md"
            label="IMIĘ"
            value={formData.name || formData.firstName || 'Nie podano'}
            isEditable={false}
          />
          
          {/* Nazwisko - nie edytowalne */}
          <DataCard
            id="lastName"
            icon={FaUser}
            iconColor="bg-[#35530A] shadow-md"
            label="NAZWISKO"
            value={formData.lastName || 'Nie podano'}
            isEditable={false}
          />
          
          {/* Email - edytowalny */}
          <DataCard
            id="email"
            icon={FaEnvelope}
            iconColor="bg-[#35530A] shadow-md"
            label="EMAIL"
            value={formData.email || 'kontakt@autosell.pl'}
            isEditable={true}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Opcje email:</span>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowEmailModal(true)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
                >
                  Zmień adres email
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-600 rounded-lg transition-colors">
                  Wyślij ponownie email weryfikacyjny
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-600 rounded-lg transition-colors">
                  Dodaj dodatkowy email
                </button>
              </div>
            </div>
          </DataCard>
          
          {/* Telefon - edytowalny */}
          <DataCard
            id="phone"
            icon={FaPhone}
            iconColor="bg-[#35530A] shadow-md"
            label="TELEFON"
            value={formData.phoneNumber || 'Nie podano'}
            isEditable={true}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Opcje telefonu:</span>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowPhoneModal(true)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
                >
                  Zmień numer telefonu
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-600 rounded-lg transition-colors">
                  Zweryfikuj numer telefonu
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-600 rounded-lg transition-colors">
                  Usuń numer telefonu
                </button>
              </div>
            </div>
          </DataCard>
          
          {/* Data urodzenia - nie edytowalna */}
          <DataCard
            id="birthDate"
            icon={FaCalendarAlt}
            iconColor="bg-[#35530A] shadow-md"
            label="DATA URODZENIA"
            value={formData.dob ? new Date(formData.dob).toLocaleDateString('pl-PL') : '10.01.1990'}
            isEditable={false}
          />

          {/* Informacja kontaktowa */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#35530A] rounded-md flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-white text-xs" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-700">
                  Problemy z danymi? Skontaktuj się z nami: 
                  <a 
                    href="mailto:kontakt@autosell.pl" 
                    className="font-medium text-[#35530A] hover:text-green-800 underline ml-1 transition-colors"
                  >
                    kontakt@autosell.pl
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <ChangeEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        currentEmail={formData.email || 'kontakt@autosell.pl'}
        onEmailChanged={(newEmail) => {
          // Update form data with new email
          const event = {
            target: {
              name: 'email',
              value: newEmail
            }
          };
          handleChange(event);
        }}
      />

      <ChangePhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        currentPhone={`${formData.phonePrefix || '+48'} ${formData.phoneNumber || '510273086'}`}
        onPhoneChanged={(newPhone) => {
          // Parse the new phone number
          const parts = newPhone.split(' ');
          const prefix = parts[0];
          const number = parts.slice(1).join('');
          
          // Update form data with new phone
          const prefixEvent = {
            target: {
              name: 'phonePrefix',
              value: prefix
            }
          };
          const numberEvent = {
            target: {
              name: 'phoneNumber',
              value: number
            }
          };
          handleChange(prefixEvent);
          handleChange(numberEvent);
        }}
      />
    </div>
  );
};

export default UserDataSection;
