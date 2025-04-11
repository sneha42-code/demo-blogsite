/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + "...";
};

/**
 * Generate a slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Calculate reading time for text content
 * @param {string} content - Content to analyze
 * @param {number} wordsPerMinute - Reading speed in words per minute
 * @returns {number} Reading time in minutes
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return 0;

  // Count words (split by whitespace)
  const words = content.trim().split(/\s+/).length;

  // Calculate time in minutes
  const time = Math.ceil(words / wordsPerMinute);

  // Return at least 1 minute
  return Math.max(1, time);
};

/**
 * Parse HTML content and extract plain text
 * @param {string} htmlContent - HTML content to parse
 * @returns {string} Plain text content
 */
export const extractTextFromHtml = (htmlContent) => {
  if (!htmlContent) return "";

  // Create temporary element
  const temp = document.createElement("div");
  temp.innerHTML = htmlContent;

  // Return text content
  return temp.textContent || temp.innerText || "";
};

/**
 * Generate a random color based on a string input (useful for avatar colors)
 * @param {string} str - Input string
 * @returns {string} Hex color code
 */
export const stringToColor = (str) => {
  if (!str) return "#000000";

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
};

/**
 * Get user initials from name
 * @param {string} name - User name
 * @returns {string} User initials
 */
export const getInitials = (name) => {
  if (!name) return "";

  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Format number for display (e.g., 1000 -> 1K)
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return "0";

  if (number < 1000) {
    return number.toString();
  }

  if (number < 1000000) {
    return (number / 1000).toFixed(1) + "K";
  }

  return (number / 1000000).toFixed(1) + "M";
};

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if an object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} Is empty
 */
export const isObjectEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};
