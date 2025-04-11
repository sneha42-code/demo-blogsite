import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Set page title
    document.title = 'Sign In - BlogHub';
  }, []);
  
  // Redirect if user is already logged in
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <div className="auth-image">
          <img src="/images/login-illustration.svg" alt="Login" />
        </div>
        
        <div className="auth-form-wrapper">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;