import api from './api';

/**
 * Service for authentication-related API operations
 */
class AuthService {
  /**
   * Login user
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise<Object>} User data with token
   */
  async login(email, password) {
    return api.post('/auth/login', { email, password });
  }

  /**
   * Register new user
   * @param {string} name User name
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise<Object>} User data with token
   */
  async register(name, email, password) {
    return api.post('/auth/register', { name, email, password });
  }

  /**
   * Logout user (clear token on server)
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with client-side logout even if server fails
    }
  }

  /**
   * Update user profile
   * @param {Object} userData Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(userData) {
    return api.put('/users/profile', userData);
  }

  /**
   * Change user password
   * @param {string} currentPassword Current password
   * @param {string} newPassword New password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(currentPassword, newPassword) {
    return api.put('/users/password', { currentPassword, newPassword });
  }

  /**
   * Validate authentication token
   * @returns {Promise<boolean>} Token validity
   */
  async validateToken() {
    try {
      await api.get('/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Send password reset email
   * @param {string} email User email
   * @returns {Promise<Object>} Success message
   */
  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  }

  /**
   * Reset password with token
   * @param {string} token Reset token
   * @param {string} newPassword New password
   * @returns {Promise<Object>} Success message
   */
  async resetPassword(token, newPassword) {
    return api.post('/auth/reset-password', { token, newPassword });
  }

  /**
   * Get current user data
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    return api.get('/users/me');
  }
}

export default new AuthService();