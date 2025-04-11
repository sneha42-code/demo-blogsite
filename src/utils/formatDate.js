/**
 * Format a date string to a readable format
 * @param {string|Date} dateString - Date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const defaultOptions = {
      format: 'default', // 'default', 'relative', 'short', 'long'
      ...options
    };
    
    // Get current date for relative formatting
    const now = new Date();
    
    // Format based on specified format
    switch (defaultOptions.format) {
      case 'relative':
        return formatRelativeDate(date, now);
        
      case 'short':
        return date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        
      case 'long':
        return date.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
      case 'default':
      default:
        return date.toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
    }
  };
  
  /**
   * Format date as a relative time string
   * @param {Date} date - Date to format
   * @param {Date} now - Current date
   * @returns {string} Relative date string
   */
  const formatRelativeDate = (date, now) => {
    const diffSeconds = Math.floor((now - date) / 1000);
    
    // Less than a minute
    if (diffSeconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    if (diffSeconds < 604800) {
      const days = Math.floor(diffSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Less than a month
    if (diffSeconds < 2592000) {
      const weeks = Math.floor(diffSeconds / 604800);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    
    // Less than a year
    if (diffSeconds < 31536000) {
      const months = Math.floor(diffSeconds / 2592000);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    
    // More than a year
    const years = Math.floor(diffSeconds / 31536000);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };
  
  /**
   * Format date with time
   * @param {string|Date} dateString - Date string or Date object
   * @returns {string} Formatted date with time
   */
  export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Get a human-readable time from date
   * @param {string|Date} dateString - Date string or Date object
   * @returns {string} Time string
   */
  export const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };