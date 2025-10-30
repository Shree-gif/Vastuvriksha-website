import { useState, useEffect } from 'react';
import { initializeContent } from '../utils/storage';
import { getAllProjects } from '../firebase/projectService';
import { useLanguage } from '../context/LanguageContext';
import './Projects.css';

function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // Try Firebase first
      try {
        const fetchedProjects = await getAllProjects();
        setProjects(fetchedProjects);
      } catch (firebaseError) {
        // If Firebase fails, use localStorage
        console.log('Firebase not configured, using localStorage');
        const data = await initializeContent();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Public page is read-only; adding projects moved to Admin page
  // Filter out projects with no title (empty placeholders)
  const validProjects = projects.filter(p => p.title && p.title.trim() !== '');
  
  const filteredProjects = filter === 'all' 
    ? validProjects
    : validProjects.filter(p => p.category === filter || p.status === filter);

  const categories = ['all', 'residential', 'commercial', 'completed', 'ongoing'];

  return (
    <div className="projects-page">
      {/* Projects Hero */}
      <section className="projects-hero">
        <div className="container">
          <h1 className="page-title">{t('projects.title')}</h1>
          <p className="page-subtitle">
            {t('projects.subtitle')}
          </p>
        </div>
      </section>

      {/* Projects Content */}
      <section className="section projects-content">
        <div className="container">
          {/* Filter Buttons */}
          <div className="projects-controls">
            <div className="filter-buttons">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat === 'all' ? t('projects.all') : 
                   cat === 'residential' ? t('projects.residential') :
                   cat === 'commercial' ? t('projects.commercial') :
                   cat === 'completed' ? t('projects.completed') :
                   cat === 'ongoing' ? t('projects.ongoing') :
                   cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="projects-gallery">
              {filteredProjects.map(project => (
                <div key={project.id} className="project-gallery-card">
                  <div className="project-gallery-image">
                    {project.image ? (
                      <img src={project.image} alt={project.title} />
                    ) : (
                      <div className="project-placeholder">
                        <span className="placeholder-icon">🏗️</span>
                        <span className="placeholder-text">No Image</span>
                      </div>
                    )}
                    <div className="project-gallery-overlay">
                      <div className="project-badges">
                        {project.category && (
                          <span className="project-badge category-badge">
                            {project.category}
                          </span>
                        )}
                        {project.status && (
                          <span className={`project-badge status-badge status-${project.status}`}>
                            {project.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="project-gallery-info">
                    <h3 className="project-gallery-title">{project.title}</h3>
                    
                    <div className="project-meta">
                      {project.location && (
                        <span className="project-meta-item">
                          <span className="meta-icon">📍</span>
                          {project.location}
                        </span>
                      )}
                      {project.year && (
                        <span className="project-meta-item">
                          <span className="meta-icon">📅</span>
                          {project.year}
                        </span>
                      )}
                    </div>
                    
                    {project.description && (
                      <p className="project-gallery-description">{project.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>{t('projects.emptyState')}</h3>
              <p>
                {t('projects.emptyMessage')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Project Types Info */}
      {validProjects.length > 0 && (
        <section className="section project-types">
          <div className="container">
            <h2 className="section-title">{t('projects.projectTypes')}</h2>
            
            <div className="types-grid">
              <div className="type-card">
                <div className="type-icon">🏠</div>
                <h3>{t('projects.residential')}</h3>
                <p>{t('projects.residentialDesc')}</p>
              </div>
              <div className="type-card">
                <div className="type-icon">🏢</div>
                <h3>{t('projects.commercial')}</h3>
                <p>{t('projects.commercialDesc')}</p>
              </div>
              <div className="type-card">
                <div className="type-icon">🏗️</div>
                <h3>{t('projects.architectural')}</h3>
                <p>{t('projects.architecturalDesc')}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upload moved to Admin panel */}
    </div>
  );
}

export default Projects;



