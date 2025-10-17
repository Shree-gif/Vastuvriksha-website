import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeContent } from '../utils/storage';
import './Services.css';

function Services() {
  const [content, setContent] = useState(null);
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await initializeContent();
        setContent(data);
        if (data?.services?.length > 0) {
          setActiveService(data.services[0]);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();

    const handleStorageChange = () => {
      loadContent();
    };

    window.addEventListener('contentUpdate', handleStorageChange);
    return () => window.removeEventListener('contentUpdate', handleStorageChange);
  }, []);

  if (!content || !content.services) {
    return <div className="loading">Loading...</div>;
  }

  const { services } = content;

  const handleServiceClick = (service) => {
    setActiveService(service);
  };

  return (
    <div className="services-page">
      {/* Services Hero */}
      <section className="services-hero">
        <div className="container">
          <h1 className="page-title">Architectural Excellence</h1>
          <p className="page-subtitle">
            Transforming visions into architectural masterpieces with innovative design solutions
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section services-content">
        <div className="container">
          {services.length > 0 ? (
            <div className="services-showcase">
              <div className="services-nav">
                {services.map(service => (
                  <div
                    key={service.id}
                    className={`service-nav-item ${activeService?.id === service.id ? 'active' : ''}`}
                    onClick={() => handleServiceClick(service)}
                  >
                    <span className="service-icon">{service.icon}</span>
                    <h3>{service.title}</h3>
                  </div>
                ))}
              </div>

              {activeService && (
                <div className="service-detail">
                  <div className="service-detail-content">
                    <div className="service-header">
                      <h2>{activeService.title}</h2>
                      <p className="service-description">{activeService.description}</p>
                    </div>

                    <div className="service-features-grid">
                      {activeService.subcategories && (
                        <div className="service-subcategories">
                          <h3>Our Expertise</h3>
                          <ul>
                            {activeService.subcategories.map((subcategory, index) => (
                              <li key={index}>
                                <span className="checkmark">✓</span>
                                {subcategory}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeService.features && (
                        <div className="service-features">
                          <h3>What We Offer</h3>
                          <ul>
                            {activeService.features.map((feature, index) => (
                              <li key={index}>
                                <span className="feature-icon">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {activeService.image && (
                    <div className="service-image">
                      <img src={activeService.image} alt={activeService.title} />
                    </div>
                  )}
                </div>
              )}
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
          <h2 className="section-title">Our Design Process</h2>
          <p className="section-subtitle">
            A systematic approach to bringing your architectural vision to life
          </p>

          <div className="process-grid">
            <div className="process-card">
              <div className="process-step">1</div>
              <h3>Discovery & Consultation</h3>
              <p>In-depth discussion of your vision, requirements, and architectural goals</p>
            </div>
            <div className="process-card">
              <div className="process-step">2</div>
              <h3>Concept Development</h3>
              <p>Creating detailed architectural concepts with 3D visualizations</p>
            </div>
            <div className="process-card">
              <div className="process-step">3</div>
              <h3>Design Refinement</h3>
              <p>Iterative refinement based on your feedback and preferences</p>
            </div>
            <div className="process-card">
              <div className="process-step">4</div>
              <h3>Technical Documentation</h3>
              <p>Detailed construction drawings and technical specifications</p>
            </div>
            <div className="process-card">
              <div className="process-step">5</div>
              <h3>Project Execution</h3>
              <p>Professional implementation with quality control measures</p>
            </div>
            <div className="process-card">
              <div className="process-step">6</div>
              <h3>Final Delivery</h3>
              <p>Project completion and handover of your transformed space</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="section why-services">
        <div className="container">
          <h2 className="section-title">Why Choose Vastuvriksha</h2>
          
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <div>
                <h3>Design Excellence</h3>
                <p>Award-winning architects and designers with proven expertise</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💡</div>
              <div>
                <h3>Innovation</h3>
                <p>Cutting-edge design solutions and sustainable practices</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🌿</div>
              <div>
                <h3>Sustainability</h3>
                <p>Eco-friendly materials and energy-efficient designs</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <div>
                <h3>Efficiency</h3>
                <p>Streamlined process and timely project delivery</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💎</div>
              <div>
                <h3>Quality</h3>
                <p>Premium materials and exceptional craftsmanship</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🤝</div>
              <div>
                <h3>Client Focus</h3>
                <p>Dedicated support throughout your project journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <h2>Ready to Transform Your Space?</h2>
          <p>Let's collaborate to create something extraordinary</p>
          <Link to="/contact" className="btn btn-primary">
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Services;