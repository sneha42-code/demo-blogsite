import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    // In a real app, you would call an API to subscribe the user
    console.log("Subscribing email:", email);

    // Show success message
    setSubscribed(true);
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div className="footer-about">
            <div className="footer-logo">
              <h2>BlogHub</h2>
            </div>
            <p className="footer-description">
              A community of writers and readers sharing stories, ideas, and
              knowledge.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                  />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10C2.38 10 2.38 10 2.38 10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z"
                  />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2M7.6 4C5.6 4 4 5.6 4 7.6V16.4C4 18.4 5.6 20 7.6 20H16.4C18.4 20 20 18.4 20 16.4V7.6C20 5.6 18.4 4 16.4 4H7.6M17.25 5.5C17.94 5.5 18.5 6.06 18.5 6.75C18.5 7.44 17.94 8 17.25 8C16.56 8 16 7.44 16 6.75C16 6.06 16.56 5.5 17.25 5.5M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                  />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 3C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19M18.5 18.5V13.2C18.5 11.4 17.8 10 15.8 10C14.8 10 13.8 10.6 13.5 11.3V10.2H11.1V18.5H13.5V13.6C13.5 12.7 14.1 12 15 12C15.9 12 16.5 12.7 16.5 13.6V18.5H18.5M6.7 8.8C7.6 8.8 8.4 8 8.4 7.1C8.4 6.2 7.6 5.4 6.7 5.4C5.8 5.4 5 6.2 5 7.1C5 8 5.8 8.8 6.7 8.8M8 18.5V10.2H5.5V18.5H8Z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <Link to="/">Home</Link>
              </li>
              <li className="footer-link">
                <Link to="/blogs">Blogs</Link>
              </li>
              <li className="footer-link">
                <Link to="/about">About Us</Link>
              </li>
              <li className="footer-link">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links-section">
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <Link to="/blogs?category=Technology">Technology</Link>
              </li>
              <li className="footer-link">
                <Link to="/blogs?category=Health">Health</Link>
              </li>
              <li className="footer-link">
                <Link to="/blogs?category=Travel">Travel</Link>
              </li>
              <li className="footer-link">
                <Link to="/blogs?category=Food">Food</Link>
              </li>
              <li className="footer-link">
                <Link to="/blogs?category=Lifestyle">Lifestyle</Link>
              </li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3 className="footer-title">Newsletter</h3>
            <p>Subscribe to our newsletter for the latest updates.</p>

            {subscribed ? (
              <div className="subscription-success">
                <p>Thank you for subscribing!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BlogHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
