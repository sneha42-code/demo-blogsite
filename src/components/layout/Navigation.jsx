import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="main-navigation">
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className="hamburger-icon"></span>
      </button>
      
      <ul className={`nav-list ${isMenuOpen ? 'menu-open' : ''}`}>
        <li className="nav-item">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/blogs" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Blogs
          </NavLink>
        </li>
        {currentUser && (
          <li className="nav-item">
            <NavLink 
              to="/create-blog" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Write Blog
            </NavLink>
          </li>
        )}
        <li className="nav-item">
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;