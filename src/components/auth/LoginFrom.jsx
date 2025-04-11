import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateLoginForm } from '../../utils/validation';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get redirect path from location state or default to home
  const redirectPath = location.state?.from || '/';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear login error when user changes inputs
    if (loginError) {
      setLoginError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateLoginForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setLoginError('');
    
    try {
      const { success, error } = await login(formData.email, formData.password);
      
      if (success) {
        // Redirect to previous page or home
        navigate(redirectPath, { replace: true });
      } else {
        setLoginError(error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setLoginError(err.message || 'An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Welcome Back</h2>
        <p className="form-subtitle">Sign in to continue to BlogHub</p>
        
        {loginError && (
          <div className="error-message">
            <p>{loginError}</p>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={isSubmitting}
            required
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <div className="password-label-group">
            <label htmlFor="password">Password</label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={isSubmitting}
            required
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              name="rememberMe" 
              id="rememberMe"
            />
            Remember me
          </label>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
        
        <div className="auth-form-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
        
        <div className="social-login">
          <p className="social-login-text">Or sign in with</p>
          <div className="social-login-buttons">
            <button type="button" className="social-btn google-btn">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
              </svg>
              Google
            </button>
            <button type="button" className="social-btn facebook-btn">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;