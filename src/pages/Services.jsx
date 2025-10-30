import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeContent } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import './Services.css';

function Services() {
  const { t } = useLanguage();
  const [content, setContent] = useState(null);
  const [expandedService, setExpandedService] = useState(null);

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
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop', // Interior Design
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop', // Architecture
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop', // Space Planning
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop', // 3D Visualization - 3D rendered architectural space
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&auto=format&fit=crop', // Consultation
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop', // Site Management - interior construction work supervision
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop'
  ];

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
    'Site Management': [
      'Timeline development and scheduling',
      'Contractor coordination and supervision',
      'Quality control and site inspections',
      'Budget tracking and cost management'
    ]
  };

  if (!content || !content.services) {
    return <div className="loading">Loading...</div>;
  }

  const { services } = content;

  return (
    <div className="services-page">
      {/* Services Grid */}
      <section className="section services-content">
        <div className="container">
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-subtitle">
            {t('services.subtitle')}
          </p>
          {services.length > 0 ? (
            <div className="services-detailed-grid">
              {services.map((service, index) => {
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
                const isExpanded = expandedService === service.id;
                const features = serviceFeatures[service.title] || [
                  'Professional consultation and planning',
                  'Custom design solutions tailored to your needs',
                  'High-quality materials and craftsmanship',
                  'Timely project completion'
                ];

                return (
                  <div 
                    key={service.id} 
                    className={`service-compact-card ${isExpanded ? 'expanded' : ''}`}
                  >
                    <div className="service-compact-preview">
                      <div className="service-compact-image">
                        <img 
                          src={serviceImages[index % serviceImages.length]} 
                          alt={localizedTitle}
                        />
                        <div className="service-compact-icon">{service.icon}</div>
                      </div>
                      <div className="service-compact-content">
                        <h3>{localizedTitle}</h3>
                        <p>{localizedDesc}</p>
                        <button 
                          className="more-details-btn"
                          onClick={() => setExpandedService(isExpanded ? null : service.id)}
                        >
                          {isExpanded ? t('common.readMore').replace('Read More', 'Show Less') : t('services.moreDetails')} →
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="service-expanded-details">
                        <h4>{t('services.whatWeOffer')}</h4>
                        <ul className="service-features-list">
                          {features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                        <Link to="/contact" className="btn btn-primary">
                          {t('services.requestQuote')}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>{t('services.emptyMessage')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Process Section - List-style with dotted arrows */}
      <section className="section process-section">
        <div className="container">
          <h2 className="section-title">{t('services.processTitle')}</h2>
          <p className="section-subtitle">
            {t('services.processSubtitle')}
          </p>

          <div className="process-list">
            <div className="process-step-item">
              <div className="process-step-number">01</div>
              <div className="process-step-content">
                <h3>{t('services.steps.discoveryTitle')}</h3>
                <p>{t('services.steps.discoveryDesc')}</p>
              </div>
            </div>
            <div className="process-arrow-dotted">⋮</div>
            
            <div className="process-step-item">
              <div className="process-step-number">02</div>
              <div className="process-step-content">
                <h3>{t('services.steps.conceptTitle')}</h3>
                <p>{t('services.steps.conceptDesc')}</p>
              </div>
            </div>
            <div className="process-arrow-dotted">⋮</div>
            
            <div className="process-step-item">
              <div className="process-step-number">03</div>
              <div className="process-step-content">
                <h3>{t('services.steps.developmentTitle')}</h3>
                <p>{t('services.steps.developmentDesc')}</p>
              </div>
            </div>
            <div className="process-arrow-dotted">⋮</div>
            
            <div className="process-step-item">
              <div className="process-step-number">04</div>
              <div className="process-step-content">
                <h3>{t('services.steps.documentationTitle')}</h3>
                <p>{t('services.steps.documentationDesc')}</p>
              </div>
            </div>
            <div className="process-arrow-dotted">⋮</div>
            
            <div className="process-step-item">
              <div className="process-step-number">05</div>
              <div className="process-step-content">
                <h3>{t('services.steps.executionTitle')}</h3>
                <p>{t('services.steps.executionDesc')}</p>
              </div>
            </div>
            <div className="process-arrow-dotted">⋮</div>
            
            <div className="process-step-item">
              <div className="process-step-number">06</div>
              <div className="process-step-content">
                <h3>{t('services.steps.finalTitle')}</h3>
                <p>{t('services.steps.finalDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="section why-services">
        <div className="container">
          <h2 className="section-title">{t('services.whyTitle')}</h2>
          <p className="section-subtitle">
            {t('services.whySubtitle')}
          </p>
          
          <div className="benefits-grid">
            <div className="benefit-card benefit-card-1">
              <div className="benefit-icon">🎯</div>
              <h3>{t('services.benefits.designExcellenceTitle')}</h3>
              <p>{t('services.benefits.designExcellenceDesc')}</p>
            </div>
            <div className="benefit-card benefit-card-2">
              <div className="benefit-icon">💡</div>
              <h3>{t('services.benefits.innovationTitle')}</h3>
              <p>{t('services.benefits.innovationDesc')}</p>
            </div>
            <div className="benefit-card benefit-card-3">
              <div className="benefit-icon">🌿</div>
              <h3>{t('services.benefits.sustainabilityTitle')}</h3>
              <p>{t('services.benefits.sustainabilityDesc')}</p>
            </div>
            <div className="benefit-card benefit-card-4">
              <div className="benefit-icon">⚡</div>
              <h3>{t('services.benefits.efficiencyTitle')}</h3>
              <p>{t('services.benefits.efficiencyDesc')}</p>
            </div>
            <div className="benefit-card benefit-card-5">
              <div className="benefit-icon">💎</div>
              <h3>{t('services.benefits.qualityTitle')}</h3>
              <p>{t('services.benefits.qualityDesc')}</p>
            </div>
            <div className="benefit-card benefit-card-6">
              <div className="benefit-icon">🤝</div>
              <h3>{t('services.benefits.clientFocusTitle')}</h3>
              <p>{t('services.benefits.clientFocusDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <h2>{t('services.ctaTitle')}</h2>
          <p>{t('services.ctaSubtitle')}</p>
          <Link to="/contact" className="btn btn-primary">
            {t('services.ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Services;