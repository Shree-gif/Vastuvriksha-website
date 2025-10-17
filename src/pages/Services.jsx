import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeContent } from '../utils/storage';
import './Services.css';

function Services() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    initializeContent().then(data => setContent(data));

    const handleStorageChange = () => {
      initializeContent().then(data => setContent(data));
    };

    window.addEventListener('contentUpdate', handleStorageChange);
    return () => window.removeEventListener('contentUpdate', handleStorageChange);
  }, []);

  if (!content) return <div className="loading">Loading...</div>;

  const { services } = content;

  return (
    <div className="services-page">
      {/* Services Hero */}
      <section className="services-hero">
        <div className="container">
          <h1 className="page-title">Our Services</h1>
          <p className="page-subtitle">
            Comprehensive architecture and interior design solutions tailored to your needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section services-content">
        <div className="container">
          {services.length > 0 ? (
            <div className="services-detailed-grid">
              {services.map(service => (
                <div key={service.id} className="service-detailed-card">
                  <div className="service-card-header">
                    <div className="service-large-icon">{service.icon}</div>
                    <h2 className="service-card-title">{service.title}</h2>
                  </div>
                  <p className="service-card-description">{service.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No services available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="section process-section">
        <div className="container">
          <h2 className="section-title">Our Work Process</h2>
          <p className="section-subtitle">
            A streamlined approach to bring your vision to life
          </p>

          <div className="process-grid">
            <div className="process-card">
              <div className="process-step">1</div>
              <h3>Initial Consultation</h3>
              <p>We meet to discuss your requirements, budget, timeline, and design preferences</p>
            </div>
            <div className="process-card">
              <div className="process-step">2</div>
              <h3>Design Proposal</h3>
              <p>Our team creates detailed design concepts with 3D visualizations and material selections</p>
            </div>
            <div className="process-card">
              <div className="process-step">3</div>
              <h3>Refinement</h3>
              <p>We refine the design based on your feedback until it perfectly matches your vision</p>
            </div>
            <div className="process-card">
              <div className="process-step">4</div>
              <h3>Execution</h3>
              <p>Professional implementation with constant quality checks and progress updates</p>
            </div>
            <div className="process-card">
              <div className="process-step">5</div>
              <h3>Final Touches</h3>
              <p>We add finishing touches and ensure every detail meets our quality standards</p>
            </div>
            <div className="process-card">
              <div className="process-step">6</div>
              <h3>Handover</h3>
              <p>Final walkthrough and handover of your beautifully transformed space</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="section why-services">
        <div className="container">
          <h2 className="section-title">Why Choose Our Services</h2>
          
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">✅</div>
              <h3>Expert Team</h3>
              <p>Experienced architects and designers with proven expertise</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✅</div>
              <h3>Custom Solutions</h3>
              <p>Tailored designs that reflect your unique style and requirements</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✅</div>
              <h3>Quality Materials</h3>
              <p>Premium materials and finishes for lasting beauty</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✅</div>
              <h3>Timely Delivery</h3>
              <p>Projects completed within agreed timelines</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✅</div>
              <h3>Budget Friendly</h3>
              <p>Transparent pricing with no hidden costs</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✅</div>
              <h3>After-Sales Support</h3>
              <p>Continued support even after project completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <h2>Ready to Start Your Project?</h2>
          <p>Let's discuss how we can transform your space</p>
          <Link to="/contact" className="btn btn-primary">
            Get a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Services;



