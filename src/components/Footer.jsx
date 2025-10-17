import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeContent } from '../utils/storage';
import './Footer.css';

function Footer() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    initializeContent().then(data => setContent(data));

    const handleStorageChange = () => {
      initializeContent().then(data => setContent(data));
    };

    window.addEventListener('contentUpdate', handleStorageChange);
    return () => window.removeEventListener('contentUpdate', handleStorageChange);
  }, []);

  if (!content) return null;

  const currentYear = new Date().getFullYear();
  const { siteInfo } = content;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">{siteInfo.companyName}</h3>
            <p className="footer-description">{siteInfo.tagline}</p>
            <p className="footer-description">{siteInfo.description}</p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
            <ul className="footer-contact">
              {siteInfo.email && (
                <li>
                  <span className="contact-icon">✉️</span>
                  <a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a>
                </li>
              )}
              {siteInfo.phone && (
                <li>
                  <span className="contact-icon">📞</span>
                  <a href={`tel:${siteInfo.phone}`}>{siteInfo.phone}</a>
                </li>
              )}
              {siteInfo.address && (
                <li>
                  <span className="contact-icon">📍</span>
                  <span>{siteInfo.address}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="social-links">
              {siteInfo.socialMedia.facebook && (
                <a 
                  href={siteInfo.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Facebook"
                >
                  Facebook
                </a>
              )}
              {siteInfo.socialMedia.instagram && (
                <a 
                  href={siteInfo.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Instagram"
                >
                  Instagram
                </a>
              )}
              {siteInfo.socialMedia.linkedin && (
                <a 
                  href={siteInfo.socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn"
                >
                  LinkedIn
                </a>
              )}
              {siteInfo.socialMedia.twitter && (
                <a 
                  href={siteInfo.socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Twitter"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {siteInfo.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;



