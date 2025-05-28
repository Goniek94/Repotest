import apiClient from './client';

/**
 * Fetch user settings and personal data
 * @returns {Promise<Object>}
 */
export const fetchUserSettings = async () => {
  const response = await apiClient.get('/api/auth/settings');
  return response.data;
};

/**
 * Update user settings and personal data
 * @param {Object} settings - Object with user data and settings
 * @returns {Promise<Object>}
 */
export const updateUserSettings = async (settings) => {
  const response = await apiClient.put('/api/auth/settings', settings);
  return response.data;
};

/**
 * Update user profile data (address, phone, etc.)
 * @param {Object} profileData - Object with user profile data
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (profileData) => {
  const response = await apiClient.put('/users/profile', profileData);
  return response.data;
};
