/**
 * Service for browser storage operations
 */
class StorageService {
  // Keys for storage
  USER_KEY = "blog_user";
  TOKEN_KEY = "blog_token";
  THEME_KEY = "blog_theme";

  /**
   * Get user data from localStorage
   * @returns {Object|null} User data or null
   */
  getUser() {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("Error getting user from storage:", error);
      return null;
    }
  }

  /**
   * Save user data to localStorage
   * @param {Object} user User data
   */
  setUser(user) {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user in storage:", error);
    }
  }

  /**
   * Clear user data from localStorage
   */
  clearUser() {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get auth token from localStorage
   * @returns {string|null} Auth token or null
   */
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Save auth token to localStorage
   * @param {string} token Auth token
   */
  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Clear auth token from localStorage
   */
  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Get user theme preference
   * @returns {string} Theme ('light', 'dark', or 'system')
   */
  getTheme() {
    return localStorage.getItem(this.THEME_KEY) || "system";
  }

  /**
   * Save user theme preference
   * @param {string} theme Theme ('light', 'dark', or 'system')
   */
  setTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  /**
   * Save data to localStorage
   * @param {string} key Storage key
   * @param {any} value Data to store
   */
  setItem(key, value) {
    try {
      if (typeof value === "object") {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  /**
   * Get data from localStorage
   * @param {string} key Storage key
   * @param {boolean} parse Whether to parse JSON
   * @returns {any} Stored data
   */
  getItem(key, parse = true) {
    try {
      const item = localStorage.getItem(key);

      if (item && parse) {
        try {
          return JSON.parse(item);
        } catch {
          // If parsing fails, return the raw value
          return item;
        }
      }

      return item;
    } catch (error) {
      console.error("Error getting from localStorage:", error);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   * @param {string} key Storage key
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * Clear all app data from localStorage
   */
  clearAll() {
    this.clearUser();
    this.clearToken();
    // You can keep theme preference if desired
    // localStorage.removeItem(this.THEME_KEY);
  }
}

export default new StorageService();
