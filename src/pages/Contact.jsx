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
                {siteInfo.email && (
                  <div className="info-card">
                    <div className="info-icon">✉️</div>
                    <div className="info-content">
                      <h3>Email</h3>
                      <a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a>
                    </div>
                  </div>
                )}

                {siteInfo.phone && (
                  <div className="info-card">
                    <div className="info-icon">📞</div>
                    <div className="info-content">
                      <h3>Phone</h3>
                      <a href={`tel:${siteInfo.phone}`}>{siteInfo.phone}</a>
                    </div>
                  </div>
                )}

                {siteInfo.address && (
                  <div className="info-card">
                    <div className="info-icon">📍</div>
                    <div className="info-content">
                      <h3>Address</h3>
                      <p>{siteInfo.address}</p>
                    </div>
                  </div>
                )}

                {/* Social Media Links */}
                {(siteInfo.socialMedia.facebook || siteInfo.socialMedia.instagram || 
                  siteInfo.socialMedia.linkedin || siteInfo.socialMedia.twitter) && (
                  <div className="info-card social-card">
                    <div className="info-icon">🌐</div>
                    <div className="info-content">
                      <h3>Follow Us</h3>
                      <div className="social-links-contact">
                        {siteInfo.socialMedia.facebook && (
                          <a href={siteInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                            Facebook
                          </a>
                        )}
                        {siteInfo.socialMedia.instagram && (
                          <a href={siteInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                            Instagram
                          </a>
                        )}
                        {siteInfo.socialMedia.linkedin && (
                          <a href={siteInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                        )}
                        {siteInfo.socialMedia.twitter && (
                          <a href={siteInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                            Twitter
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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



