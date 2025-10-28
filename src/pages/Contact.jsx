import { useState, useEffect } from 'react';
import { initializeContent } from '../utils/storage';
import './Contact.css';

function Contact() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Since this is frontend-only, we'll just show a success message
    // In a real application, you would send this to a backend service
    setFormStatus('success');
    
    // Reset form after 3 seconds
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
  };

  if (!content) return <div className="loading">Loading...</div>;

  const { siteInfo } = content;

  return (
    <div className="contact-page">
      {/* Contact Hero */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-subtitle">
            Have a project in mind? Let's discuss how we can help transform your space
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2 className="contact-section-title">Send Us a Message</h2>
              
              {formStatus === 'success' && (
                <div className="form-message success">
                  ✅ Thank you! Your message has been received. We'll get back to you soon.
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us about your project or inquiry..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-wrapper">
              <h2 className="contact-section-title">Contact Information</h2>
              
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

                {/* Address (if available) */}
                {siteInfo.address && (
                  <div className="info-card address-card">
                    <div className="info-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="info-content">
                      <h3>Visit Us</h3>
                      <p>{siteInfo.address}</p>
                    </div>
                  </div>
                )}

                {/* Follow Us - Instagram */}
                <div className="info-card social-card">
                  <div className="info-icon instagram-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3>Follow Us</h3>
                    <div className="social-links-contact">
                      <a href="https://www.instagram.com/vastuvriksha_architects?igsh=MXVwbXZubnIwendqMg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="instagram-link">
                        <span className="social-icon">📷</span> @vastuvriksha_architects
                      </a>
                      {siteInfo.socialMedia?.facebook && (
                        <a href={siteInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                          <span className="social-icon">📘</span> Facebook
                        </a>
                      )}
                      {siteInfo.socialMedia?.linkedin && (
                        <a href={siteInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                          <span className="social-icon">💼</span> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours or Additional Info */}
              <div className="additional-info">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
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
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;



