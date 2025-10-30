import { useState, useEffect } from 'react';
import { initializeContent } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

function About() {
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

  if (!content) return <div className="loading">Loading...</div>;

  const { about } = content;

  return (
    <div className="about-page">
      {/* Mission & Vision - Only show if content exists */}
      {(about.mission || about.vision) && (
        <section className="section mission-vision">
          <div className="container">
            <div className="content-grid">
              {about.mission && (
                <div className="content-card">
                  <div className="card-icon">🎯</div>
                  <h2 className="card-title">Our Mission</h2>
                  <p className="card-content">{about.mission}</p>
                </div>
              )}
              {about.vision && (
                <div className="content-card">
                  <div className="card-icon">👁️</div>
                  <h2 className="card-title">Our Vision</h2>
                  <p className="card-content">{about.vision}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="section values-section">
        <div className="container">
          <h2 className="section-title">{t('about.ourValues')}</h2>
          <p className="section-subtitle">
            {t('about.valuesSubtitle')}
          </p>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>{t('about.excellence.title')}</h3>
              <p>{t('about.excellence.description')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>{t('about.integrity.title')}</h3>
              <p>{t('about.integrity.description')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>{t('about.innovation.title')}</h3>
              <p>{t('about.innovation.description')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>{t('about.sustainability.title')}</h3>
              <p>{t('about.sustainability.description')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎨</div>
              <h3>{t('about.creativity.title')}</h3>
              <p>{t('about.creativity.description')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⏰</div>
              <h3>{t('about.reliability.title')}</h3>
              <p>{t('about.reliability.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="section approach-section">
        <div className="container">
          <h2 className="section-title">{t('about.ourApproach')}</h2>
          <p className="section-subtitle">
            {t('about.approachSubtitle')}
          </p>

          <div className="approach-timeline">
            <div className="timeline-item">
              <div className="timeline-number">01</div>
              <div className="timeline-content">
                <div className="timeline-circular-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&auto=format&fit=crop)'}}></div>
                <h3>{t('services.steps.discoveryTitle')}</h3>
                <p>{t('services.steps.discoveryDesc')}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">02</div>
              <div className="timeline-content">
                <div className="timeline-circular-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&auto=format&fit=crop)'}}></div>
                <h3>{t('services.steps.conceptTitle')}</h3>
                <p>{t('services.steps.conceptDesc')}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">03</div>
              <div className="timeline-content">
                <div className="timeline-circular-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop)'}}></div>
                <h3>{t('services.steps.developmentTitle')}</h3>
                <p>{t('services.steps.developmentDesc')}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">04</div>
              <div className="timeline-content">
                <div className="timeline-circular-image" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&auto=format&fit=crop)'}}></div>
                <h3>{t('services.steps.executionTitle')}</h3>
                <p>{t('services.steps.executionDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;



