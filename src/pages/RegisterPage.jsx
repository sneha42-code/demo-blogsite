import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Set page title
    document.title = "Create Account - BlogHub";
  }, []);

  // Redirect if user is already logged in
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page register-page">
      <div className="auth-container">
        <div className="auth-image">
          <img src="/images/register-illustration.svg" alt="Register" />
        </div>

        <div className="auth-form-wrapper">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
