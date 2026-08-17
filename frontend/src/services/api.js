/**
 * frontend/src/services/api.js
 * 
 * Client service layer for FastAPI User Management & Preferences API.
 */

const API_BASE_URL = '/api/v1';

/**
 * Common fetch helper with JSON handling and Firebase UID header injection.
 */
async function apiRequest(endpoint, method = 'GET', data = null, firebaseUid = 'demo_firebase_uid_123') {
  const headers = {
    'Content-Type': 'application/json',
    'X-Firebase-UID': firebaseUid,
  };

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`API Error on [${method}] ${endpoint}:`, err);
    throw err;
  }
}

export const UserService = {
  /**
   * Health check for user backend router
   */
  async checkHealth() {
    return apiRequest('/users/health');
  },

  /**
   * Sync Firebase user identity to PostgreSQL DB
   */
  async syncUser(userData) {
    return apiRequest('/users/sync', 'POST', userData);
  },

  /**
   * Fetch authenticated user profile and settings
   */
  async getProfile(firebaseUid) {
    return apiRequest('/users/me', 'GET', null, firebaseUid);
  },

  /**
   * Update profile information
   */
  async updateProfile(profileData, firebaseUid) {
    return apiRequest('/users/me', 'PUT', profileData, firebaseUid);
  },

  /**
   * Update user settings and preferences
   */
  async updatePreferences(preferences, firebaseUid) {
    return apiRequest('/users/me/preferences', 'PUT', { preferences }, firebaseUid);
  }
};
