import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeContent } from '../utils/storage';
import './Home.css';

function Home() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    initializeContent().then(data => setContent(data));

    const handleStorageChange = () => {
      initializeContent().then(data => setContent(data));
    };

    window.addEventListener('contentUpdate', handleStorageChange);
    return () => window.removeEventListener('contentUpdate', handleStorageChange);
  }, []);

  // Service images for homepage cards
  const serviceImages = {
    0: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop',
    1: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop',
    2: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
    3: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&auto=format&fit=crop',
    4: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop',
    5: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop'
  };

  if (!content) return <div className="loading">Loading...</div>;

  const { hero, services, projects } = content;
  const featuredProjects = projects.filter(p => p.title && p.status === 'completed').slice(0, 3);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          <p className="hero-description">{hero.description}</p>
          <div className="hero-cta">
            <Link to={hero.ctaLink} className="btn btn-primary">
              {hero.ctaText}
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section services-preview">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive design solutions tailored to your needs
          </p>
          
          <div className="services-grid">
            {services.slice(0, 6).map((service, index) => (
              <div key={service.id} className="service-card">
                <div className="service-image-wrapper">
                  <img src={serviceImages[index]} alt={service.title} className="service-bg-image" />
                  <div className="service-icon-overlay">{service.icon}</div>
                </div>
                <div className="service-card-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '60px' }}>
            <Link to="/services" className="btn btn-primary btn-large">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="section featured-projects">
          <div className="container">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              Explore our latest architectural and interior design work
            </p>

            <div className="projects-grid">
              {featuredProjects.map(project => (
                <div key={project.id} className="project-card">
                  {project.image && (
                    <div className="project-image">
                      <img src={project.image} alt={project.title} loading="lazy" />
                      <div className="project-overlay">
                        <span className="project-category">{project.category}</span>
                      </div>
                    </div>
                  )}
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    {project.location && (
                      <p className="project-location">📍 {project.location}</p>
                    )}
                    {project.description && (
                      <p className="project-description">{project.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center" style={{ marginTop: '60px' }}>
              <Link to="/projects" className="btn btn-primary btn-large">
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="section why-choose-us">
        <div className="container">
          <h2 className="section-title">Why Choose Vastuvriksha</h2>
          <p className="section-subtitle">
            Excellence in every detail
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Creative Excellence</h3>
              <p>Innovative designs that reflect your unique style and vision</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Client-Focused</h3>
              <p>Your satisfaction is our priority, every step of the way</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Timely Delivery</h3>
              <p>Professional execution within agreed timelines</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Quality Assured</h3>
              <p>Premium materials and expert craftsmanship guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Space?</h2>
            <p>Let's bring your vision to life with our expert design services</p>
            <Link to="/contact" className="btn btn-primary btn-large">
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;