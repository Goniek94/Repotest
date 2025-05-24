import apiClient from './client';

/**
 * Fetch user settings (notification, privacy, security)
 * @returns {Promise<Object>}
 */
export const fetchUserSettings = async () => {
  const response = await apiClient.get('/users/settings');
  return response.data;
};

/**
 * Update user settings (notification, privacy, security)
 * @param {Object} settings - Partial settings object
 * @returns {Promise<Object>}
 */
export const updateUserSettings = async (settings) => {
  const response = await apiClient.put('/users/settings', settings);
  return response.data;
};
