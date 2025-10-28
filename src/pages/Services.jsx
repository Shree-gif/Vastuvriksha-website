import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeContent } from '../utils/storage';
import './Services.css';

function Services() {
  const [content, setContent] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    initializeContent().then(data => setContent(data));

    const handleStorageChange = () => {
      initializeContent().then(data => setContent(data));
    };

    window.addEventListener('contentUpdate', handleStorageChange);
    return () => window.removeEventListener('contentUpdate', handleStorageChange);
  }, []);

  // High-quality architectural images matching each service
  const serviceImages = [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop', // Interior Design - modern room
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop', // Architecture - architectural plans
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop', // Space Planning - floor plan
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&auto=format&fit=crop', // 3D Visualization - 3D rendered architectural model room
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop', // Consultation - office meeting
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop', // Project Management - construction site
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop', // Additional
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop'  // Additional
  ];

  const closeModal = () => setSelectedService(null);

  // Unique features for each service type - inspired by top architectural firms
  const serviceFeatures = {
    'Interior Design': [
      'Space planning and layout optimization',
      'Custom furniture and fixture design',
      'Material selection and color palettes',
      'Lighting design and ambiance creation'
    ],
    'Architecture': [
      'Conceptual and detailed architectural drawings',
      'Building permits and regulatory compliance',
      'Structural design and engineering coordination',
      'Sustainable and energy-efficient solutions'
    ],
    'Space Planning': [
      'Functional layout and flow optimization',
      'Furniture placement and spatial arrangements',
      'Traffic pattern analysis',
      'Ergonomic and accessibility considerations'
    ],
    '3D Visualization': [
      'Photorealistic 3D renderings',
      'Virtual walkthroughs and animations',
      'Material and lighting simulations',
      'Multiple design option presentations'
    ],
    'Consultation': [
      'Initial project assessment and feasibility study',
      'Budget estimation and cost planning',
      'Design direction and style guidance',
      'Vendor and contractor recommendations'
    ],
    'Project Management': [
      'Timeline development and scheduling',
      'Contractor coordination and supervision',
      'Quality control and site inspections',
      'Budget tracking and cost management'
    ]
  };

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
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className="service-detailed-card"
                  onClick={() => setSelectedService({ ...service, image: serviceImages[index % serviceImages.length] })}
                >
                  <div className="service-image-wrapper">
                    <img 
                      src={serviceImages[index % serviceImages.length]} 
                      alt={service.title}
                      className="service-bg-image"
                    />
                    <div className="service-image-overlay">
                      <div className="service-large-icon">{service.icon}</div>
                    </div>
                  </div>
                  <div className="service-card-content">
                    <h2 className="service-card-title">{service.title}</h2>
                    <p className="service-card-description">{service.description}</p>
                    <span className="service-view-more">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No services available at the moment. Please check back later.</p>
            </div>
          )}
        </div>

        {/* Service Modal */}
        {selectedService && (
          <div className="service-modal-overlay" onClick={closeModal}>
            <div className="service-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              <div className="modal-image">
                <img src={selectedService.image} alt={selectedService.title} />
              </div>
              <div className="modal-content">
                <div className="modal-icon">{selectedService.icon}</div>
                <h2>{selectedService.title}</h2>
                <p>{selectedService.description}</p>
                <div className="modal-features">
                  <h3>What We Offer:</h3>
                  <ul>
                    {(serviceFeatures[selectedService.title] || [
                      'Professional consultation and planning',
                      'Custom design solutions tailored to your needs',
                      'High-quality materials and craftsmanship',
                      'Timely project completion'
                    ]).map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <Link to="/contact" className="btn btn-primary" onClick={closeModal}>
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        )}
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



