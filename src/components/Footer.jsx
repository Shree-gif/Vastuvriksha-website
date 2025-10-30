import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeContent } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

function Footer() {
  const [content, setContent] = useState(null);
  const { t } = useLanguage();

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
          <div className="footer-section footer-about">
            <h3 className="footer-title">{siteInfo.companyName}</h3>
            <p className="footer-description">{t('footer.tagline')}</p>
            <p className="footer-description">{t('hero.subtitle')}</p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/services">{t('nav.services')}</Link></li>
              <li><Link to="/projects">{t('nav.projects')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('common.contactUs')}</h4>
            <ul className="footer-contact">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                </svg>
                <a href="tel:+919764488882">+91 9764488882</a>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                <a href="mailto:studio@vastuvriksha.com">studio@vastuvriksha.com</a>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <a href="https://maps.app.goo.gl/A2ZaXZupqoLuv3n9A" target="_blank" rel="noopener noreferrer">{t('contact.viewMap')}</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.followUs')}</h4>
            <div className="footer-social">
              <a 
                href="https://www.instagram.com/vastuvriksha_architects?igsh=MXVwbXZubnIwendqMg%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                @vastuvriksha_architects
              </a>
              {siteInfo.socialMedia.facebook && (
                <a 
                  href={siteInfo.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
              )}
              {siteInfo.socialMedia.linkedin && (
                <a 
                  href={siteInfo.socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {siteInfo.companyName}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;



