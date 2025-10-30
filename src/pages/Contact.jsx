import { useState, useEffect } from 'react';
import { initializeContent } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

function Contact() {
  const { t } = useLanguage();
  const [content, setContent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    initializeContent().then(data => setContent(data));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormStatus('sending');
    
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycby8B_rRKvVNyTxqt2FTehoFVDjv6vCf_4ab3HcL-DFCaIfJr71WFTEEQbPhWidDUkWJsQ/exec';
      const formspreeURL = 'https://formspree.io/f/mwpwqlzr';

      const payload = {
        ...formData,
        timestamp: new Date().toISOString()
      };

      const [fsRes] = await Promise.allSettled([
        fetch(formspreeURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }),
        fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      ]);

      if (fsRes.status === 'fulfilled') {
        setFormStatus('success');
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
          setFormStatus('');
        }, 3000);
      } else {
        setFormStatus('error');
        setTimeout(() => {
          setFormStatus('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      
      setTimeout(() => {
        setFormStatus('');
      }, 5000);
    }
  };

  if (!content) return <div className="loading">Loading...</div>;

  const { siteInfo } = content;

  return (
    <div className="contact-page">
      {/* Contact Hero */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="page-title">{t('contact.title')}</h1>
          <p className="page-subtitle">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2 className="contact-section-title">{t('contact.formTitle')}</h2>
              
              {formStatus === 'sending' && (
                <div className="form-message sending">
                  ⏳ {t('contact.sending')}
                </div>
              )}
              
              {formStatus === 'success' && (
                <div className="form-message success">
                  ✅ {t('contact.success')}
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="form-message error">
                  ❌ {t('contact.error')}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">{t('contact.name')} *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.name')}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">{t('contact.email')} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.email')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">{t('contact.phone')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('contact.phone')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">{t('contact.subject')} *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.subject')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t('contact.message')} *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder={t('contact.message')}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                  {t('contact.sendButton')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-wrapper">
              <h2 className="contact-section-title">{t('contact.contactInfo')}</h2>
              
              <div className="contact-info-cards">
                {/* Email */}
                <div className="info-card email-card">
                  <div className="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3>Email Us</h3>
                    <a href="mailto:studio@vastuvriksha.com">studio@vastuvriksha.com</a>
                  </div>
                </div>

                {/* Phone */}
                <div className="info-card phone-card">
                  <div className="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3>Call Us</h3>
                    <a href="tel:+919764488882">+91 9764488882</a>
                  </div>
                </div>

                {/* Location */}
                <div className="info-card location-card">
                  <div className="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3>Location</h3>
                    <a href="https://maps.app.goo.gl/qWH88EZXmrtdsCS69" target="_blank" rel="noopener noreferrer">View on Google Maps</a>
                  </div>
                </div>

                {/* Follow Us - Instagram */}
                <div className="info-card social-card">
                  <div className="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3>Follow Us</h3>
                    <a href="https://www.instagram.com/vastuvriksha_architects?igsh=MXVwbXZubnIwendqMg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">@vastuvriksha_architects</a>
                  </div>
                </div>
              </div>

              {/* Business Hours or Additional Info */}
              <div className="additional-info">
                <h3>Business Hours</h3>
                <p>Everyday: 9:30 AM - 10:00 PM</p>
                <p>We're here to help you every day of the week</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I get started with my project?</h3>
              <p>Simply fill out the contact form above or give us a call. We'll schedule a consultation to discuss your requirements and vision.</p>
            </div>
            <div className="faq-item">
              <h3>What is the typical project timeline?</h3>
              <p>Project timelines vary depending on scope and complexity. We'll provide a detailed timeline during our initial consultation.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer free consultations?</h3>
              <p>Yes! We offer a free initial consultation to understand your needs and discuss how we can help.</p>
            </div>
            <div className="faq-item">
              <h3>What areas do you serve?</h3>
              <p>Please contact us to discuss your location. We work on projects across various regions.</p>
            </div>
            <div className="faq-item">
              <h3>What services do you specialize in?</h3>
              <p>We specialize in architectural design, interior design, space planning, 3D visualization, and complete project management for residential and commercial spaces.</p>
            </div>
            <div className="faq-item">
              <h3>Can I see examples of your work?</h3>
              <p>Absolutely! Visit our Projects page to explore our portfolio of completed residential, commercial, and architectural projects.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;



