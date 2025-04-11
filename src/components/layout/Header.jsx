import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/components/header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>BlogHub</h1>
          </Link>
        </div>
        
        <Navigation />
        
        <div className="auth-buttons">
          {currentUser ? (
            <>
              <span className="welcome-text">Hello, {currentUser.name}</span>
              <Link to="/dashboard" className="btn btn-dashboard">Dashboard</Link>
              <button onClick={logout} className="btn btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">Login</Link>
              <Link to="/register" className="btn btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;