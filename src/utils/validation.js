/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if password meets strength requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: "Password is required",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character",
    };
  }

  return {
    isValid: true,
    message: "Password is strong",
  };
};

/**
 * Validate blog form data
 * @param {Object} formData - Blog form data
 * @returns {Object} Validation errors
 */
export const validateBlogForm = (formData) => {
  const errors = {};

  // Title validation
  if (!formData.title) {
    errors.title = "Title is required";
  } else if (formData.title.length < 3) {
    errors.title = "Title must be at least 3 characters long";
  } else if (formData.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  // Content validation
  if (!formData.content) {
    errors.content = "Content is required";
  } else if (formData.content.length < 50) {
    errors.content = "Content must be at least 50 characters long";
  }

  // Excerpt validation
  if (formData.excerpt && formData.excerpt.length > 200) {
    errors.excerpt = "Excerpt must be less than 200 characters";
  }

  return errors;
};

/**
 * Validate registration form data
 * @param {Object} formData - Registration form data
 * @returns {Object} Validation errors
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name) {
    errors.name = "Name is required";
  } else if (formData.name.length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  // Email validation
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Password validation
  if (!formData.password) {
    errors.password = "Password is required";
  } else {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }
  }

  // Confirm password validation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

/**
 * Validate login form data
 * @param {Object} formData - Login form data
 * @returns {Object} Validation errors
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  // Email validation
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Password validation
  if (!formData.password) {
    errors.password = "Password is required";
  }

  return errors;
};

/**
 * Validate comment data
 * @param {string} comment - Comment content
 * @returns {Object} Validation result
 */
export const validateComment = (comment) => {
  if (!comment || comment.trim() === "") {
    return {
      isValid: false,
      message: "Comment cannot be empty",
    };
  }

  if (comment.length > 1000) {
    return {
      isValid: false,
      message: "Comment must be less than 1000 characters",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};
