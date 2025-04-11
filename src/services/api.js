import storageService from "./storageService";

// Base API URL - replace with your actual API endpoint
const API_URL = "https://api.yourblogsite.com/api";
// For development, you might use a local server or mock API
// const API_URL = 'http://localhost:5000/api';

/**
 * API client for making HTTP requests
 */
class ApiService {
  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<any>} - Response data
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${API_URL}${endpoint}`);

    // Add query parameters
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const headers = this.getHeaders();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<any>} - Response data
   */
  async post(endpoint, data = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = this.getHeaders();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<any>} - Response data
   */
  async put(endpoint, data = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = this.getHeaders();

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<any>} - Response data
   */
  async delete(endpoint) {
    const url = `${API_URL}${endpoint}`;
    const headers = this.getHeaders();

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get headers including authentication token if available
   * @returns {Object} - Request headers
   */
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = storageService.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle response from API
   * @param {Response} response - Fetch response object
   * @returns {Promise<any>} - Parsed response data
   */
  async handleResponse(response) {
    // For responses with no content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401) {
        storageService.clearToken();
        storageService.clearUser();
        window.location.href = "/login";
      }

      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    console.error("API Error:", error);
    throw error;
  }
}

export default new ApiService();
