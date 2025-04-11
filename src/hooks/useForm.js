import { useState, useCallback } from "react";

/**
 * Custom hook for form handling
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Form submission handler function
 * @param {Function} validate - Form validation function
 * @returns {Object} Form state and handlers
 */
export const useForm = (
  initialValues = {},
  onSubmit = () => {},
  validate = () => ({})
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Mark field as touched when changed
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  // Handle field blur events
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate field on blur
      const validationErrors = validate(values);
      setErrors(validationErrors);
    },
    [values, validate]
  );

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmissionError(null);
  }, [initialValues]);

  // Set a specific form value
  const setFieldValue = useCallback((field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e && e.preventDefault();

      // Validate all fields
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // Mark all fields as touched
      const touchedFields = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(touchedFields);

      // If no errors, submit the form
      if (Object.keys(validationErrors).length === 0) {
        setIsSubmitting(true);
        setSubmissionError(null);

        try {
          await onSubmit(values);
        } catch (error) {
          setSubmissionError(error.message || "An error occurred");
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validate, onSubmit]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submissionError,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  };
};
