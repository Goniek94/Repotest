import apiClient from '../client';

/**
 * Wysyła kod weryfikacyjny na telefon
 * 
 * @param {Object} data - Dane do weryfikacji
 * @param {string} data.phoneNumber - Numer telefonu do weryfikacji
 * @param {string} data.type - Typ weryfikacji ('phone')
 * @returns {Promise<Object>} - Obiekt z informacją o statusie operacji
 */
export const sendVerificationCode = async (data) => {
  try {
    const response = await apiClient.post('/users/verification/send', data);
    return response.data;
  } catch (error) {
    console.error('Błąd wysyłania kodu weryfikacyjnego:', error);
    throw error;
  }
};

/**
 * Weryfikuje kod wysłany na telefon
 * 
 * @param {Object} data - Dane do weryfikacji
 * @param {string} data.phoneNumber - Numer telefonu
 * @param {string} data.code - Kod weryfikacyjny
 * @param {string} data.type - Typ weryfikacji ('phone')
 * @returns {Promise<Object>} - Obiekt z informacją o statusie weryfikacji
 */
export const verifyVerificationCode = async (data) => {
  try {
    const response = await apiClient.post('/users/verification/verify', data);
    return response.data;
  } catch (error) {
    console.error('Błąd weryfikacji kodu:', error);
    throw error;
  }
};

/**
 * Weryfikuje kod podczas procesu rejestracji
 * 
 * @param {Object} data - Dane do weryfikacji
 * @param {string} data.phoneNumber - Numer telefonu
 * @param {string} data.code - Kod weryfikacyjny
 * @param {string} data.type - Typ weryfikacji ('phone' lub 'email')
 * @returns {Promise<Object>} - Obiekt z informacją o statusie weryfikacji
 */
export const verifyRegistrationCode = async (data) => {
  try {
    const response = await apiClient.post('/users/verify-code', data);
    return response.data;
  } catch (error) {
    console.error('Błąd weryfikacji kodu rejestracyjnego:', error);
    throw error;
  }
};

/**
 * Uzupełnia profil użytkownika Google
 * Wymagane po rejestracji przez Google, przed weryfikacją telefonu
 * 
 * @param {Object} data - Dane profilu
 * @param {string} data.name - Imię
 * @param {string} data.lastName - Nazwisko
 * @param {string} data.phoneNumber - Numer telefonu
 * @param {string} data.dob - Data urodzenia
 * @returns {Promise<Object>} - Obiekt z informacją o statusie operacji
 */
export const completeGoogleProfile = async (data) => {
  try {
    const response = await apiClient.put('/users/complete-google-profile', data);
    return response.data;
  } catch (error) {
    console.error('Błąd uzupełniania profilu Google:', error);
    throw error;
  }
};

export default {
  sendVerificationCode,
  verifyVerificationCode,
  verifyRegistrationCode,
  completeGoogleProfile
};