import { useState, useEffect } from 'react';
import { initializeContent } from '../utils/storage';
import './About.css';

function About() {
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

  const { about } = content;

  return (
    <div className="about-page">
      {/* About Hero */}
      <section className="about-hero">
        <div className="container">
          <h1 className="page-title">{about.title}</h1>
          {about.description && (
            <p className="page-subtitle">{about.description}</p>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {about.stats.some(stat => stat.number) && (
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {about.stats.map(stat => (
                stat.number && (
                  <div key={stat.id} className="stat-card">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
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

      {/* Values Section */}
      <section className="section values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <p className="section-subtitle">
            The principles that guide our work
          </p>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Excellence</h3>
              <p>We strive for excellence in every project, delivering designs that exceed expectations</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Integrity</h3>
              <p>Honesty and transparency in all our client relationships and business practices</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>Constantly evolving our designs with creative and sustainable solutions</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Sustainability</h3>
              <p>Committed to eco-friendly designs that respect the environment</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎨</div>
              <h3>Creativity</h3>
              <p>Bringing unique, personalized designs that reflect your individual style</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⏰</div>
              <h3>Reliability</h3>
              <p>Dependable service and timely project completion you can count on</p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="section approach-section">
        <div className="container">
          <h2 className="section-title">Our Approach</h2>
          <p className="section-subtitle">
            How we bring your vision to life
          </p>

          <div className="approach-timeline">
            <div className="timeline-item">
              <div className="timeline-number">01</div>
              <div className="timeline-content">
                <h3>Consultation</h3>
                <p>We begin by understanding your needs, preferences, and vision for the space</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">02</div>
              <div className="timeline-content">
                <h3>Concept Design</h3>
                <p>Creating initial design concepts and 3D visualizations for your review</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">03</div>
              <div className="timeline-content">
                <h3>Development</h3>
                <p>Refining the design with detailed plans, materials, and specifications</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">04</div>
              <div className="timeline-content">
                <h3>Execution</h3>
                <p>Professional implementation with quality craftsmanship and attention to detail</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;



