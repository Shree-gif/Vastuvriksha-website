import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeContent } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

function Home() {
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

  // Service images for homepage cards
  const serviceImages = {
    0: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop', // Interior Design - modern room
    1: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop', // Architecture - architectural plans
    2: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop', // Space Planning - floor plan
    3: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop', // 3D Visualization - 3D rendered architectural space
    4: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop', // Consultation - office meeting
    5: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop'  // Site Management - interior construction work supervision
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
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <p className="hero-description">{t('hero.description')}</p>
          <div className="hero-cta">
            <Link to="/projects" className="btn btn-primary">
              {t('hero.exploreBtn')}
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              {t('hero.contactBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section services-preview">
        <div className="container">
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-subtitle">
            {t('services.subtitle')}
          </p>
          
          <div className="services-grid">
            {services.slice(0, 6).map((service, index) => {
              const mapKey = (title) => {
                switch (title) {
                  case 'Interior Design': return 'interiorDesign';
                  case 'Architecture': return 'architecture';
                  case 'Space Planning': return 'spacePlanning';
                  case '3D Visualization': return 'visualization';
                  case 'Consultation': return 'consultation';
                  case 'Site Management': return 'siteManagement';
                  default: return null;
                }
              };
              const key = mapKey(service.title);
              const localizedTitle = key ? t(`services.${key}.title`) : service.title;
              const localizedDesc = key ? t(`services.${key}.description`) : service.description;
              return (
              <div key={service.id} className="service-card">
                <div className="service-image-wrapper">
                  <img src={serviceImages[index]} alt={localizedTitle} className="service-bg-image" />
                  <div className="service-icon-overlay">{service.icon}</div>
                </div>
                <div className="service-card-content">
                  <h3 className="service-title">{localizedTitle}</h3>
                  <p className="service-description">{localizedDesc}</p>
                </div>
              </div>
            );})}
          </div>

          <div className="text-center" style={{ marginTop: '60px' }}>
            <Link to="/services" className="btn btn-primary btn-large">
              {t('services.viewAllBtn')}
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
          <h2 className="section-title">{t('whyChoose.title')}</h2>
          <p className="section-subtitle">
            {t('whyChoose.subtitle')}
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-bg-image"></div>
              <div className="feature-content">
                <h3>{t('whyChoose.excellence.title')}</h3>
                <div className="feature-icon">✨</div>
                <p>{t('whyChoose.excellence.description')}</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-bg-image"></div>
              <div className="feature-content">
                <h3>{t('whyChoose.focused.title')}</h3>
                <div className="feature-icon">🎯</div>
                <p>{t('whyChoose.focused.description')}</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-bg-image"></div>
              <div className="feature-content">
                <h3>{t('whyChoose.delivery.title')}</h3>
                <div className="feature-icon">⚡</div>
                <p>{t('whyChoose.delivery.description')}</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-bg-image"></div>
              <div className="feature-content">
                <h3>{t('whyChoose.quality.title')}</h3>
                <div className="feature-icon">💎</div>
                <p>{t('whyChoose.quality.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t('cta.title')}</h2>
            <p>{t('cta.subtitle')}</p>
            <Link to="/contact" className="btn btn-primary btn-large">
              {t('cta.button')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;