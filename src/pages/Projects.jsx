import { useState, useEffect } from 'react';
import { initializeContent } from '../utils/storage';
import './Projects.css';

function Projects() {
  const [content, setContent] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    initializeContent().then(data => setContent(data));

    const handleStorageChange = () => {
      initializeContent().then(data => setContent(data));
    };

    window.addEventListener('contentUpdate', handleStorageChange);
    return () => window.removeEventListener('contentUpdate', handleStorageChange);
  }, []);

  if (!content) return <div className="loading">Loading...</div>;

  const { projects } = content;
  
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
          <h1 className="page-title">Our Projects</h1>
          <p className="page-subtitle">
            Explore our portfolio of stunning architecture and interior design projects
          </p>
        </div>
      </section>

      {/* Projects Content */}
      <section className="section projects-content">
        <div className="container">
          {/* Filter Buttons */}
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
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
              <h3>No Projects Found</h3>
              <p>
                {filter === 'all' 
                  ? 'No projects have been added yet. Check back soon!'
                  : `No ${filter} projects available at the moment.`
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Project Types Info */}
      {validProjects.length > 0 && (
        <section className="section project-types">
          <div className="container">
            <h2 className="section-title">Project Categories</h2>
            
            <div className="types-grid">
              <div className="type-card">
                <div className="type-icon">🏠</div>
                <h3>Residential</h3>
                <p>Homes, apartments, villas, and residential complexes with personalized interior solutions</p>
              </div>
              <div className="type-card">
                <div className="type-icon">🏢</div>
                <h3>Commercial</h3>
                <p>Offices, retail spaces, restaurants, and commercial establishments with functional designs</p>
              </div>
              <div className="type-card">
                <div className="type-icon">🏗️</div>
                <h3>Architectural</h3>
                <p>Complete architectural design and planning for new constructions and renovations</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Projects;



