import apiClient from '../client';

/**
 * Fetch user settings and personal data
 * @returns {Promise<Object>}
 */
export const fetchUserSettings = async () => {
  try {
    // Use the profile endpoint which should return all user data including verification status
    const response = await apiClient.get('/api/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

/**
 * Update user settings and personal data
 * @param {Object} settings - Object with user data and settings
 * @returns {Promise<Object>}
 */
export const updateUserSettings = async (settings) => {
  try {
    const response = await apiClient.put('/api/users/profile', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

/**
 * Update user profile data (address, phone, etc.)
 * @param {Object} profileData - Object with user profile data
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/api/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Fetch notification preferences
 * @returns {Promise<Object>}
 */
export const fetchNotificationPreferences = async () => {
  try {
    const response = await apiClient.get('/users/settings/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};

/**
 * Update notification preferences
 * @param {Object} preferences - Notification preferences object
 * @returns {Promise<Object>}
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await apiClient.put('/users/settings/notifications', preferences);
    return response.data;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

/**
 * Fetch privacy settings
 * @returns {Promise<Object>}
 */
export const fetchPrivacySettings = async () => {
  try {
    const response = await apiClient.get('/users/settings/privacy');
    return response.data;
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    throw error;
  }
};

/**
 * Update privacy settings
 * @param {Object} settings - Privacy settings object
 * @returns {Promise<Object>}
 */
export const updatePrivacySettings = async (settings) => {
  try {
    const response = await apiClient.put('/users/settings/privacy', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    throw error;
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Object with old and new password
 * @returns {Promise<Object>}
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.put('/users/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};
